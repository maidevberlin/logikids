# Phase 7: PDF Generation

## Goal

Enable server-side PDF generation from worksheets using Puppeteer, with LaTeX math rendering via KaTeX.

**Note:** This phase includes frontend work that needs detailed UI/UX planning before implementation.

## Prerequisites

- Phase 6 (Worksheets) completed

## Architecture Overview

```
Frontend                    Backend                     Output
┌─────────────┐            ┌─────────────┐            ┌─────────┐
│ Click       │            │ PDF Service │            │ PDF     │
│ "Generate   │ ──────────>│ ┌─────────┐ │ ──────────>│ File    │
│  PDF"       │            │ │Puppeteer│ │            │         │
└─────────────┘            │ │         │ │            └─────────┘
                           │ │ HTML +  │ │
                           │ │ KaTeX   │ │
                           │ └─────────┘ │
                           └─────────────┘
```

## Backend Implementation

### Module Structure

```
packages/backend/src/core/pdf/
├── service.ts              # PDF generation logic
├── templates/
│   ├── worksheet.html      # Main worksheet template
│   ├── answer-key.html     # Answer key template
│   └── styles.css          # Print styles
└── types.ts

packages/backend/src/teacher/pdf/
├── router.ts               # PDF endpoint
├── controller.ts
└── schemas.ts
```

### Dependencies

Add to `packages/backend/package.json`:

```json
{
  "dependencies": {
    "puppeteer": "^21.0.0",
    "katex": "^0.16.0"
  }
}
```

### Docker Changes

Update `Dockerfile` for Puppeteer dependencies:

```dockerfile
# Install Chromium dependencies
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgdk-pixbuf2.0-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
```

### PDF Service

**core/pdf/service.ts:**

```typescript
import puppeteer, { Browser } from 'puppeteer'
import katex from 'katex'
import { injectable } from 'inversify'

@injectable()
export class PdfService {
  private browser: Browser | null = null

  async initialize() {
    this.browser = await puppeteer.launch({
      headless: true,
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })
  }

  async shutdown() {
    await this.browser?.close()
  }

  async generateWorksheetPdf(options: WorksheetPdfOptions): Promise<Buffer> {
    if (!this.browser) {
      await this.initialize()
    }

    const page = await this.browser!.newPage()

    try {
      // Build HTML content
      const html = this.buildWorksheetHtml(options)

      // Set content
      await page.setContent(html, { waitUntil: 'networkidle0' })

      // Generate PDF
      const pdf = await page.pdf({
        format: 'A4',
        margin: { top: '20mm', right: '15mm', bottom: '20mm', left: '15mm' },
        printBackground: true,
      })

      return Buffer.from(pdf)
    } finally {
      await page.close()
    }
  }

  async generateAnswerKeyPdf(options: WorksheetPdfOptions): Promise<Buffer> {
    // Similar to above but uses answer key template
  }

  private buildWorksheetHtml(options: WorksheetPdfOptions): string {
    const { worksheet, tasks, pdfOptions } = options

    // Process markdown and LaTeX in each task
    const processedTasks = tasks.map((task, index) => ({
      number: index + 1,
      ...task,
      processedQuestion: this.processContent(task.taskJson.task),
      processedOptions: this.processOptions(task.taskJson),
    }))

    // Render header if enabled
    const headerHtml = pdfOptions.header ? this.renderHeader(pdfOptions.header) : ''

    // Render tasks
    const tasksHtml = processedTasks
      .map((task) => this.renderTask(task, pdfOptions.includeAnswers === 'none'))
      .join('\n')

    // Render answer key at end if requested
    const answersHtml =
      pdfOptions.includeAnswers === 'end' ? this.renderAnswerKey(processedTasks) : ''

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css">
          <style>${this.getStyles()}</style>
        </head>
        <body>
          ${headerHtml}
          <div class="tasks">
            ${tasksHtml}
          </div>
          ${answersHtml}
        </body>
      </html>
    `
  }

  private processContent(content: string): string {
    // Replace LaTeX delimiters and render with KaTeX
    return content
      .replace(/\$\$(.*?)\$\$/g, (_, math) => {
        return katex.renderToString(math, { displayMode: true, throwOnError: false })
      })
      .replace(/\$(.*?)\$/g, (_, math) => {
        return katex.renderToString(math, { displayMode: false, throwOnError: false })
      })
  }

  private renderTask(task: ProcessedTask, hideAnswer: boolean): string {
    const taskTypeRenderers: Record<string, Function> = {
      singleChoice: this.renderSingleChoice.bind(this),
      multiSelect: this.renderMultiSelect.bind(this),
      fillInBlank: this.renderFillInBlank.bind(this),
      ordering: this.renderOrdering.bind(this),
      numberInput: this.renderNumberInput.bind(this),
      yesNo: this.renderYesNo.bind(this),
    }

    const renderer = taskTypeRenderers[task.taskJson.type]
    return `
      <div class="task">
        <div class="task-number">${task.number}.</div>
        <div class="task-content">
          <div class="task-question">${task.processedQuestion}</div>
          ${renderer(task, hideAnswer)}
        </div>
      </div>
    `
  }

  private renderSingleChoice(task: ProcessedTask, hideAnswer: boolean): string {
    const options = task.taskJson.options
      .map(
        (opt, i) => `
      <div class="option">
        <span class="option-marker">☐</span>
        <span class="option-text">${this.processContent(opt)}</span>
      </div>
    `
      )
      .join('')

    return `<div class="options single-choice">${options}</div>`
  }

  private renderMultiSelect(task: ProcessedTask, hideAnswer: boolean): string {
    // Similar to single choice but with checkboxes
  }

  private renderFillInBlank(task: ProcessedTask, hideAnswer: boolean): string {
    // Replace blanks with underlines
    const text = task.processedQuestion.replace(/___+/g, '<span class="blank">________</span>')
    return `<div class="fill-blank">${text}</div>`
  }

  private renderOrdering(task: ProcessedTask, hideAnswer: boolean): string {
    const items = task.taskJson.items
      .map(
        (item, i) => `
      <div class="ordering-item">
        <span class="ordering-number">___</span>
        <span class="ordering-text">${this.processContent(item)}</span>
      </div>
    `
      )
      .join('')

    return `<div class="ordering">${items}</div>`
  }

  private renderNumberInput(task: ProcessedTask, hideAnswer: boolean): string {
    return `
      <div class="number-input">
        <span class="answer-label">Answer:</span>
        <span class="answer-box">____________</span>
        ${task.taskJson.unit ? `<span class="unit">${task.taskJson.unit}</span>` : ''}
      </div>
    `
  }

  private renderYesNo(task: ProcessedTask, hideAnswer: boolean): string {
    return `
      <div class="yes-no">
        <span class="option">☐ Yes</span>
        <span class="option">☐ No</span>
      </div>
    `
  }

  private renderAnswerKey(tasks: ProcessedTask[]): string {
    const answers = tasks
      .map(
        (task) => `
      <div class="answer-item">
        <span class="answer-number">${task.number}.</span>
        <span class="answer-value">${this.getAnswer(task)}</span>
      </div>
    `
      )
      .join('')

    return `
      <div class="answer-key">
        <h2>Answer Key</h2>
        ${answers}
      </div>
    `
  }

  private getStyles(): string {
    return `
      body {
        font-family: 'Times New Roman', serif;
        font-size: 12pt;
        line-height: 1.5;
      }
      .header {
        text-align: center;
        margin-bottom: 20px;
        border-bottom: 1px solid #ccc;
        padding-bottom: 10px;
      }
      .header-title { font-size: 18pt; font-weight: bold; }
      .header-meta { font-size: 10pt; color: #666; }
      .task {
        display: flex;
        margin-bottom: 20px;
        page-break-inside: avoid;
      }
      .task-number {
        font-weight: bold;
        width: 30px;
        flex-shrink: 0;
      }
      .task-content { flex: 1; }
      .task-question { margin-bottom: 10px; }
      .options { margin-left: 20px; }
      .option { margin: 5px 0; }
      .option-marker { margin-right: 10px; }
      .blank {
        border-bottom: 1px solid black;
        display: inline-block;
        min-width: 80px;
      }
      .ordering-item {
        margin: 5px 0;
        padding: 5px;
        border: 1px solid #ddd;
      }
      .ordering-number { margin-right: 10px; }
      .answer-key {
        page-break-before: always;
        margin-top: 30px;
        border-top: 2px solid black;
        padding-top: 20px;
      }
      .answer-item { margin: 5px 0; }
      .answer-number { font-weight: bold; margin-right: 10px; }
      @media print {
        .task { page-break-inside: avoid; }
        .answer-key { page-break-before: always; }
      }
    `
  }
}
```

### Router

**teacher/pdf/router.ts:**

```typescript
import { router, teacherProcedure } from '../../trpc'
import { z } from 'zod'

export const pdfRouter = router({
  generate: teacherProcedure
    .input(
      z.object({
        worksheetId: z.string(),
        type: z.enum(['worksheet', 'answerKey', 'both']).default('worksheet'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.pdfController.generate(ctx.userId, input)
    }),
})
```

### Controller

**teacher/pdf/controller.ts:**

```typescript
@injectable()
export class PdfController {
  constructor(
    @inject(TYPES.WorksheetsService) private worksheetsService: WorksheetsService,
    @inject(TYPES.PdfService) private pdfService: PdfService
  ) {}

  async generate(teacherId: string, input: GeneratePdfInput): Promise<PdfResponse> {
    // Get worksheet with tasks
    const worksheet = await this.worksheetsService.get(teacherId, input.worksheetId)

    const results: PdfResponse = {}

    if (input.type === 'worksheet' || input.type === 'both') {
      const pdfBuffer = await this.pdfService.generateWorksheetPdf({
        worksheet,
        tasks: worksheet.tasks,
        pdfOptions: worksheet.pdfOptions,
      })
      results.worksheet = pdfBuffer.toString('base64')
    }

    if (input.type === 'answerKey' || input.type === 'both') {
      const pdfBuffer = await this.pdfService.generateAnswerKeyPdf({
        worksheet,
        tasks: worksheet.tasks,
        pdfOptions: worksheet.pdfOptions,
      })
      results.answerKey = pdfBuffer.toString('base64')
    }

    return results
  }
}
```

## Frontend Implementation

### Routes

```
/worksheets/:id/pdf   → PdfPreview (preview, download options)
```

### Components

**GeneratePdfButton (in WorksheetDetail):**

```typescript
function GeneratePdfButton({ worksheetId }: { worksheetId: string }) {
  const { mutate: generatePdf, isLoading } = trpc.teacher.pdf.generate.useMutation({
    onSuccess: (data) => {
      if (data.worksheet) {
        downloadPdf(data.worksheet, 'worksheet.pdf')
      }
      if (data.answerKey) {
        downloadPdf(data.answerKey, 'answer-key.pdf')
      }
    },
  })

  return (
    <Button
      onClick={() => generatePdf({ worksheetId, type: 'both' })}
      loading={isLoading}
    >
      Download PDF
    </Button>
  )
}

function downloadPdf(base64: string, filename: string) {
  const blob = base64ToBlob(base64, 'application/pdf')
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
```

**PdfPreview (optional enhancement):**

- Show PDF in iframe preview before download
- Let user adjust options before generating
- Progress indicator during generation

### API Calls

```typescript
// Generate PDF
const { mutate: generatePdf, isLoading } = trpc.teacher.pdf.generate.useMutation()

// Usage
generatePdf({
  worksheetId: 'abc123',
  type: 'both', // 'worksheet' | 'answerKey' | 'both'
})
```

## Performance Considerations

### Browser Pool

For production, consider a browser pool to handle concurrent requests:

```typescript
@injectable()
export class PdfService {
  private browserPool: Browser[] = []
  private maxBrowsers = 3

  async getBrowser(): Promise<Browser> {
    // Implement pool logic
  }

  async releaseBrowser(browser: Browser): Promise<void> {
    // Return to pool
  }
}
```

### Caching

Consider caching generated PDFs if worksheets don't change often:

- Cache key: `worksheet:${id}:${updatedAt}:${optionsHash}`
- Store in Redis or filesystem
- Invalidate on worksheet update

### Timeouts

Add timeout for PDF generation:

```typescript
const pdf = await Promise.race([
  page.pdf({ ... }),
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error('PDF generation timeout')), 30000)
  ),
])
```

## Testing

### Backend

1. Generate PDF with single task → verify PDF created
2. Generate PDF with multiple tasks → verify all rendered
3. Generate PDF with LaTeX → verify math rendered correctly
4. Generate answer key → verify answers included
5. Generate without answers → verify answers excluded
6. Generate with header → verify header appears
7. Test each task type renders correctly

### Frontend

1. Click generate → loading state shown
2. Generation complete → PDF downloads
3. Error handling → error message shown
4. Large worksheet → doesn't timeout

## Deployment Notes

- Puppeteer requires additional system dependencies
- Docker image will be larger (~400MB additional)
- Consider separate PDF service container if needed
- Monitor memory usage under load

## Open Questions for Detailed Planning

- PDF page size options (A4, Letter)?
- Font customization?
- Logo/branding in header?
- PDF filename format?
- Rate limiting for PDF generation?

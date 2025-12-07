# Logikids

**Free, AI-powered learning for everyone.**

Not every family can afford private tutoring. Logikids provides personalized, curriculum-aligned learning tasks to all children - regardless of their family's financial situation.

**[Try it out](https://logikids.maidev.de)** (Beta - invite only, contact lamaberlin@gmail.com for access)

## What is Logikids?

Logikids generates educational tasks for **any subject** using AI (LLMs). Teachers and parents define what to teach through simple concept files, and the AI creates age-appropriate, varied exercises.

**Features:**

- **AI-powered task generation** - Creates tasks for any subject and grade level
- **6 task types** - Single choice, multiple select, fill-in-blank, ordering, number input, yes/no
- **Progressive hints** - 4-step AI-generated hints that build on each other: from general approach, to key concept, to major reasoning step, to near-complete guidance - without giving away the answer
- **Adaptive difficulty** - Automatically adjusts (easy/medium/hard) based on performance streaks
- **Gamification** - Star ratings (0-5), day streaks, achievements, subject mastery tracking
- **Privacy-first** - All data stored locally with zero-knowledge encryption. No tracking, no cookies. GDPR compliant by design

**This is not a commercial project.** There's no company, no investors, no monetization. Just an open-source tool to make AI useful for society.

## Running Locally

**Prerequisites:**

- Docker and Docker Compose
- An API key for Anthropic, OpenAI, or a local Ollama installation

**Quick start:**

```bash
git clone https://github.com/maidevberlin/logikids.git
cd logikids
./install.sh
```

The install script will:

1. Generate secure secrets
2. Ask which AI provider you want to use
3. Configure everything in a `.env` file
4. Build and start the application

App available at http://localhost:5154

Create an invite code to access: `./invite create "Your name"`

## Contributing

We welcome contributions! This project exists to help children learn.

### For Content Contributors

You don't need to write code. With Claude Code, you can generate curriculum-aligned content using your own API tokens. The skills handle quality automatically.

**Example - generate all math concepts for grade 5:**

```
# In Claude Code, just tell the agent:
"Generate concepts for math grade 5 Germany"
```

The `bulk-generate-concepts` skill will:

1. Research the official curriculum
2. Create properly structured concept files
3. Update translations
4. Validate everything

That's it. Your contribution helps every child using the platform.

### For Developers

**Branching model:**

- Branch from `dev` for features -> PR to `dev`
- Hotfixes: branch from `main` -> PR to `main`
- All PRs require approval before merge

**Important:** There's no money here. We're trying to make AI useful in a social way, not commercial. If you're looking for paid work, this isn't it. If you want to help kids learn, welcome aboard.

## Tech Stack

- **Frontend:** React, TypeScript, Vite, TailwindCSS
- **Backend:** Bun, Express, tRPC
- **AI:** Anthropic Claude, OpenAI, or Ollama
- **Database:** PostgreSQL

## License

Creative Commons Attribution-NonCommercial 4.0 (CC BY-NC 4.0)

Free to share and adapt, but not for commercial use.

## Contact

Maik Maibaum - lamaberlin@gmail.com

Questions? Want an invite code? Want to contribute? Just reach out.

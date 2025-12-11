import 'reflect-metadata'
import { injectable } from 'tsyringe'
import { internalError } from '../common/errors'

interface GoogleTTSRequest {
  input: {
    text: string
  }
  voice: {
    languageCode: string
    name: string
  }
  audioConfig: {
    audioEncoding: string
  }
}

interface GoogleTTSResponse {
  audioContent: string // Base64-encoded audio
}

@injectable()
export class TTSService {
  private readonly apiKey: string
  private readonly voiceDE: string
  private readonly voiceEN: string
  private readonly endpoint = 'https://texttospeech.googleapis.com/v1/text:synthesize'

  constructor() {
    this.apiKey = process.env.GOOGLE_CLOUD_TTS_API_KEY || ''
    this.voiceDE = process.env.TTS_VOICE_DE || 'de-DE-Standard-A'
    this.voiceEN = process.env.TTS_VOICE_EN || 'en-US-Standard-C'

    if (!this.apiKey) {
      throw internalError('GOOGLE_CLOUD_TTS_API_KEY environment variable is required')
    }
  }

  /**
   * Select appropriate voice based on language
   */
  private selectVoice(language: string): { languageCode: string; name: string } {
    // Extract language code (e.g., 'de' from 'de-DE')
    const langCode = language.split('-')[0].toLowerCase()

    switch (langCode) {
      case 'de':
        return { languageCode: 'de-DE', name: this.voiceDE }
      case 'en':
        return { languageCode: 'en-US', name: this.voiceEN }
      default:
        // Default to English for unknown languages
        return { languageCode: 'en-US', name: this.voiceEN }
    }
  }

  /**
   * Synthesize text to audio using Google Cloud TTS API
   * @param text Text to synthesize
   * @param language Language code (e.g., 'de-DE', 'en-US')
   * @returns Audio buffer in MP3 format
   */
  async synthesize(text: string, language: string): Promise<Buffer> {
    const voice = this.selectVoice(language)

    const requestBody: GoogleTTSRequest = {
      input: { text },
      voice,
      audioConfig: {
        audioEncoding: 'MP3',
      },
    }

    try {
      const response = await fetch(`${this.endpoint}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`TTS API error: ${response.status} ${response.statusText}`)
      }

      const data = (await response.json()) as GoogleTTSResponse

      // Decode base64 audio content to buffer
      const audioBuffer = Buffer.from(data.audioContent, 'base64')

      return audioBuffer
    } catch (error) {
      throw error
    }
  }
}

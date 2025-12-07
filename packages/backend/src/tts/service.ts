import 'reflect-metadata'
import { injectable } from 'tsyringe'
import { createLogger } from '../common/logger'
import { ConfigurationError } from '../common/errors'

const logger = createLogger('TTSService')

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
      throw new ConfigurationError('GOOGLE_CLOUD_TTS_API_KEY environment variable is required')
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
        logger.warn('Unknown language, defaulting to English', { language })
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

    logger.debug('Calling Google Cloud TTS API', {
      textLength: text.length,
      language,
      voice: voice.name,
    })

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
        logger.error('Google Cloud TTS API error', {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
        })
        throw new Error(`TTS API error: ${response.status} ${response.statusText}`)
      }

      const data = (await response.json()) as GoogleTTSResponse

      // Decode base64 audio content to buffer
      const audioBuffer = Buffer.from(data.audioContent, 'base64')

      logger.info('TTS synthesis successful', {
        textLength: text.length,
        audioSize: audioBuffer.length,
        language,
      })

      return audioBuffer
    } catch (error) {
      logger.error('Error synthesizing text', { error, textLength: text.length, language })
      throw error
    }
  }
}

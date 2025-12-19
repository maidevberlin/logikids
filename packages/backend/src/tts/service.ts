import 'reflect-metadata'
import { injectable } from 'tsyringe'
import { internalError } from '../common/errors'
import { Language, DEFAULT_LANGUAGE, LANGUAGES } from '@logikids/content/schema'

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

export interface TTSSynthesizeResult {
  audio: Buffer
  characterCount: number
  voiceType: 'standard' | 'wavenet' | 'neural2'
}

@injectable()
export class TTSService {
  private readonly apiKey: string
  private readonly endpoint = 'https://texttospeech.googleapis.com/v1/text:synthesize'

  constructor() {
    this.apiKey = process.env.GOOGLE_CLOUD_TTS_API_KEY || ''

    if (!this.apiKey) {
      throw internalError('GOOGLE_CLOUD_TTS_API_KEY environment variable is required')
    }
  }

  /**
   * Select appropriate voice based on language
   * TTS config is defined in packages/content/languages.ts
   */
  private selectVoice(language: string): { languageCode: string; name: string } {
    // Extract language code (e.g., 'de' from 'de-DE')
    const langCode = language.split('-')[0].toLowerCase() as Language

    const ttsConfig = LANGUAGES[langCode]?.tts || LANGUAGES[DEFAULT_LANGUAGE].tts
    // Use environment variable if set, otherwise use default voice
    const voiceName = process.env[ttsConfig.envVar] || ttsConfig.defaultVoice

    return { languageCode: ttsConfig.languageCode, name: voiceName }
  }

  /**
   * Synthesize text to audio using Google Cloud TTS API
   * @param text Text to synthesize
   * @param language Language code (e.g., 'de-DE', 'en-US')
   * @returns Audio buffer in MP3 format with metadata
   */
  async synthesize(text: string, language: string): Promise<TTSSynthesizeResult> {
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

      // Determine voice type from voice name
      const voiceType = this.getVoiceType(voice.name)

      return {
        audio: audioBuffer,
        characterCount: text.length,
        voiceType,
      }
    } catch (error) {
      throw error
    }
  }

  /**
   * Determine voice type from voice name
   */
  private getVoiceType(voiceName: string): 'standard' | 'wavenet' | 'neural2' {
    if (voiceName.includes('Wavenet')) {
      return 'wavenet'
    }
    if (voiceName.includes('Neural2')) {
      return 'neural2'
    }
    return 'standard'
  }
}

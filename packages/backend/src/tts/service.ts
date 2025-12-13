import 'reflect-metadata'
import { injectable } from 'tsyringe'
import { internalError } from '../common/errors'
import { Language, DEFAULT_LANGUAGE } from '/content/schema'

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

  // Voice configuration per language
  // When adding a new language to SUPPORTED_LANGUAGES:
  // 1. Add TTS_VOICE_XX environment variable
  // 2. Add voiceXX property to constructor
  // 3. Add case to selectVoice()
  private readonly voiceConfig: Record<
    Language,
    { languageCode: string; envVar: string; default: string }
  > = {
    de: { languageCode: 'de-DE', envVar: 'TTS_VOICE_DE', default: 'de-DE-Standard-A' },
    en: { languageCode: 'en-US', envVar: 'TTS_VOICE_EN', default: 'en-US-Standard-C' },
  }

  /**
   * Select appropriate voice based on language
   */
  private selectVoice(language: string): { languageCode: string; name: string } {
    // Extract language code (e.g., 'de' from 'de-DE')
    const langCode = language.split('-')[0].toLowerCase() as Language

    const config = this.voiceConfig[langCode] || this.voiceConfig[DEFAULT_LANGUAGE]
    const voiceName = langCode === 'de' ? this.voiceDE : this.voiceEN

    return { languageCode: config.languageCode, name: voiceName }
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

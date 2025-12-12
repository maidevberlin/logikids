declare module 'latex-to-speech' {
  interface LatexToSpeechOptions {
    /** Subject area rules (e.g., 'mathspeak', 'clearspeak') */
    domain?: 'mathspeak' | 'clearspeak'
    /** Preference settings like 'brief' */
    style?: string
    /** Language code in ISO 639-1 format (e.g., 'en', 'de', 'fr') */
    locale?: string
    /** Output format */
    markup?: 'none' | 'ssml' | 'sable' | 'voicexml' | 'acss' | 'ssml_step'
    /** Return type */
    modality?: 'speech' | 'braille' | 'prefix' | 'summary'
  }

  /**
   * Convert LaTeX expressions to speech text.
   * @param expressions - Array of LaTeX expressions to convert
   * @param options - Conversion options
   * @returns Array of speech strings corresponding to input expressions
   */
  function latexToSpeech(expressions: string[], options?: LatexToSpeechOptions): Promise<string[]>

  export default latexToSpeech
}

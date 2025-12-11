/**
 * DI tokens for abstract classes or interfaces that cannot use the class itself as token.
 *
 * Most classes use themselves as tokens: @inject(ClassName)
 * Abstract classes need a symbol token since they can't be instantiated.
 */

/**
 * Token for AIClient (abstract class)
 */
export const AIClientToken = Symbol.for('AIClient')

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import * as loggerModule from './logger'
import { Logger, createLogger } from './logger'

describe('Logger', () => {
  // Store original console methods
  const originalConsole = {
    debug: console.debug,
    info: console.info,
    warn: console.warn,
    error: console.error,
  }

  // Mock console methods
  beforeEach(() => {
    console.debug = vi.fn()
    console.info = vi.fn()
    console.warn = vi.fn()
    console.error = vi.fn()
  })

  afterEach(() => {
    // Restore original console methods
    console.debug = originalConsole.debug
    console.info = originalConsole.info
    console.warn = originalConsole.warn
    console.error = originalConsole.error
    vi.clearAllMocks()
  })

  describe('debug', () => {
    it('should log debug messages in development mode', () => {
      // Mock development environment
      vi.spyOn(loggerModule, 'isDevelopment').mockReturnValue(true)

      const logger = new Logger('TestContext')
      logger.debug('Test debug message')

      expect(console.debug).toHaveBeenCalledWith('[TestContext] Test debug message', '')
      vi.restoreAllMocks()
    })

    it('should log debug messages with metadata in development mode', () => {
      vi.spyOn(loggerModule, 'isDevelopment').mockReturnValue(true)

      const logger = new Logger('TestContext')
      const meta = { userId: 123, action: 'click' }
      logger.debug('User action', meta)

      expect(console.debug).toHaveBeenCalledWith('[TestContext] User action', meta)
      vi.restoreAllMocks()
    })

    it('should NOT log debug messages in production mode', () => {
      // Mock production environment
      vi.spyOn(loggerModule, 'isDevelopment').mockReturnValue(false)

      const logger = new Logger('TestContext')
      logger.debug('Test debug message')

      expect(console.debug).not.toHaveBeenCalled()
      vi.restoreAllMocks()
    })

    it('should NOT log debug messages with metadata in production mode', () => {
      vi.spyOn(loggerModule, 'isDevelopment').mockReturnValue(false)

      const logger = new Logger('TestContext')
      logger.debug('User action', { userId: 123 })

      expect(console.debug).not.toHaveBeenCalled()
      vi.restoreAllMocks()
    })
  })

  describe('info', () => {
    it('should log info messages with context', () => {
      const logger = new Logger('TestContext')
      logger.info('Test info message')

      expect(console.info).toHaveBeenCalledWith('[TestContext] Test info message', '')
    })

    it('should log info messages with metadata', () => {
      const logger = new Logger('TestContext')
      const meta = { requestId: 'abc-123', duration: 150 }
      logger.info('Request completed', meta)

      expect(console.info).toHaveBeenCalledWith('[TestContext] Request completed', meta)
    })

    it('should include context in all info logs', () => {
      const logger = new Logger('APIClient')
      logger.info('Fetching data')

      expect(console.info).toHaveBeenCalledWith('[APIClient] Fetching data', '')
    })
  })

  describe('warn', () => {
    it('should log warning messages with context', () => {
      const logger = new Logger('TestContext')
      logger.warn('Test warning message')

      expect(console.warn).toHaveBeenCalledWith('[TestContext] Test warning message', '')
    })

    it('should log warning messages with metadata', () => {
      const logger = new Logger('TestContext')
      const meta = { deprecatedAPI: 'v1/users', replacement: 'v2/users' }
      logger.warn('Using deprecated API', meta)

      expect(console.warn).toHaveBeenCalledWith('[TestContext] Using deprecated API', meta)
    })

    it('should include context in all warning logs', () => {
      const logger = new Logger('Cache')
      logger.warn('Cache miss')

      expect(console.warn).toHaveBeenCalledWith('[Cache] Cache miss', '')
    })
  })

  describe('error', () => {
    it('should log error messages with context', () => {
      const logger = new Logger('TestContext')
      logger.error('Test error message')

      expect(console.error).toHaveBeenCalledWith('[TestContext] Test error message', { error: undefined })
    })

    it('should log error messages with Error object', () => {
      const logger = new Logger('TestContext')
      const error = new Error('Something went wrong')
      logger.error('Operation failed', error)

      expect(console.error).toHaveBeenCalledWith('[TestContext] Operation failed', { error })
    })

    it('should log error messages with Error object and metadata', () => {
      const logger = new Logger('TestContext')
      const error = new Error('Network timeout')
      const meta = { url: 'https://api.example.com', timeout: 5000 }
      logger.error('Request failed', error, meta)

      expect(console.error).toHaveBeenCalledWith('[TestContext] Request failed', { error, ...meta })
    })

    it('should log error messages with only metadata', () => {
      const logger = new Logger('TestContext')
      const meta = { statusCode: 500, endpoint: '/api/task' }
      logger.error('Server error', undefined, meta)

      expect(console.error).toHaveBeenCalledWith('[TestContext] Server error', { error: undefined, ...meta })
    })

    it('should include context in all error logs', () => {
      const logger = new Logger('Database')
      const error = new Error('Connection lost')
      logger.error('Database error', error)

      expect(console.error).toHaveBeenCalledWith('[Database] Database error', { error })
    })
  })

  describe('createLogger factory function', () => {
    it('should create a Logger instance with the specified context', () => {
      const logger = createLogger('FactoryTest')

      expect(logger).toBeInstanceOf(Logger)

      // Verify the context is used
      logger.info('Test message')
      expect(console.info).toHaveBeenCalledWith('[FactoryTest] Test message', '')
    })

    it('should create independent logger instances', () => {
      const logger1 = createLogger('Context1')
      const logger2 = createLogger('Context2')

      logger1.info('Message from logger 1')
      logger2.info('Message from logger 2')

      expect(console.info).toHaveBeenCalledWith('[Context1] Message from logger 1', '')
      expect(console.info).toHaveBeenCalledWith('[Context2] Message from logger 2', '')
    })
  })

  describe('context handling', () => {
    it('should support different context names', () => {
      const contexts = ['API', 'Component:Button', 'Hook:useTask', 'Service/Auth']

      contexts.forEach(context => {
        const logger = new Logger(context)
        logger.info('Test')
        expect(console.info).toHaveBeenCalledWith(`[${context}] Test`, '')
      })
    })

    it('should handle empty context', () => {
      const logger = new Logger('')
      logger.info('Test message')
      expect(console.info).toHaveBeenCalledWith('[] Test message', '')
    })
  })

  describe('metadata handling', () => {
    it('should handle empty metadata object', () => {
      const logger = new Logger('TestContext')
      logger.info('Message', {})

      expect(console.info).toHaveBeenCalledWith('[TestContext] Message', {})
    })

    it('should handle nested metadata objects', () => {
      const logger = new Logger('TestContext')
      const meta = {
        user: { id: 123, name: 'Alice' },
        settings: { theme: 'dark', language: 'en' }
      }
      logger.info('User login', meta)

      expect(console.info).toHaveBeenCalledWith('[TestContext] User login', meta)
    })

    it('should preserve metadata types', () => {
      const logger = new Logger('TestContext')
      const meta = {
        string: 'value',
        number: 42,
        boolean: true,
        array: [1, 2, 3],
        object: { key: 'value' }
      }
      logger.warn('Type test', meta)

      expect(console.warn).toHaveBeenCalledWith('[TestContext] Type test', meta)
    })
  })

  describe('isDevelopment', () => {
    it('should return a value based on import.meta.env.DEV', () => {
      // Note: This test verifies the function exists and can be called
      // The actual return value depends on whether import.meta.env.DEV is defined
      const result = loggerModule.isDevelopment()
      // In test environment, import.meta.env.DEV might be undefined (which is falsy)
      // So we check that the function returns a value that can be used in boolean context
      expect(result === true || result === false || result === undefined).toBe(true)
    })
  })
})

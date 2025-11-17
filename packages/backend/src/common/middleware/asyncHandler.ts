import { Request, Response, NextFunction } from 'express';

/**
 * Async handler wrapper for Express route handlers
 *
 * Express doesn't automatically catch errors from async functions,
 * so we need to wrap them and pass errors to next() for error middleware.
 *
 * @example
 * ```typescript
 * router.get('/user', asyncHandler(async (req, res) => {
 *   const user = await userService.getUser(req.params.id);
 *   res.json(user);
 * }));
 * ```
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

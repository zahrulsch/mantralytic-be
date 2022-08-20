import type { Request, Response, NextFunction } from 'express'

export class ApiStatController {
  static async getStatOfProduct(req: Request, res: Response, next: NextFunction) {
    try {

    } catch (e) {
      next(e)
    }
  }
}
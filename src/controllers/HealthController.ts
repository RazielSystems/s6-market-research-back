import { NextFunction, Request, Response } from 'express';

class HealthController {
  static health = async (req: Request, res: Response, next: NextFunction) => {
    console.log('req: ', req.body);
    res.json({
      health: 'OK',
      body: req.body
    });
  };
}

export default HealthController;

import { NextFunction, Request, Response } from 'express';
import ItemsModels from '../models/ItemsModel';

class ItemsController {
  static query = async (req: Request, res: Response, next: NextFunction) => {
    console.log('req: ', req.body);
    const resp = await ItemsModels.search(req.body);
    res.json({
      body: req.body,
      resp
    });
  };
}

export default ItemsController;

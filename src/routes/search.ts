import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import ItemsController from '../controllers/ItemsController';

const SearchRouter = Router();

SearchRouter.post('/', asyncHandler(ItemsController.query));

export default SearchRouter;

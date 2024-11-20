import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import HealthController from '../controllers/HealthController';

const HealthRouter = Router();

HealthRouter.get('/', asyncHandler(HealthController.health));

export default HealthRouter;

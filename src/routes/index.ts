import { Router } from 'express';
import HealthRouter from './health';

const routes = Router();
routes.use('/health', HealthRouter);

export default routes;

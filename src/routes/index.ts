import { Router } from 'express';
import HealthRouter from './health';
import SearchRouter from './search';

const routes = Router();

routes.use('/health', HealthRouter);
routes.use('/search', SearchRouter);

export default routes;

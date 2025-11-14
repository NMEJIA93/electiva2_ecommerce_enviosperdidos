import express, {Router} from 'express';
import { getCatalog } from '../controllers/catalog-controller';
import { authenticateToken, authorizeRole } from '../middlewares/auth-middleware';

const catalogRouter = express.Router();

catalogRouter.get('/catalog',authenticateToken,authorizeRole(["admin","user"]),getCatalog)

export default catalogRouter;
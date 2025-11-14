import express, { Router } from 'express';
import { updateInventory, updateReserved, getInventoryById} from '../controllers/inventory-controller';
import { authenticateToken, authorizeRole } from '../middlewares/auth-middleware';
import { validateInventory } from '../middlewares/inventory-middleware';

const inventoryRouter: Router = express.Router();

inventoryRouter.put('/admin/product/inventory/:id', authenticateToken, authorizeRole(["admin"]), validateInventory, updateInventory);
inventoryRouter.patch('/user/cart/product/inventory/hold/:id', authenticateToken, authorizeRole(["admin","user"]), validateInventory, updateReserved);
inventoryRouter.get('/user/product/inventory/:id', authenticateToken, authorizeRole(["admin","user"]), getInventoryById)

export default inventoryRouter;

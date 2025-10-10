import express, { Router } from 'express';
import { updateInventory, updateReservedStock } from '../controllers/inventory-controller';
import { authenticateToken, authorizeRole } from '../middlewares/auth-middleware';
import { validateInventory } from '../middlewares/inventory-middleware';

const inventoryRouter: Router = express.Router();

inventoryRouter.put('/product/inventory/:id', authenticateToken, authorizeRole(["admin"]), validateInventory, updateInventory);
inventoryRouter.patch('/product/inventory/reserved/:id', authenticateToken, authorizeRole(["admin"]), validateInventory, updateReservedStock);

export default inventoryRouter;

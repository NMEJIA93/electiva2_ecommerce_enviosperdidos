import express, { Router, Request, Response } from "express";
import { createCategory, getCategoryById, getCategories, updateCategory, deleteCategoryById } from "../controllers/categories-controller";
import { authenticateToken, authorizeRole } from "../middlewares/auth-middleware";

const categoryRouter: Router = express.Router();

categoryRouter.post('/product/categories', authenticateToken, authorizeRole(["admin"]), createCategory);
categoryRouter.get('/product/categories', authenticateToken, authorizeRole(["admin"]), getCategories);
categoryRouter.get('/product/categories/:id', authenticateToken, authorizeRole(["admin"]), getCategoryById);
categoryRouter.put('/product/categories/:id', authenticateToken, authorizeRole(["admin"]), updateCategory );
categoryRouter.delete('/product/categories/:id', authenticateToken, authorizeRole(["admin"]), deleteCategoryById);


export default categoryRouter;
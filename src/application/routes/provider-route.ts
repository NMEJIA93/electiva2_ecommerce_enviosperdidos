import express, { Router, Request, Response } from "express";
import { createProvider,deleteProvider,getProviderById,getProviders, updateProvider } from "../controllers/provider-controller";
import { authenticateToken, authorizeRole } from "../middlewares/auth-middleware";

const providerRouter: Router = express.Router();

providerRouter.post('/admin/product/provider', authenticateToken, authorizeRole(["admin"]), createProvider);
providerRouter.get('/admin/product//provider', authenticateToken, authorizeRole(["admin",]), getProviders);
providerRouter.get('/admin/product/provider/:id', authenticateToken, authorizeRole(["admin"]), getProviderById)
providerRouter.put('/admin/product/provider/:id', authenticateToken, authorizeRole(["admin"]), updateProvider);
providerRouter.delete('/admin/product/provider/:id', authenticateToken, authorizeRole(["admin"]), deleteProvider);


export default providerRouter;
import express, { Router, Request, Response } from 'express';
import { createProduct, getProducts, getProductById, updateProduct, deleteProduct} from '../controllers/products-controllers';
import { validateProduct } from '../middlewares/product-middleware';
import { authenticateToken, authorizeRole } from '../middlewares/auth-middleware';


const productRouter: Router = express.Router();

productRouter.post('/admin/product',authenticateToken,authorizeRole(["admin"]), validateProduct, createProduct);
productRouter.get('/admin/product', authenticateToken, authorizeRole(["admin"]),getProducts )
productRouter.get('/admin/product/:id', authenticateToken, authorizeRole(["admin"]), getProductById );
productRouter.put('/admin/product/:id', authenticateToken, authorizeRole(["admin"]), validateProduct, updateProduct );
productRouter.delete('/product/:id', authenticateToken, authorizeRole(["admin"]), deleteProduct );

export default productRouter;
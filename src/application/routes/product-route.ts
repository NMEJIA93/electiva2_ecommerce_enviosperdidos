import express, { Router, Request, Response } from 'express';
import { createProduct, getProducts, getProductById, updateProduct, deleteProduct} from '../controllers/products-controllers';
import { validateProduct } from '../middlewares/product-middleware';
import { authenticateToken, authorizeRole } from '../middlewares/auth-middleware';


const productRouter: Router = express.Router();

productRouter.post('/product',authenticateToken,authorizeRole(["admin"]), validateProduct, createProduct);
productRouter.get('/product', authenticateToken, authorizeRole(["admin","user"]),getProducts )
productRouter.get('/product/:id', authenticateToken, authorizeRole(["admin","user"]), getProductById );
productRouter.put('/product/:id', authenticateToken, authorizeRole(["admin"]), validateProduct, updateProduct );
productRouter.delete('/product/:id', authenticateToken, authorizeRole(["admin"]), deleteProduct );

export default productRouter;
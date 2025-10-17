import express, { Router, Request, Response } from 'express';
import { createProduct } from '../controllers/products-controllers';
import { validateProduct } from '../middlewares/product-middleware';

const productRouter: Router = express.Router();

productRouter.post('/product', validateProduct, createProduct);

export default productRouter;
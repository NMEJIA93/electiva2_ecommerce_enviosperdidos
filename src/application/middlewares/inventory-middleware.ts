import { Request, Response } from "express";

export function validateInventory(request: Request, response: Response, next: Function) {
    const { price, stock, reservedStock } = request.body;

    //price
    if (price !== undefined) {
        if (typeof price !== "number" || price <= 0) {
            return response.status(422).json({
                ok: false,
                error: "The price must be a number greater than 0",
            });
        }
    }
    // stock
    if (stock !== undefined) {
        if (!Number.isInteger(stock) || stock < 0) {
            return response.status(422).json({
                ok: false,
                error: "The stock must be an integer greater or equal to 0",
            });
        }
    }
    next();
}
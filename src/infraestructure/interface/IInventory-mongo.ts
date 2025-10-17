import mongoose from "mongoose";

export interface IReservation {
  userId: mongoose.Types.ObjectId;
  quantity: number;
  createdAt: Date;
}

export interface IInventoryDocument extends mongoose.Document {
  productId: mongoose.Types.ObjectId;
  price: number;
  stock: number;
  reservedStock: number;
  reservations: IReservation[];
  createdAt: Date;
  updatedAt: Date;
}

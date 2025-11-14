export interface IInventory {
  id?: string;
  productId?: string;
  name?: string;
  description?: string;
  cost?: number;
  price?: number;
  stock?: number;
  reservedStock?: number;
  reservations?:[]
  category?: {
    id?: string;
    name?: string;
  };
  provider?: {
    id?: string;
    name?: string;
  };
  images?: string[];
  isDiscontinued?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  action?: number;
}

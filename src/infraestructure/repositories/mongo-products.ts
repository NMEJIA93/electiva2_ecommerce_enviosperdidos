import { IProductRepository } from "../../domain/repositories/IProduct-repository";
import { Product } from "../../domain/entities/Product";
import { ProductModel } from "../database/Product-mongo";
import { IProduct } from "../../domain/models/interfaces/IProduct";
import { CategoriesModel } from "../database/categories-mongo";
import { ProviderModel } from "../database/provider-mongo";
import { InventoryModel } from "../database/inventory-mongo";

export class MongoProductRepository implements IProductRepository {
  async save(product: Product): Promise<Product> {
    const categoryExisting = await CategoriesModel.exists({
      _id: product.categoryId,
    });
    if (!categoryExisting) {
      throw new Error(`Category with ID ${product.categoryId} does not exist`);
    }
    if (product.providers && product.providers.length > 0) {
      const existingProviders = await ProviderModel.find({
        _id: { $in: product.providers },
      }).select("_id");
      const existingProviderIds = existingProviders.map((p) =>
        p._id.toString()
      );
      const missingProviders = product.providers.filter(
        (id) => !existingProviderIds.includes(id)
      );
      if (missingProviders.length > 0) {
        throw new Error(
          `Some providers do not exist: ${missingProviders.join(", ")}`
        );
      }
    }
    const created = await ProductModel.create(product);
    const plainProduct = created.toObject();

    await InventoryModel.create({
      productId: plainProduct._id,
      price: 0,
      stock: 0,
      reservedStock: 0,
    });

    const mappedProduct = {
      ...plainProduct,
      id: plainProduct._id.toString(),
    };

    return new Product(mappedProduct as unknown as IProduct);
  }
  async findAll(): Promise<Product[]> {
    const products = await ProductModel.find().exec();
    return products.map((p) => {
      const plainProduct = p.toObject();
      const mapped = {
        ...plainProduct,
        id: plainProduct._id.toString(),
      };
      return new Product(mapped as unknown as IProduct);
    });
  }
  async findById(id: string): Promise<Product> {
    const product = await ProductModel.findById(id).exec();
    if (!product) {
      throw new Error("Product not found");
    }
    const plainProduct = product.toObject();
    const mapped = {
      ...plainProduct,
      id: plainProduct._id.toString(),
    };
    return new Product(mapped as unknown as IProduct);
  }
  async update(id: string, data: Partial<Product>): Promise<Product> {
    const existingProduct = await ProductModel.findById(id);
    if (!existingProduct) throw new Error("Product not found");

    if (data.categoryId) {
      const categoryExists = await CategoriesModel.exists({
        _id: data.categoryId,
      });
      if (!categoryExists)
        throw new Error(`Category with ID ${data.categoryId} does not exist`);
    }

    if (data.providers?.length) {
      const existingProviders = await ProviderModel.find({
        _id: { $in: data.providers },
      }).select("_id");
      const existingProviderIds = existingProviders.map((p) =>
        p._id.toString()
      );
      const missingProviders = data.providers.filter(
        (id) => !existingProviderIds.includes(id)
      );
      if (missingProviders.length > 0)
        throw new Error(
          `Some providers do not exist: ${missingProviders.join(", ")}`
        );
    }

    Object.assign(existingProduct, data);
    const updated = await existingProduct.save();

    const plain = updated.toObject();
    return new Product({
      ...plain,
      id: plain._id.toString(),
    } as unknown as IProduct);
  }
  async delete(id: string): Promise<void> {
    const result = await ProductModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new Error("Product not found or already deleted");
    }
    await InventoryModel.deleteOne({ productId: id }).exec();
  }
}

import { productRepository } from '../repositories/product-repository';

type Product = {
  id?: string;
  title: string;
  count: number;
  description: string;
  price: number;
  imageName?: string;
};

const addProduct = (p: Product) => {
  return productRepository.addProduct(p)
};

const getAllProducts = () => {
  return productRepository.getAllProducts();
};

const getProductById = (id: string) => {
  return productRepository.getProductById(id);
};

const getProductStocks = async (productId: string) => {
  return productRepository.getProductStocks(productId);
};

export const productService = {
  addProduct,
  getAllProducts,
  getProductById,
  getProductStocks,
};

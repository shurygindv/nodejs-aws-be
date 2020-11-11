import { stockRepository } from '../repositories/stock-repository';

const getAllStocks = () => {
  return stockRepository.getAllStocks();
};

const getStockById = (id: string) => {
  return stockRepository.getStockById(id);
};

export const stockService = {
    getAllStocks,
    getStockById,
};

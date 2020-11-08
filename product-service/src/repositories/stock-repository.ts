import { createDatabaseConnection } from "../libs/pg";


const SELECT_ALL = 'SELECT "id" "productId", "count" from stocks';

const getAllStocks = async () => {
  const connection = await createDatabaseConnection();

  try {
    const result = await connection.query(SELECT_ALL);

    return result.rows;
  } catch (e) {
    throw new Error(
      `StockRepo (getAllProducts): can't handle ${e.message}`
    );
  } finally {
    connection.close();
  }
};

const getStockById = async (id: string) => {
    const connection = await createDatabaseConnection();
  
    try {
      const result = await connection.query(
        `${SELECT_ALL} WHERE id=$1`,
        [id]
      );

      return result.rows;
    } catch (e) {
      throw new Error(
        `StockRepo (getAllProducts): can't handle ${e.message}`
      );
    } finally {
      connection.close();
    }
  };
  

export const stockRepository = {
  getAllStocks,
  getStockById,
};

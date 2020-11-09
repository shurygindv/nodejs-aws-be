import { createDatabaseConnection } from "../libs/pg";

// TODO: sql wrapper

type Product = {
  id?: string;
  title: string;
  description: string;
  price: number;
  count: number;
  imageName?: string;
};

const SELECT_ALL = `SELECT "id", "title", "description", "price", "imageName" from products`;

const addProduct = async (p: Product) => {
  const client = await createDatabaseConnection();

  const productQuery =
    'INSERT INTO products ("title", "description", "price") VALUES ($1, $2, $3) RETURNING id';

  const stockQuery =
    'INSERT INTO stocks ("productId", "count") VALUES ($1, $2) RETURNING id';

  try {
    await client.query("BEGIN");

    const productResult = await client.query(productQuery, [
      p.title,
      p.description,
      p.price,
    ]);

    const productId = productResult.rows[0].id;

    const stockResult = await client.query(stockQuery, [productId, p.count]);

    const stockId = stockResult.rows[0].id;

    await client.query("COMMIT");

    return {
      productId: productId,
      stockId: stockId,
    };
  } catch (e) {
    await client.query("ROLLBACK");

    throw new Error(`ProductService(addProduct): can't handle ${e.message}`);
  } finally {
    client.close();
  }
};

const getAllProducts = async () => {
  const connection = await createDatabaseConnection();

  try {
    const result = await connection.query(SELECT_ALL);

    return result.rows;
  } catch (e) {
    throw new Error(`ProductRepo (getAllProducts): can't handle ${e.message}`);
  } finally {
    connection.close();
  }
};

const getProductById = async (id: string) => {
  const connection = await createDatabaseConnection();

  try {
    const result = await connection.query(
      `${SELECT_ALL} WHERE id=$1`,
      [id]
    );

    return result.rows;
  } catch (e) {
    throw new Error(`ProductRepo (getAllProducts): can't handle ${e.message}`);
  } finally {
    connection.close();
  }
};

const getProductStocks = async (productId: string) => {
  const connection = await createDatabaseConnection();

  try {
    const result = await connection.query(
      `SELECT * FROM products p LEFT JOIN
           stocks s 
           ON s."productId"=$1
        WHERE p.id=$1`,
      [productId]
    );

    return result.rows;
  } catch (e) {
    throw new Error(`ProductRepo (getAllProducts): can't handle ${e.message}`);
  } finally {
    connection.close();
  }
};

export const productRepository = {
  addProduct,
  getAllProducts,
  getProductById,
  getProductStocks,
};

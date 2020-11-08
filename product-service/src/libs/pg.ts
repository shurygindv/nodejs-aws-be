import pg  from "pg";
import type { ClientConfig } from "pg";

const { PG_HOST, PG_PORT, PG_DATABASE, PG_PASSWORD, PG_USERNAME } = process.env;

const options: ClientConfig = {
    host: PG_HOST,
    port: Number(PG_PORT),
    database: PG_DATABASE,
    user: PG_USERNAME,
    password: PG_PASSWORD,
    ssl: {
      rejectUnauthorized: false,
    },
  };
  

export const createDatabaseConnection = async () => {
    const pool = new pg.Pool(options);

    const client = await pool.connect();

    return {
        query: (query: string, v?: any[]) => client.query(query, v),
      //  act: (query: string) => client.query(query),
        close: () => client.release(),
    };
}
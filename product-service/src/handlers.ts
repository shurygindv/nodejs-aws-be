import { getAllProducts } from "./lambda/get-all-products";
import { getProductById } from "./lambda/get-product-by-id";
import { serveStaticAsset } from "./lambda/serve-static-asset";
import { createProduct } from "./lambda/create-product/create-product";

import "source-map-support/register";

export { createProduct, getProductById, getAllProducts, serveStaticAsset };

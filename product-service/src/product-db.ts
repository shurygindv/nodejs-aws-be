const products = [
  {
    count: 4,
    description: "Short Product Description1",
    id: "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
    price: 2.4,
    title: "ProductOne",
  },
  {
    count: 6,
    description: "Short Product Description3",
    id: "7567ec4b-b10c-48c5-9345-fc73c48a80a0",
    price: 10,
    title: "ProductNew",
  },
  {
    count: 7,
    description: "Short Product Description2",
    id: "7567ec4b-b10c-48c5-9345-fc73c48a80a2",
    price: 23,
    title: "ProductTop",
  },
  {
    count: 12,
    description: "Short Product Description7",
    id: "7567ec4b-b10c-48c5-9345-fc73c48a80a1",
    price: 15,
    title: "ProductTitle",
  },
];

const selectAllProducts = () => {
  return Promise.resolve(products);
};

const selectProductById = (id: string) => {
  return Promise.resolve(products.find((i) => i.id === id));
};

export const productDb = {
    selectAllProducts,
    selectProductById
};

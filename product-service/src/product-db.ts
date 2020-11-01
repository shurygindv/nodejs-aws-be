const products = [
  {
    count: 4,
    description: "Short Product Description1",
    id: "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
    price: 2.4,
    title: "Product ##1",
  },
  {
    count: 6,
    description: "Short Product Description3",
    id: "7567ec4b-b10c-48c5-9345-fc73c48a80a0",
    price: 10,
    title: "Product ##2",
  },
  {
    count: 7,
    description: "Short Product Description2",
    id: "7567ec4b-b10c-48c5-9345-fc73c48a80a2",
    price: 23,
    title: "Product ##3",
  },
  {
    count: 12,
    description: "Short Product Description7",
    id: "7567ec4b-b10c-48c5-9345-fc73c48a80a1",
    price: 15,
    title: "Product ##4",
  },
];

const selectAllProducts = () => {
  return Promise.resolve(products);
};

const selectProductById = (id: string) => {
  return Promise.resolve(products.find((i) => i.id === id) || null);
};

export const productDb = {
    selectAllProducts,
    selectProductById
};

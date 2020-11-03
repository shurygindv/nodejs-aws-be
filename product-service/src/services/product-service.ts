const products = [
  {
    count: 4,
    description: "Short Product Description1",
    id: "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
    price: 2.4,
    title: "Product ##1",
    imageName: 'mmm1.jpg',
  },
  {
    count: 6,
    description: "Short Product Description3",
    id: "7567ec4b-b10c-48c5-9345-fc73c48a80a0",
    price: 10,
    title: "Product ##2",
    imageName: 'mmm2.jpg',
  },
  {
    count: 7,
    description: "Short Product Description2",
    id: "7567ec4b-b10c-48c5-9345-fc73c48a80a2",
    price: 23,
    title: "Product ##3",
    imageName: 'moscow1.jpg',
  },
  {
    count: 12,
    description: "Short Product Description7",
    id: "7567ec4b-b10c-48c5-9345-fc73c48a80a1",
    price: 15,
    title: "Product ##4",
    imageName: 'thumb.jpg',
  },
];

const getAllProducts = async () => [...products];

const getProductById = async (id: string) => {
  return products.find((i) => i.id === id) || null;
};

export const productService = {
    getAllProducts,
    getProductById
};

import api from "./axios";

export const getProductsRequest = async ({
  query = "",
  categoria_id = "",
  page = 1,
  page_size = 10,
} = {}) => {
  const params = { page, page_size };

  if (query) params.query = query;
  if (categoria_id) params.categoria_id = categoria_id;

  const response = await api.get("/products", { params });
  return response.data;
};

export const getAllProductsForSelectRequest = async () => {
  let page = 1;
  const pageSize = 50;
  let totalPages = 1;
  let allProducts = [];

  do {
    const data = await getProductsRequest({
      page,
      page_size: pageSize,
    });

    allProducts = [...allProducts, ...(data.items || [])];
    totalPages = Math.ceil((data.total || 0) / pageSize);
    page += 1;
  } while (page <= totalPages);

  return allProducts;
};

export const getCategoriesRequest = async () => {
  const response = await api.get("/categories");
  return response.data;
};

export const createProductRequest = async (payload) => {
  const response = await api.post("/products", payload);
  return response.data;
};

export const getProductByIdRequest = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};
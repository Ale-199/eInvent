import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_URL = `${BACKEND_URL}/api/products/`;

const createProduct = async (formData) => {
  const res = await axios.post(API_URL, formData);
  return res.data;
};

const getProducts = async (formData) => {
  const res = await axios.get(API_URL);
  return res.data;
};

const deleteProduct = async (id) => {
  const res = await axios.delete(API_URL + id);
  return res.data;
};

const getProduct = async (id) => {
  const res = await axios.get(API_URL + id);
  return res.data;
};

const updateProduct = async (id, formData) => {
  const res = await axios.patch(`${API_URL}${id}`, formData);
  return res.data;
};

const productService = {
  createProduct,
  getProduct,
  deleteProduct,
  updateProduct,
  getProducts,
};

export default productService;

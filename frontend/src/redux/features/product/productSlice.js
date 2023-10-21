//-createAsyncThunk is going to help us make HTTP request from Redux.
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import productService from "../../../services/productService";

const initialState = {
  product: null,
  products: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  //-If there is an error message, this is where we are going to store it.
  message: "",
  totalStoreValue: 0,
  outOfStock: 0,
  category: [],
};

export const createProduct = createAsyncThunk(
  "product/create",
  async (formData, thunkAPI) => {
    try {
      return await productService.createProduct(formData);
    } catch (error) {
      const message =
        (error.res && error.res.data && error.res.data.message) ||
        error.message ||
        error.toString();
      console.log(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getProducts = createAsyncThunk(
  "product/getAll",
  async (_, thunkAPI) => {
    try {
      return await productService.getProducts();
    } catch (error) {
      const message =
        (error.res && error.res.data && error.res.data.message) ||
        error.message ||
        error.toString();
      console.log(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id, thunkAPI) => {
    try {
      return await productService.deleteProduct(id);
    } catch (error) {
      const message =
        (error.res && error.res.data && error.res.data.message) ||
        error.message ||
        error.toString();
      console.log(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getProduct = createAsyncThunk(
  "products/getProduct",
  async (id, thunkAPI) => {
    try {
      return await productService.getProduct(id);
    } catch (error) {
      const message =
        (error.res && error.res.data && error.res.data.message) ||
        error.message ||
        error.toString();
      console.log(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, formData }, thunkAPI) => {
    try {
      return await productService.updateProduct(id, formData);
    } catch (error) {
      const message =
        (error.res && error.res.data && error.res.data.message) ||
        error.message ||
        error.toString();
      console.log(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    CALC_STORE_VALUE(state, action) {
      const products = action.payload;
      const array = [];
      products.map((product) => {
        const { price, quantity } = product;
        const productValue = price * quantity;
        return array.push(productValue);
      });
      //-The reduce() method executes a reducer function on
      //each element of the array and returns a single output value.

      //-0 is the initialValue
      //-initialValue (optional) - A value that will be passed to callback() on first call.
      //If not provided, the first element acts as the accumulator on the first call and callback()
      //won't execute on it

      //-reduce() executes the given function for each value from left to right.
      //-reduce() does not change the original array.
      //-It is almost always safer to provide initialValue.
      const totalValue = array.reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      }, 0);
      state.totalStoreValue = totalValue;
    },

    CALC_OUTOFSTOCK(state, action) {
      const products = action.payload;
      const array = [];
      products.map((product) => {
        const { quantity } = product;
        return array.push(quantity);
      });
      let count = 0;
      array.forEach((number) => {
        if (number === 0 || number === "0") {
          count += 1;
        }
      });
      state.outOfStock = count;
    },

    CALC_CATEGORY(state, action) {
      const products = action.payload;
      const array = [];
      products.map((item) => {
        const { category } = item;
        return array.push(category);
      });
      //-A Set is a collection of unique values. To remove duplicates from an array:
      //>First, convert an array of duplicates to a Set. The new Set will implicitly remove duplicate elements.
      //>Then, convert the set back to an array.
      const uniqueCategory = [...new Set(array)];
      state.category = uniqueCategory;
    },
  },

  //-This is where we are going to store the response, the various
  //categories of response that will come from create async thunk, which
  //is what will help us make HTTP requests.
  extraReducers: (builder) => {
    builder
      //Create product
      .addCase(createProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        console.log(action.payload);
        state.products.push(action.payload);
        toast.success("Product added successfully");
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      //Get products
      .addCase(getProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        console.log(action.payload);
        state.products = action.payload;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      //Delete a product
      .addCase(deleteProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        toast.success("Product deleted successfully");
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      //Get a product
      .addCase(getProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.product = action.payload;
      })
      .addCase(getProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      //Update a product
      .addCase(updateProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        toast.success("Product updated successfully");
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { CALC_STORE_VALUE, CALC_OUTOFSTOCK, CALC_CATEGOY } =
  productSlice.actions;

export const selectIsLoading = (state) => state.product.isLoading;
export const selectProduct = (state) => state.product.product;
export const selectTotalStoreValue = (state) => state.product.totalStoreValue;
export const selectOutOfStock = (state) => state.product.outOfStock;
export const selectCategory = (state) => state.product.category;

export default productSlice.reducer;

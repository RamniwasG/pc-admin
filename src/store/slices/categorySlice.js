import { axiosInstance } from "@/api/axios-instance";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ============= ASYNC ACTIONS =============
export const fetchCategories = createAsyncThunk(
  "category/fetch",
  async () => {
    const res = await axiosInstance.get("/categories/fetchAllCategories");
    return res.data.categories;
  }
);

export const addCategory = createAsyncThunk(
  "category/add",
  async (payload) => {
    const res = await axios.post("/api/category", payload);
    return res.data;
  }
);

export const updateCategory = createAsyncThunk(
  "category/update",
  async ({ id, data }) => {
    const res = await axios.put(`/api/category/${id}`, data);
    return res.data;
  }
);

export const deleteCategory = createAsyncThunk(
  "category/delete",
  async (id) => {
    await axios.delete(`/api/category/${id}`);
    return id;
  }
);

// ============= SLICE =============
const categorySlice = createSlice({
  name: "category",
  initialState: {
    categories: [],
    loading: false,
    error: null,
  },

  extraReducers: (builder) => {
    builder
      // GET ALL
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ADD
      .addCase(addCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })

      // UPDATE
      .addCase(updateCategory.fulfilled, (state, action) => {
        const idx = state.categories.findIndex(
          (c) => c._id === action.payload._id
        );
        state.categories[idx] = action.payload;
      })

      // DELETE
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(
          (c) => c._id !== action.payload
        );
      });
  },
});

export default categorySlice.reducer;

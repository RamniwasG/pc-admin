import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from "./slices/categorySlice";
// import subcategoryReducer from "./slices/subcategorySlice";

export const store = configureStore({
  reducer: {
    category: categoryReducer,
    // subcategory: subcategoryReducer,
  },
});
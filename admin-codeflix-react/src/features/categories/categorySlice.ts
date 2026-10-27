import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

export interface Category {
  category_id: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: Date;
}

const initialState: Category[] = [
  {
    category_id: "1",
    name: "Ação",
    description: "Ação",
    is_active: true,
    created_at: new Date(),
  },
  {
    category_id: "2",
    name: "Comédia",
    description: "Comédia",
    is_active: true,
    created_at: new Date(),
  },
  {
    category_id: "3",
    name: "Drama",
    description: "Drama",
    is_active: true,
    created_at: new Date(),
  },
  {
    category_id: "4",
    name: "Ação",
    description: "Ação",
    is_active: true,
    created_at: new Date(),
  },
  {
    category_id: "5",
    name: "Comédia",
    description: "Comédia",
    is_active: true,
    created_at: new Date(),
  },
  {
    category_id: "6",
    name: "Drama",
    description: "Drama",
    is_active: true,
    created_at: new Date(),
  },
];

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    createCategory: (state, action) => {
      state.push(action.payload);
    },
    updateCategory: (state, action) => {
      const index = state.findIndex(
        (category) => category.category_id === action.payload.category_id,
      );
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    deleteCategory: (state, action) => {
      return state.filter(
        (category) => category.category_id !== action.payload,
      );
    },
  },
});

export const { createCategory, updateCategory, deleteCategory } =
  categorySlice.actions;

export const selectCategories = (state: RootState) => state.category;
export const selectCategoryById = (state: RootState, categoryId: string) =>
  state.category.find((cat) => cat.category_id === categoryId);

export default categorySlice.reducer;

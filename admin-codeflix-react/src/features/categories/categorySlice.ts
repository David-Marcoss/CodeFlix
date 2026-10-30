import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import { apiSlice } from "../api/apiSlice";
import type {
  Category,
  CategoryList,
  CreateCategory,
  GetCategoryById,
  SearchParams,
  UpdateCategory,
} from "../../types/category";

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

const formatSearchParams = (params: SearchParams) => {
  const { page, perPage, search } = params;
  const searchParams = new URLSearchParams();

  searchParams.append("per_page", perPage?.toString() ?? "10");
  searchParams.append("page", page?.toString() ?? "1");
  searchParams.append("filter", search ?? "");

  return searchParams.toString();
};

const deleteCategoryQueryMutation = (category: { category_id: string }) => {
  return {
    url: `${route}/${category.category_id}`,
    method: "DELETE",
  };
};

const getCategoriesQuery = (params: SearchParams) => {
  return {
    url: `${route}?${formatSearchParams(params)}`,
    method: "GET",
  };
};

const getCategoryByIdQuery = (id: string) => {
  return {
    url: `${route}/${id}`,
    method: "GET",
  };
};

const createCategoriesQuery = (data: CreateCategory) => {
  return {
    url: route,
    method: "POST",
    body: data,
  };
};

const updateCategoriesQuery = (data: UpdateCategory) => {
  const { category_id, ...rest } = data;
  return {
    url: `${route}/${category_id}`,
    method: "PATCH",
    body: rest,
  };
};

const route = "/categories";
const categoryApiSlice = apiSlice.injectEndpoints({
  endpoints: ({ query, mutation }) => ({
    createCategory: mutation<Category, CreateCategory>({
      query: createCategoriesQuery,
      invalidatesTags: ["Categories"],
    }),
    updateCategory: mutation<Category, UpdateCategory>({
      query: updateCategoriesQuery,
      invalidatesTags: ["Categories"],
    }),
    getCategoryById: query<GetCategoryById, string>({
      query: getCategoryByIdQuery,
      providesTags: ["Categories"],
    }),
    getCategories: query<CategoryList, SearchParams>({
      query: getCategoriesQuery,
      providesTags: ["Categories"],
    }),
    deleteCategory: mutation<void, { category_id: string }>({
      query: deleteCategoryQueryMutation,
      invalidatesTags: ["Categories"],
    }),
  }),
});

export const { createCategory, updateCategory, deleteCategory } =
  categorySlice.actions;

export const selectCategories = (state: RootState) => state.category;
export const selectCategoryById = (state: RootState, categoryId: string) =>
  state.category.find((cat) => cat.category_id === categoryId);

export default categorySlice.reducer;

export const {
  useGetCategoriesQuery,
  useDeleteCategoryMutation,
  useCreateCategoryMutation,
  useGetCategoryByIdQuery,
  useUpdateCategoryMutation,
} = categoryApiSlice;

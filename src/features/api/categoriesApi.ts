import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { Category } from "../../entities/categories/model/types";

export const categoriesApi = createApi({
  reducerPath: "categoriesApi",
  keepUnusedDataFor: 10,
  baseQuery: fetchBaseQuery({
    // @ts-ignore
    baseUrl: import.meta.env.VITE_APP_API_URL || "%VITE_APP_API_URL%",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("access");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      query: () => ({
        url: `/categories`,
        method: "GET",
      }),
    }),
    createCategory: builder.mutation({
      query: (args) => ({
        url: `/categories/`,
        method: "POST",
        body: { name: args.name },
      }),
    }),
    editCategory: builder.mutation({
      query: (args) => ({
        url: `/categories/${args.id}/`,
        method: "PATCH",
        body: { id: args.id, name: args.name },
      }),
    }),
    deleteCategory: builder.mutation({
      query: (args) => ({
        url: `/categories/${args.id}`,
        method: "DELETE",
        body: { id: args.id },
      }),
    }),
  }),
});

export const { useGetCategoriesQuery, useCreateCategoryMutation, useEditCategoryMutation, useDeleteCategoryMutation } = categoriesApi;

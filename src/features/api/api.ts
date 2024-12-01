import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { Item } from "../../entities/catalog/model/types";
import { Category } from "../../entities/catalog/model/types";
import { HistoryItem } from "../../entities/catalog/model/types";

export const api = createApi({
  reducerPath: "api",
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
    getHistory: builder.query<HistoryItem[], void>({
      query: () => ({
        url: `/history`,
        method: "GET",
      }),
    }),
    placeOrder: builder.mutation({
      query: (args) => ({
        url: "/order",
        method: "POST",
        body: { order: args.order, address: args.address },
      }),
    }),
    /* товары */
    getItems: builder.query<Item[], void>({
      query: () => ({
        url: `/product`,
        method: "GET",
      }),
    }),
    createItem: builder.mutation({
      query: (args) => ({
        url: `/product`,
        method: "POST",
        body: { name: args.name },
      }),
    }),
    editItem: builder.mutation({
      query: (args) => ({
        url: `/product/${args.id}`,
        method: "PATCH",
        body: { id: args.id, name: args.name },
      }),
    }),
    deleteItem: builder.mutation({
      query: (args) => ({
        url: `/product/${args.id}`,
        method: "DELETE",
        body: { id: args.id },
      }),
    }),
    /* категории */
    getCategories: builder.query<Category[], void>({
      query: () => ({
        url: `/category`,
        method: "GET",
      }),
    }),
    createCategory: builder.mutation({
      query: (args) => ({
        url: `/category`,
        method: "POST",
        body: { name: args.name },
      }),
    }),
    editCategory: builder.mutation({
      query: (args) => ({
        url: `/category/${args.id}`,
        method: "PATCH",
        body: { id: args.id, name: args.name },
      }),
    }),
    deleteCategory: builder.mutation({
      query: (args) => ({
        url: `/category/${args.id}`,
        method: "DELETE",
        body: { id: args.id },
      }),
    }),
  }),
});

export const { useGetHistoryQuery, usePlaceOrderMutation, useGetItemsQuery, useCreateItemMutation, useEditItemMutation, useDeleteItemMutation, useGetCategoriesQuery, useCreateCategoryMutation, useEditCategoryMutation, useDeleteCategoryMutation } = api;

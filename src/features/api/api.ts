import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { Item } from "../../entities/catalog/model/types";
import { Category } from "../../entities/catalog/model/types";
import { OrdersforHistory } from "../../entities/catalog/model/types";

export const api = createApi({
  reducerPath: "apiTwo",
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
    getHistory: builder.query<OrdersforHistory[], void>({
      query: () => ({
        url: `/orders`,
        method: "GET",
      }),
    }),
    placeOrder: builder.mutation({
      query: (args) => ({
        url: "/orders/",
        method: "POST",
        body: { order_details: args.order_details, address: args.address },
      }),
    }),
    /* товары */
    getItems: builder.query<Item[], void>({
      query: () => ({
        url: `/products`,
        method: "GET",
      }),
    }),
    createItem: builder.mutation({
      query: (args) => ({
        url: `/products/`,
        method: "POST",
        body: { category_id: args.category_id, image_ref: args.image, name: args.name, description: args.description, weight: args.weight, price: args.price, length: args.length, width: args.width, height: args.height },
      }),
    }),
    editItem: builder.mutation({
      query: (args) => ({
        url: `/products/${args.id}/`,
        method: "PATCH",
        body: { id: args.id, category_id: args.category_id, image_ref: args.image, name: args.name, description: args.description, weight: args.weight, price: args.price, length: args.length, width: args.width, height: args.height },
      }),
    }),
    deleteItem: builder.mutation({
      query: (args) => ({
        url: `/products/${args.id}`,
        method: "DELETE",
        body: { id: args.id },
      }),
    }),
    /* категории */
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

export const { useGetHistoryQuery, usePlaceOrderMutation, useGetItemsQuery, useCreateItemMutation, useEditItemMutation, useDeleteItemMutation, useGetCategoriesQuery, useCreateCategoryMutation, useEditCategoryMutation, useDeleteCategoryMutation } = api;

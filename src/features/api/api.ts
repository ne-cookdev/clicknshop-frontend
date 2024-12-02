import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { Product } from "../../entities/products/model/types";
import { Category } from "../../entities/catalog/model/types";
import { OrdersforHistory } from "../../entities/catalog/model/types";
import { Order } from "../../entities/catalog/model/types";

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
    /* заказы */
    getOrders: builder.query<Order[], void>({
      query: () => ({
        url: `/orders`,
        method: "GET",
      }),
    }),
    createOrder: builder.mutation({
      query: (args) => ({
        url: `/orders/`,
        method: "POST",
        body: { name: args.name },
      }),
    }),
    editOrder: builder.mutation({
      query: (args) => ({
        url: `/orders/${args.id}/`,
        method: "PATCH",
        body: { id: args.id, name: args.name },
      }),
    }),
    deleteOrder: builder.mutation({
      query: (args) => ({
        url: `/orders/${args.number}`,
        method: "DELETE",
        body: { number: args.number },
      }),
    }),
  }),
});

export const { useGetHistoryQuery, usePlaceOrderMutation, useGetCategoriesQuery, useCreateCategoryMutation, useEditCategoryMutation, useDeleteCategoryMutation, useGetOrdersQuery, useCreateOrderMutation, useEditOrderMutation, useDeleteOrderMutation } = api;

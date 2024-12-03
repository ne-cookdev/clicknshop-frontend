import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { Stock } from "../../entities/stocks/model/types";

export const stocksApi = createApi({
  reducerPath: "stocksApi",
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
    getStocks: builder.query<Stock[], void>({
      query: () => ({
        url: `/stocks`,
        method: "GET",
      }),
    }),
    createStock: builder.mutation({
      query: (args) => ({
        url: `/stocks/`,
        method: "POST",
        body: { quantity: args.quantity, product_id: args.product_id, warehouse_id: args.warehouse_id },
      }),
    }),
    editStock: builder.mutation({
      query: (args) => ({
        url: `/stocks/${args.id}/`,
        method: "PATCH",
        body: { id: args.id, quantity: args.quantity },
      }),
    }),
    deleteStock: builder.mutation({
      query: (args) => ({
        url: `/stocks/${args.id}`,
        method: "DELETE",
        body: { id: args.id },
      }),
    }),
  }),
});

export const { useGetStocksQuery, useCreateStockMutation, useEditStockMutation, useDeleteStockMutation } = stocksApi;

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { Order } from "../../entities/orders/model/types";

export const ordersApi = createApi({
  reducerPath: "ordersApi",
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

export const { useGetOrdersQuery, useCreateOrderMutation, useEditOrderMutation, useDeleteOrderMutation } = ordersApi;

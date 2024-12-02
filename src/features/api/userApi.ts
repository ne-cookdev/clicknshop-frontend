import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { Order } from "../../entities/orders/model/types";

export const userApi = createApi({
  reducerPath: "userApi",
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
    getHistory: builder.query<Order[], void>({
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
  }),
});

export const { useGetHistoryQuery, usePlaceOrderMutation } = userApi;

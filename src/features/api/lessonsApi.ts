import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { Item } from "../../entities/catalog/model/types";
import { HistoryItem } from "../../entities/catalog/model/types";

export const lessonsApi = createApi({
  reducerPath: "lessonsApi",
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
    getItems: builder.query<Item[], void>({
      query: () => "/catalog",
    }),
    getHistory: builder.query<HistoryItem[], void>({
      query: () => "/history",
    }),
    placeOrder: builder.mutation({
      query: (args) => ({
        url: "/order",
        method: "POST",
        body: { order: args.order },
      }),
    }),
  }),
});

export const { useGetItemsQuery, useGetHistoryQuery, usePlaceOrderMutation } = lessonsApi;

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import type { Carrier } from "../../entities/carriers/model/types";

export const carriersApi = createApi({
  reducerPath: "carriersApi",
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
    getCarriers: builder.query<Carrier[], void>({
      query: () => ({
        url: `/carriers`,
        method: "GET",
      }),
    }),
    createCarrier: builder.mutation({
      query: (args) => ({
        url: `/carriers/`,
        method: "POST",
        body: { name: args.name },
      }),
    }),
    editCarrier: builder.mutation({
      query: (args) => ({
        url: `/carriers/${args.id}/`,
        method: "PATCH",
        body: { id: args.id, name: args.name },
      }),
    }),
    deleteCarrier: builder.mutation({
      query: (args) => ({
        url: `/carriers/${args.id}`,
        method: "DELETE",
        body: { id: args.id },
      }),
    }),
  }),
});

export const { useGetCarriersQuery, useCreateCarrierMutation, useEditCarrierMutation, useDeleteCarrierMutation } = carriersApi;

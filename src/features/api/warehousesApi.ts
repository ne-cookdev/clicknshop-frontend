import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { Warehouse } from "../../entities/warehouses/model/types";

export const warehousesApi = createApi({
  reducerPath: "warehousesApi",
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
    getWarehouses: builder.query<Warehouse[], void>({
      query: () => ({
        url: `/warehouses`,
        method: "GET",
      }),
    }),
    createWarehouse: builder.mutation({
      query: (args) => ({
        url: `/warehouses/`,
        method: "POST",
        body: { name: args.name, location: args.location },
      }),
    }),
    editWarehouse: builder.mutation({
      query: (args) => ({
        url: `/warehouses/${args.id}/`,
        method: "PATCH",
        body: { id: args.id, name: args.name, location: args.location },
      }),
    }),
    deleteWarehouse: builder.mutation({
      query: (args) => ({
        url: `/warehouses/${args.id}`,
        method: "DELETE",
        body: { id: args.id },
      }),
    }),
  }),
});

export const { useGetWarehousesQuery, useCreateWarehouseMutation, useEditWarehouseMutation, useDeleteWarehouseMutation } = warehousesApi;

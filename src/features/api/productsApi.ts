import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { Product } from "../../entities/products/model/types";

export const productsApi = createApi({
  reducerPath: "productsApi",
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
    getProducts: builder.query<Product[], void>({
      query: () => ({
        url: `/products`,
        method: "GET",
      }),
    }),
    createProduct: builder.mutation({
      query: (args) => ({
        url: `/products/`,
        method: "POST",
        body: { category_id: args.category_id, image_ref: args.image, name: args.name, description: args.description, weight: args.weight, price: args.price, length: args.length, width: args.width, height: args.height },
      }),
    }),
    editProduct: builder.mutation({
      query: (args) => ({
        url: `/products/${args.id}/`,
        method: "PATCH",
        body: { id: args.id, category_id: args.category_id, image_ref: args.image, name: args.name, description: args.description, weight: args.weight, price: args.price, length: args.length, width: args.width, height: args.height },
      }),
    }),
    deleteProduct: builder.mutation({
      query: (args) => ({
        url: `/products/${args.id}`,
        method: "DELETE",
        body: { id: args.id },
      }),
    }),
  }),
});

export const { useGetProductsQuery, useCreateProductMutation, useEditProductMutation, useDeleteProductMutation } = productsApi;

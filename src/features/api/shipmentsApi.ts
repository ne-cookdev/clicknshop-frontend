import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import type { Shipment } from "../../entities/shipments/model/types";

export const shipmentsApi = createApi({
  reducerPath: "shipmentsApi",
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
    getShipments: builder.query<Shipment[], void>({
      query: () => ({
        url: `/shipments`,
        method: "GET",
      }),
    }),
    createShipment: builder.mutation({
      query: (args) => ({
        url: `/shipments/`,
        method: "POST",
        body: { order_id: args.order_id, carrier_id: args.carrier_id, status: args.status },
      }),
    }),
    editShipment: builder.mutation({
      query: (args) => ({
        url: `/shipments/${args.tracking_number}/`,
        method: "PATCH",
        body: { tracking_number: args.tracking_number, carrier_id: args.carrier_id, status: args.status },
      }),
    }),
    deleteShipment: builder.mutation({
      query: (args) => ({
        url: `/shipments/${args.id}`,
        method: "DELETE",
        body: { id: args.id },
      }),
    }),
  }),
});

export const { useGetShipmentsQuery, useCreateShipmentMutation, useEditShipmentMutation, useDeleteShipmentMutation } = shipmentsApi;

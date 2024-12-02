import { configureStore } from "@reduxjs/toolkit";

import { accountsApi } from "../features/api/accountsApi";
import { carriersApi } from "../features/api/carriersApi";
import { categoriesApi } from "../features/api/categoriesApi";
import { ordersApi } from "../features/api/ordersApi";
import { productsApi } from "../features/api/productsApi";
import { shipmentsApi } from "../features/api/shipmentsApi";
import { userApi } from "../features/api/userApi";

import { setupListeners } from "@reduxjs/toolkit/query";

const store = configureStore({
  reducer: {
    [accountsApi.reducerPath]: accountsApi.reducer,
    [carriersApi.reducerPath]: carriersApi.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [shipmentsApi.reducerPath]: shipmentsApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(accountsApi.middleware, carriersApi.middleware, categoriesApi.middleware, ordersApi.middleware, productsApi.middleware, shipmentsApi.middleware, userApi.middleware),
});

setupListeners(store.dispatch);

export default store;

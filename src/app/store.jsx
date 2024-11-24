import { configureStore } from "@reduxjs/toolkit";
import { accountsApi } from "../features/api/accountsApi";
import { api } from "../features/api/api";
import { setupListeners } from "@reduxjs/toolkit/query";

const store = configureStore({
  reducer: {
    [accountsApi.reducerPath]: accountsApi.reducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(accountsApi.middleware, api.middleware),
});

setupListeners(store.dispatch);

export default store;

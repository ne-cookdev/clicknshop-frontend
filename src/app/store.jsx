import { configureStore } from "@reduxjs/toolkit";
import { accountsApi } from "../features/api/accountsApi";
import { lessonsApi } from "../features/api/lessonsApi";
import { setupListeners } from "@reduxjs/toolkit/query";

const store = configureStore({
  reducer: {
    [accountsApi.reducerPath]: accountsApi.reducer,
    [lessonsApi.reducerPath]: lessonsApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(accountsApi.middleware, lessonsApi.middleware),
});

setupListeners(store.dispatch);

export default store;

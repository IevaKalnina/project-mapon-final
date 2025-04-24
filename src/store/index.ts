// src/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import unitsReducer from "./unitsSlice";
import routesReducer from "./routesSlice";

export const store = configureStore({
  reducer: {
    units: unitsReducer,
    routes: routesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

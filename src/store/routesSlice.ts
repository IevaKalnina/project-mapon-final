import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchRoutes,
  RawRoutePiece,
  RouteListResponse,
} from "../api/fetchRoutes";

export interface RoutePoint {
  gmt: string;
  lat: number;
  lng: number;
  speed: number;
}

export interface RoutePiece {
  type: "route" | "stop";
  decoded_route?: { points: RoutePoint[] };
}

interface RoutesState {
  data: RoutePiece[];
  loading: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
}

const initialState: RoutesState = {
  data: [],
  loading: "idle",
  error: null,
};

export const loadRoutes = createAsyncThunk<
  RoutePiece[],
  { unit_id: number; from: string; till: string },
  { rejectValue: string }
>("routes/load", async ({ unit_id, from, till }, { rejectWithValue }) => {
  try {
    const resp: RouteListResponse = await fetchRoutes(unit_id, from, till);
    if (resp.error) return rejectWithValue(resp.error.msg);
    const pieces = resp.data.units[0]?.routes || [];
    return (pieces as RawRoutePiece[])
      .filter((r) => r.type === "route")
      .map((r) => ({ type: r.type, decoded_route: r.decoded_route }));
  } catch (e: any) {
    return rejectWithValue(e.message);
  }
});

const routesSlice = createSlice({
  name: "routes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadRoutes.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(loadRoutes.fulfilled, (state, { payload }) => {
        state.loading = "succeeded";
        state.data = payload;
      })
      .addCase(loadRoutes.rejected, (state, { payload }) => {
        state.loading = "failed";
        state.error = payload || "Unknown error";
      });
  },
});

export default routesSlice.reducer;

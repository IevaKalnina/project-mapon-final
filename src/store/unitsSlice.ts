import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchUnits, RawUnit, UnitListResponse } from "../api/fetchUnits";

export interface Unit {
  unit_id: number;
  number: string;
  label: string;
}

interface UnitsState {
  data: Unit[];
  loading: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
  selectedId: number | null;
}

const initialState: UnitsState = {
  data: [],
  loading: "idle",
  error: null,
  selectedId: null,
};

export const loadUnits = createAsyncThunk<
  Unit[],
  void,
  { rejectValue: string }
>("units/load", async (_, { rejectWithValue }) => {
  try {
    const resp: UnitListResponse = await fetchUnits();
    if (resp.error) return rejectWithValue(resp.error.msg);
    return resp.data.units.map((u: RawUnit) => ({
      unit_id: u.unit_id,
      number: u.number,
      label: u.vehicle_title || u.label,
    }));
  } catch (e: any) {
    return rejectWithValue(e.message);
  }
});

const unitsSlice = createSlice({
  name: "units",
  initialState,
  reducers: {
    selectUnit(state, action: PayloadAction<number>) {
      state.selectedId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUnits.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(loadUnits.fulfilled, (state, { payload }) => {
        state.loading = "succeeded";
        state.data = payload;
      })
      .addCase(loadUnits.rejected, (state, { payload }) => {
        state.loading = "failed";
        state.error = payload || "Unknown error";
      });
  },
});

export const { selectUnit } = unitsSlice.actions;
export default unitsSlice.reducer;

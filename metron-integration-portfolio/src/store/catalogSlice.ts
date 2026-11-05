import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { integrationService } from '../services/integrationService';
import type { IntegrationCatalog } from '../services/integrationService';

type CatalogStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

interface CatalogState extends IntegrationCatalog {
  status: CatalogStatus;
  error: string | null;
}

const initialState: CatalogState = {
  categories: [],
  integrations: [],
  status: 'idle',
  error: null,
};

export const loadCatalog = createAsyncThunk<
  IntegrationCatalog,
  void,
  { rejectValue: string; state: { catalog: CatalogState } }
>(
  'catalog/load',
  async (_, { rejectWithValue }) => {
    try {
      return await integrationService.getCatalog();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unable to load the integration catalog.');
    }
  },
  {
    condition: (_, { getState }) => {
      const { status } = getState().catalog;
      return status === 'idle' || status === 'failed';
    },
  },
);

const catalogSlice = createSlice({
  name: 'catalog',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadCatalog.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadCatalog.fulfilled, (state, action) => {
        state.categories = action.payload.categories;
        state.integrations = action.payload.integrations;
        state.status = 'succeeded';
      })
      .addCase(loadCatalog.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? action.error.message ?? 'Unable to load the integration catalog.';
      });
  },
});

export default catalogSlice.reducer;
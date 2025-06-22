import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const getBaseUrl = () => {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:4000';
  }
  return 'https://recipals-node-server-app.onrender.com'; 
};

const BASE_URL = getBaseUrl();

export const fetchRecipes = createAsyncThunk('recipes/fetchRecipes', async () => {
  const response = await fetch(`${BASE_URL}/api/recipes`);
  if (!response.ok) throw new Error('Failed to fetch recipes');
  return response.json();
});

export const searchRecipesByName = createAsyncThunk('recipes/searchRecipesByName', async (searchTerm: string) => {
  const response = await fetch(`${BASE_URL}/api/recipes/search?q=${encodeURIComponent(searchTerm)}`);
  if (!response.ok) throw new Error('Failed to search recipes');
  return response.json();
});

const recipesSlice = createSlice({
  name: 'recipes',
  initialState: {
    recipes: [] as any[],
    loading: false,
    error: null as string | null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.loading = false;
        state.recipes = action.payload;
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch recipes';
      })
      .addCase(searchRecipesByName.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchRecipesByName.fulfilled, (state, action) => {
        state.loading = false;
        state.recipes = action.payload;
      })
      .addCase(searchRecipesByName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Search failed';
      });
  }
});

export default recipesSlice.reducer;
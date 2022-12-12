import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  presentations: [],
  isLoaded: false,
};

export const presentationSlice = createSlice({
  name: 'Presentations',
  initialState,
  reducers: {
    setPresentation: (state, action) => {
      return {
        presentations: action.payload,
        isLoaded: true,
      };
    },
  },
});

export const { setPresentation } = presentationSlice.actions;

export default presentationSlice.reducer;

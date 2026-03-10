import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    trailerModal: { isOpen: false, trailerKey: null, title: '' },
    mobileMenu: false,
  },
  reducers: {
    openTrailer: (state, action) => {
      state.trailerModal = { isOpen: true, ...action.payload };
    },
    closeTrailer: (state) => {
      state.trailerModal = { isOpen: false, trailerKey: null, title: '' };
    },
    toggleMobileMenu: (state) => {
      state.mobileMenu = !state.mobileMenu;
    },
    closeMobileMenu: (state) => {
      state.mobileMenu = false;
    }
  }
});

export const { openTrailer, closeTrailer, toggleMobileMenu, closeMobileMenu } = uiSlice.actions;
export default uiSlice.reducer;

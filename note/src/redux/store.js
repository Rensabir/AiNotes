import { configureStore } from "@reduxjs/toolkit";
import notesReducer from "./notesReducer";

export default configureStore({
  reducer: {
    notes: notesReducer,
  },
});

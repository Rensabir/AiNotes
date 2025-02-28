import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "https://ai-notes-7e3b.vercel.app/notes";

export const getNotes = createAsyncThunk("notes/getNotes", async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json(); //
  return data;
});

export const createUpdateNote = createAsyncThunk(
  "notes/createUpdateNote",
  async (note, { dispatch }) => {
    const method = note.id ? "PUT" : "POST";
    const url = note.id ? `${API_URL}/${note.id}` : API_URL;

    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(note),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    await dispatch(getNotes());
    dispatch(sortAndFilter());
    return data;
  }
);

export const deleteNote = createAsyncThunk(
  "notes/deleteNote",
  async (id, { dispatch }) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    await dispatch(getNotes());
    dispatch(sortAndFilter());
    return id;
  }
);

export const toggleNoteStatus = createAsyncThunk(
  "notes/toggleNoteStatus",
  async (id, { getState }) => {
    const notes = getState().notes.all;
    const note = notes.find((note) => note.id === id);
    const updatedNote = { ...note, completed: !note.completed };

    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedNote),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }
);

const initialState = {
  all: [],
  sorted: [],
  searchValue: "",
  activeCategory: "All",
  showNotesForm: false,
  noteToEdit: undefined,
  pending: true,
  error: null,
};

export const slice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    setSearchValue: (state, action) => {
      state.searchValue = action.payload;
    },
    setActiveCategory: (state, action) => {
      state.activeCategory = action.payload;
    },
    toggleNotesForm: (state) => {
      state.showNotesForm = !state.showNotesForm;
      state.noteToEdit = undefined;
    },
    editNote: (state, action) => {
      state.noteToEdit = state.all.find(({ id }) => id === action.payload);
      state.showNotesForm = true;
    },
    sortAndFilter: (state) => {
      let sortedNotes = [...state.all].sort((a, b) => {
        if (a.completed === b.completed)
          return new Date(b.date) - new Date(a.date);
        return b.completed ? -1 : 1;
      });

      if (state.activeCategory !== "All") {
        sortedNotes = sortedNotes.filter(
          (n) => n.category === state.activeCategory
        );
      }

      if (state.searchValue) {
        const searchTerm = state.searchValue.toLowerCase().trim();
        sortedNotes = sortedNotes.filter(({ title, description }) => {
          const titleLower = title.toLowerCase().trim();
          const descriptionLower = description.toLowerCase().trim();
          return (
            titleLower.includes(searchTerm) ||
            descriptionLower.includes(searchTerm)
          );
        });
      }

      state.sorted = sortedNotes;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getNotes.pending, (state) => {
        state.pending = true;
        state.error = null;
      })
      .addCase(getNotes.fulfilled, (state, action) => {
        state.pending = false;
        state.all = action.payload;
        state.error = null;
      })
      .addCase(getNotes.rejected, (state, action) => {
        state.pending = false;
        state.error = action.error.message;
      })
      .addCase(createUpdateNote.fulfilled, (state, action) => {
        if (action.payload.id) {
          // Update
          state.all = state.all.map((note) =>
            note.id === action.payload.id ? action.payload : note
          );
        } else {
          // Create
          state.all.push(action.payload);
        }
        state.error = null;
      })
      .addCase(createUpdateNote.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.all = state.all.filter(({ id }) => id !== action.payload);
        state.error = null;
      })
      .addCase(deleteNote.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(toggleNoteStatus.fulfilled, (state, action) => {
        state.all = state.all.map((note) =>
          note.id === action.payload.id ? action.payload : note
        );
        state.error = null;
      })
      .addCase(toggleNoteStatus.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export const {
  setSearchValue,
  setActiveCategory,
  toggleNotesForm,
  editNote,
  sortAndFilter,
} = slice.actions;

export default slice.reducer;

import SearchBox from "./components/SearchBox";
import ControlButtonsContainer from "./components/ControlButtonsContainer";
import AddNoteButton from "./components/AddNoteButton";
import NotesList from "./components/NotesList";
import NotesForm from "./components/NotesForm";
import { Box, Grid2 } from "@mui/material";
import "./styles/AppStyle.css";
function App() {
  return (
    <Box className="root">
      <Box container spacing={3} className="notes">
        {/* Search Box */}
        <Grid2 item xs={12}>
          <SearchBox />
        </Grid2>

        {/* Control Buttons and AddNoteButton */}
        <Grid2
          container
          item
          xs={12}
          spacing={3}
          alignItems="center"
          margin="15px"
        >
          <Grid2 item sm={9} xs={12}>
            <ControlButtonsContainer />
          </Grid2>
          <Grid2 item sm={3} xs={12}>
            {/* Ensure the AddNote button is aligned right */}
            <Box display="flex" justifyContent="flex-end">
              <AddNoteButton />
            </Box>
          </Grid2>
        </Grid2>

        {/* Notes List */}
        <Grid2 item xs={12}>
          <NotesList />
        </Grid2>
      </Box>
      <NotesForm />
    </Box>
  );
}

export default App;

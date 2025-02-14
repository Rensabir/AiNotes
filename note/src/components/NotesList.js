import { useEffect } from "react";
import { Box } from "@mui/material";
import Note from "./Note.js";
import NoNotesIllustration from "./NoNotes";
import { useSelector, useDispatch } from "react-redux";
import {
  getNotes,
  editNote,
  deleteNote,
  sortAndFilter,
} from "../redux/notesReducer";
import "../styles/NoteList.css";

export default function NotesList() {
  const sortedNotes = useSelector((state) => state.notes.sorted);
  const dispatch = useDispatch();
  const pending = useSelector((state) => state.notes.pending);
  const error = useSelector((state) => state.notes.error);

  useEffect(() => {
    dispatch(getNotes()).then(() => {
      console.log("Dispatching sortAndFilter...");
      dispatch(sortAndFilter());
    });
  }, [dispatch]);

  console.log("NotesList - sortedNotes:", sortedNotes);
  if (pending) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Box className="notesListContainer">
      {sortedNotes.length === 0 ? (
        <div className="noNotes">
          <NoNotesIllustration />
        </div>
      ) : (
        sortedNotes.map((note) => (
          <Box className="noteItem" key={note.id}>
            <Note
              note={note}
              onEdit={(note) => dispatch(editNote(note.id))}
              onDelete={(note) => dispatch(deleteNote(note.id))}
            />
          </Box>
        ))
      )}
    </Box>
  );
}

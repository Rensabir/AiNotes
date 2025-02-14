import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch } from "react-redux";
import { toggleNotesForm } from "../redux/notesReducer";
import "../styles/AddNoteButtonStyle.css";

export default function AddNoteButton() {
  const dispatch = useDispatch();

  return (
    <Button
      variant="contained"
      color="primary"
      className="addNoteButton"
      startIcon={<AddIcon />}
      onClick={() => dispatch(toggleNotesForm())}
    >
      Add note
    </Button>
  );
}

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import { useSelector, useDispatch } from "react-redux";
import {
  toggleNotesForm,
  createUpdateNote,
  getNotes,
  sortAndFilter,
} from "../redux/notesReducer";

// TODO Remove key
const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;

export default function NotesForm() {
  const initialFormState = { title: "", description: "" };
  const isOpened = useSelector((store) => store.notes.showNotesForm);
  const noteToEdit = useSelector((store) => store.notes.noteToEdit);
  const [form, setForm] = useState(initialFormState);
  const dispatch = useDispatch();
  const [isCategorizing, setIsCategorizing] = useState(false);

  useEffect(() => {
    if (noteToEdit) {
      setForm({ title: noteToEdit.title, description: noteToEdit.description });
    } else {
      setForm(initialFormState);
    }
  }, [noteToEdit]);

  const handleClose = () => {
    setForm(initialFormState);
    dispatch(toggleNotesForm());
  };

  async function categorizeNote(text) {
    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/Xenova/distilbert-base-cased",
        {
          headers: { Authorization: `Bearer ${HUGGING_FACE_API_KEY}` },
          method: "POST",
          body: JSON.stringify({
            inputs: text,
            parameters: {
              candidate_labels: ["Home", "Work", "Personal", "Other"],
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const output = await response.json();
      console.log("Categorization output:", output);
      return output.labels[0] || "Other";
    } catch (error) {
      console.error("Categorization error:", error);
      return "Other";
    }
  }

  const updateForm = (key, value) => setForm({ ...form, [key]: value });

  const handleSubmit = async (event) => {
    console.log("this called");
    event.preventDefault();
    setIsCategorizing(true);
    try {
      const category = await categorizeNote(
        form.title + " " + form.description
      );
      console.log(category);
      const noteWithCategory = { ...form, category, id: noteToEdit?.id };
      await dispatch(createUpdateNote(noteWithCategory));
      dispatch(getNotes());
      dispatch(sortAndFilter());
      handleClose();
    } catch (error) {
      console.error("Categorization failed:", error);
    } finally {
      setIsCategorizing(false);
    }
  };

  return (
    <Dialog
      open={isOpened}
      onClose={handleClose}
      aria-labelledby="notes-dialog-title"
      aria-describedby="notes-dialog-form"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="notes-dialog-title">
        <Typography>{noteToEdit ? "Update note" : "Add note"}</Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <InputBase
              placeholder="Add title…"
              value={form.title}
              onChange={(event) => updateForm("title", event.target.value)}
              className="inputField"
              fullWidth
              required
            />
            <TextareaAutosize
              placeholder="Add description…"
              value={form.description}
              onChange={(event) =>
                updateForm("description", event.target.value)
              }
              minRows={5}
              className="inputField"
              style={{ padding: "1em" }}
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Box display="flex" justifyContent="flex-end" width="100%">
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary" disabled={isCategorizing}>
              {isCategorizing
                ? "Categorizing..."
                : noteToEdit
                ? "Update"
                : "Add"}
            </Button>
          </Box>
        </DialogActions>
      </form>
    </Dialog>
  );
}

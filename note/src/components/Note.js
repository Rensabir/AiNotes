import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import Typography from "@mui/material/Typography";
import DeleteNoteButton from "./DeleteNoteButton";
import { Box } from "@mui/material";
import theme from "../theme";
import "../styles/NoteStyle.css";
import { useState, useEffect } from "react";

const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;

export default function Note({ note, onEdit, onDelete }) {
  const [summary, setSummary] = useState(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  useEffect(() => {
    async function summarize() {
      if (note.description.length > 200 && !isSummarizing) {
        setIsSummarizing(true);
        try {
          const response = await fetch(
            "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
            {
              headers: { Authorization: `Bearer ${HUGGING_FACE_API_KEY}` },
              method: "POST",
              body: JSON.stringify(note.description),
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const output = await response.json();
          setSummary(output[0].summary_text);
        } catch (error) {
          console.error("Summarization error:", error);
          setSummary("Error summarizing. See full description.");
        } finally {
          setIsSummarizing(false);
        }
      } else {
        setSummary(null);
      }
    }

    summarize();
  }, [note.description, isSummarizing]);

  return (
    <Card style={{ backgroundColor: theme.palette.white }}>
      <CardContent>
        <Box className="titleContainer">
          <Typography className="title" gutterBottom>
            {note.title}
          </Typography>
          <IconButton
            aria-label="edit"
            className="editIconBtn"
            onClick={() => onEdit(note)}
          >
            <EditIcon />
          </IconButton>
        </Box>

        {isSummarizing ? (
          <Typography variant="body2" component="p" className="noteDescription">
            Summarizing...
          </Typography>
        ) : (
          <Typography variant="body2" component="p" className="noteDescription">
            {summary ? summary : note.description}
          </Typography>
        )}

        {summary && (
          <Typography variant="caption" display="block" gutterBottom>
            (Original description is longer than 200 characters)
          </Typography>
        )}
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", width: "100%" }}
        >
          <DeleteNoteButton
            title={note.title}
            onDelete={() => onDelete(note)}
          />
        </Box>
      </CardContent>
    </Card>
  );
}

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import "../styles/NoNotesIllustrationStyle.css";
import { useSelector } from "react-redux";

export default function NoNotesIllustration() {
  const notes = useSelector((state) => state.notes.all);
  const heading = notes.length
    ? "Couldn’t find any notes"
    : "You don’t have any notes";

  return (
    <Grid item xs={12} className={"root"}>
      <Typography variant="h4" className={"heading"}>
        {heading}
      </Typography>
    </Grid>
  );
}

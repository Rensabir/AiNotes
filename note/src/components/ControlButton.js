import Button from "@mui/material/Button";
import "../styles/ControlButtonsStyle.css";

export default function ControlButtons({ name, active, onClick }) {
  return (
    <>
      <Button
        className={"styledButton"}
        variant={active ? "contained" : "text"}
        onClick={() => onClick(name)}
        disableElevation
      >
        <span>{name}</span>
      </Button>
    </>
  );
}

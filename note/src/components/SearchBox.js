import FormControl from "@mui/material/FormControl";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import { useDispatch } from "react-redux";
import { setSearchValue, sortAndFilter } from "../redux/notesReducer";
import "../styles/SearchInputStyle.css";
import { useCallback } from "react";

export default function SearchBox() {
  const dispatch = useDispatch();

  const onChange = useCallback(
    (value) => {
      dispatch(setSearchValue(value));
      dispatch(sortAndFilter());
    },
    [dispatch]
  );

  return (
    <FormControl className="formControl">
      <SearchIcon className="searchIcon" />
      <InputBase
        placeholder="Search notes…"
        className="searchInput"
        onChange={(e) => onChange(e.target.value)}
      />
    </FormControl>
  );
}

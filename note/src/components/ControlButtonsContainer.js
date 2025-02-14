import ControlButton from "../components/ControlButton.js";
import { useSelector, useDispatch } from "react-redux";
import { setActiveCategory, sortAndFilter } from "../redux/notesReducer";
import "../styles/ControlButtonsStyle.css";

export default function ControlButtons() {
  const activeCategory = useSelector((state) => state.notes.activeCategory);
  const dispatch = useDispatch();

  const notesCategories = {
    Home: "danger",
    Work: "info",
    Personal: "success",
    Other: "fail",
  };
  const categories = Object.keys(notesCategories);

  const handleCategoryClick = (category) => {
    dispatch(setActiveCategory(category));
    dispatch(sortAndFilter());
  };

  return (
    <div className={"controlButtonsRoot"}>
      <ControlButton
        name="All"
        type="primary"
        active={activeCategory === "All"}
        onClick={() => handleCategoryClick("All")}
        displayIndicator={false}
      />
      {categories.map((category, index) => (
        <ControlButton
          name={category}
          active={activeCategory === category}
          onClick={() => handleCategoryClick(category)}
          key={index}
        />
      ))}
    </div>
  );
}

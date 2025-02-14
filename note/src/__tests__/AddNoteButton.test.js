import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useDispatch } from "react-redux";
import AddNoteButton from "../components/AddNoteButton";

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: jest.fn(),
}));

describe("AddNoteButton Component", () => {
  it("renders the 'Add note' button and dispatches the toggleNotesForm action when clicked", () => {
    const mockDispatch = jest.fn();
    useDispatch.mockReturnValue(mockDispatch);

    render(<AddNoteButton />);

    const buttonElement = screen.getByRole("button", { name: /Add note/i });
    expect(buttonElement).toBeInTheDocument();

    fireEvent.click(buttonElement);

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "notes/toggleNotesForm",
    });
  });
});

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import DeleteNoteButton from "../components/DeleteNoteButton";

describe("DeleteNoteButton Component", () => {
  it("renders the delete icon button", () => {
    render(<DeleteNoteButton title="Test Note" onDelete={() => {}} />);

    const deleteIconButton = screen.getByRole("button", { name: /delete/i });
    expect(deleteIconButton).toBeInTheDocument();
  });

  it("opens the confirmation dialog when the delete icon button is clicked", () => {
    render(<DeleteNoteButton title="Test Note" onDelete={() => {}} />);

    const deleteIconButton = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteIconButton);

    const dialogTitle = screen.getByText(/Delete note?/i);
    expect(dialogTitle).toBeInTheDocument();
  });

  it('calls the onDelete handler when the "Delete" button in the dialog is clicked', () => {
    const onDelete = jest.fn();
    render(<DeleteNoteButton title="Test Note" onDelete={onDelete} />);

    const deleteIconButton = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteIconButton);

    const deleteButton = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteButton);

    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it('closes the dialog when the "Cancel" button is clicked', () => {
    render(<DeleteNoteButton title="Test Note" onDelete={() => {}} />);

    const deleteIconButton = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteIconButton);

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelButton);

    const dialogTitle = screen.queryByText(/Delete note?/i);
    expect(dialogTitle).not.toBeInTheDocument();
  });
});

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ControlButtons from "../components/ControlButton";

describe("ControlButton Component", () => {
  it("renders the button with the correct name", () => {
    const name = "Test Button";
    render(<ControlButtons name={name} active={false} onClick={() => {}} />);

    const buttonElement = screen.getByText(name);
    expect(buttonElement).toBeInTheDocument();
  });

  it("calls the onClick handler when clicked", () => {
    const name = "Test Button";
    const onClick = jest.fn();
    render(<ControlButtons name={name} active={false} onClick={onClick} />);

    const buttonElement = screen.getByText(name);
    fireEvent.click(buttonElement);

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith(name);
  });

  it('applies the "contained" variant when active is true', () => {
    const name = "Test Button";
    render(<ControlButtons name={name} active={true} onClick={() => {}} />);

    const buttonElement = screen.getByText(name);
    expect(buttonElement).toHaveClass("MuiButton-contained"); // Check for Material-UI class
  });

  it('applies the "text" variant when active is false', () => {
    const name = "Test Button";
    render(<ControlButtons name={name} active={false} onClick={() => {}} />);

    const buttonElement = screen.getByText(name);
    expect(buttonElement).not.toHaveClass("MuiButton-contained"); // Check for Material-UI class
  });
});

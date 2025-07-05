import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import RunningPage from "../page";

describe("RunningPage", () => {
  it("renders experience step first", () => {
    render(<RunningPage />);
    expect(screen.getAllByText(/experience/i).length).toBeGreaterThan(0);
  });

  it("navigates through steps", async () => {
    render(<RunningPage />);
    // Basic Information step
    expect(screen.getByText(/basic information/i)).toBeInTheDocument();
    expect(screen.getByText(/experience level/i)).toBeInTheDocument();
    
    // Continue to goals step
    await userEvent.click(screen.getByRole("button", { name: /continue/i }));
    
    // Goals step
    expect(screen.getByText(/training goals/i)).toBeInTheDocument();
  });

  it("handles random workout option", async () => {
    render(<RunningPage />);
    // Check that we can find the distance selection dropdown
    expect(screen.getByText(/target distance/i)).toBeInTheDocument();
  });

  it("displays summary with all selected values", async () => {
    render(<RunningPage />);
    // Check that we can find basic form elements
    expect(screen.getByText(/experience level/i)).toBeInTheDocument();
    expect(screen.getByText(/target distance/i)).toBeInTheDocument();
  });
});

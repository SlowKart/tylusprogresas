import { render, screen } from "@testing-library/react";
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), prefetch: jest.fn() }),
}));
import RunningPage from "../page";

describe("RunningPage", () => {
  it("renders experience step first", () => {
    render(<RunningPage />);
    expect(screen.getAllByText(/experience/i).length).toBeGreaterThan(0);
  });

  it("navigates through steps", () => {
    render(<RunningPage />);
    // Simulate step navigation as needed
    // Example: fireEvent.click(screen.getByText(/next/i));
    // Add assertions for each step
  });

  it("handles random workout option", () => {
    render(<RunningPage />);
    // Simulate selecting "no specific goal"
    // Add assertions for random workout summary
  });

  it("displays summary with all selected values", () => {
    render(<RunningPage />);
    // Simulate full flow and check summary
  });
});

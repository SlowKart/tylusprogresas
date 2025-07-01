import { render, screen } from "@testing-library/react";
import HomePage from "../page";

describe("HomePage", () => {
  it("renders landing page content", () => {
    render(<HomePage />);
    expect(screen.getByText(/running/i)).toBeInTheDocument();
  });
});

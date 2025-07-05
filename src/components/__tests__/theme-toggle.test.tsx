import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeToggle } from "../theme-toggle";

// Mock next-themes
const mockSetTheme = vi.fn();

vi.mock("next-themes", () => ({
  useTheme: () => ({
    setTheme: mockSetTheme,
    theme: "light",
  }),
}));

describe("ThemeToggle", () => {
  beforeEach(() => {
    mockSetTheme.mockClear();
  });

  it("renders toggle button", () => {
    render(<ThemeToggle />);
    
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("shows accessibility text", () => {
    render(<ThemeToggle />);
    
    // Check for sr-only text
    expect(screen.getByText("Toggle theme")).toBeInTheDocument();
  });

  it("calls setTheme when clicked", () => {
    render(<ThemeToggle />);
    
    const button = screen.getByRole("button");
    fireEvent.click(button);
    
    expect(mockSetTheme).toHaveBeenCalledWith("dark");
  });

  it("has correct button styling", () => {
    render(<ThemeToggle />);
    
    const button = screen.getByRole("button");
    expect(button).toHaveClass("h-10", "w-10");
  });
});
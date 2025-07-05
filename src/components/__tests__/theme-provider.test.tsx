import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "../theme-provider";

// Mock next-themes
vi.mock("next-themes", () => ({
  ThemeProvider: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => (
    <div data-testid="theme-provider" data-props={JSON.stringify(props)}>
      {children}
    </div>
  ),
}));

describe("ThemeProvider", () => {
  it("renders children correctly", () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div>Test content</div>
      </ThemeProvider>
    );
    
    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("passes props to NextThemesProvider", () => {
    render(
      <ThemeProvider 
        attribute="class" 
        defaultTheme="dark" 
        enableSystem={false}
        storageKey="custom-theme"
      >
        <div>Test content</div>
      </ThemeProvider>
    );
    
    const provider = screen.getByTestId("theme-provider");
    const props = JSON.parse(provider.getAttribute("data-props") || "{}");
    
    expect(props).toEqual({
      attribute: "class",
      defaultTheme: "dark",
      enableSystem: false,
      storageKey: "custom-theme",
    });
  });

  it("handles default props correctly", () => {
    render(
      <ThemeProvider>
        <div>Test content</div>
      </ThemeProvider>
    );
    
    expect(screen.getByTestId("theme-provider")).toBeInTheDocument();
    expect(screen.getByText("Test content")).toBeInTheDocument();
  });
});
import { render, screen, fireEvent } from "@testing-library/react";
import { StepLayout } from "../StepLayout";

describe("StepLayout", () => {
  it("renders children", () => {
    render(
      <StepLayout title="Test Title">
        <div>Test Child</div>
      </StepLayout>
    );
    expect(screen.getByText("Test Child")).toBeInTheDocument();
    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("renders back button and calls onBack", () => {
    const onBack = vi.fn();
    render(
      <StepLayout title="Test Title" onBack={onBack}>
        <div>Step Content</div>
      </StepLayout>
    );
    const backButton = screen.getByRole("button", { name: /back/i });
    fireEvent.click(backButton);
    expect(onBack).toHaveBeenCalled();
  });
});

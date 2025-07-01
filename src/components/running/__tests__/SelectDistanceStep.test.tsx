import { render, screen, fireEvent } from "@testing-library/react";
import { SelectDistanceStep } from "../SelectDistanceStep";
import { DISTANCES } from "@/constants/running";

describe("SelectDistanceStep", () => {
  it("renders all distance options", () => {
    render(
      <SelectDistanceStep
        distances={DISTANCES}
        onSelect={vi.fn()}
        onBack={vi.fn()}
      />
    );
    DISTANCES.forEach((d) => {
      expect(screen.getByText(d.label)).toBeInTheDocument();
    });
  });

  it("calls onSelect with correct value", () => {
    const onSelect = vi.fn();
    render(
      <SelectDistanceStep
        distances={DISTANCES}
        onSelect={onSelect}
        onBack={vi.fn()}
      />
    );
    fireEvent.click(screen.getByText(DISTANCES[0].label));
    expect(onSelect).toHaveBeenCalledWith(DISTANCES[0].value);
  });

  it("calls onBack when back button is clicked", () => {
    const onBack = vi.fn();
    render(
      <SelectDistanceStep
        distances={DISTANCES}
        onSelect={vi.fn()}
        onBack={onBack}
      />
    );
    const backButton = screen.getByRole("button", { name: /back/i });
    fireEvent.click(backButton);
    expect(onBack).toHaveBeenCalled();
  });
});

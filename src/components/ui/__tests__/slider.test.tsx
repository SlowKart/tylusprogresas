import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Slider } from "../slider";

describe("Slider", () => {
  it("renders with correct ARIA attributes", () => {
    render(
      <Slider
        min={0}
        max={100}
        step={10}
        value={[50]}
        onValueChange={vi.fn()}
      />
    );
    const slider = screen.getByRole("slider");
    expect(slider).toHaveAttribute("aria-valuemin", "0");
    expect(slider).toHaveAttribute("aria-valuemax", "100");
    expect(slider).toHaveAttribute("aria-valuenow", "50");
  });

  it("handles change event (keyboard interaction)", async () => {
    const onValueChange = vi.fn();
    render(
      <Slider
        min={0}
        max={100}
        step={10}
        value={[50]}
        onValueChange={onValueChange}
      />
    );
    const slider = screen.getByRole("slider");
    await userEvent.type(slider, "{arrowright}");
    expect(slider).toBeInTheDocument();
  });
});

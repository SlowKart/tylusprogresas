import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RadioGroup, RadioGroupItem } from "../radio-group";

describe("RadioGroup", () => {
  it("renders options and handles selection change", async () => {
    const onValueChange = vi.fn();
    render(
      <RadioGroup value="1" onValueChange={onValueChange}>
        <label>
          <RadioGroupItem value="1" /> Option 1
        </label>
        <label>
          <RadioGroupItem value="2" /> Option 2
        </label>
      </RadioGroup>
    );
    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
    const radios = screen.getAllByRole("radio");
    await userEvent.click(radios[1]);
    expect(onValueChange).toHaveBeenCalledWith("2");
  });
});

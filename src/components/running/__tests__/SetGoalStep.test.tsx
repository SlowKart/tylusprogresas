import { render, screen, fireEvent } from "@testing-library/react";
import { SetGoalStep } from "../SetGoalStep";
import { FINISH_TIME_RANGES } from "@/constants/running";

describe("SetGoalStep", () => {
  const validSelected = Object.keys(FINISH_TIME_RANGES)[0];
  const defaultProps = {
    selected: validSelected,
    finishTime: FINISH_TIME_RANGES[validSelected].min,
    goalWeeks: 8,
    onFinishTimeChange: jest.fn(),
    onGoalWeeksChange: jest.fn(),
    onContinue: jest.fn(),
    onBack: jest.fn(),
  };

  it("renders both sliders", () => {
    render(<SetGoalStep {...defaultProps} />);
    expect(
      screen.getByText(/select your target finish time/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/time to achieve this goal/i)).toBeInTheDocument();
  });

  it("calls onContinue when form is submitted", () => {
    const onContinue = jest.fn();
    const { container } = render(
      <SetGoalStep {...defaultProps} onContinue={onContinue} />
    );
    const form = container.querySelector("form");
    if (form) fireEvent.submit(form);
    expect(onContinue).toHaveBeenCalled();
  });

  it("calls onBack when back button is clicked", () => {
    const onBack = jest.fn();
    render(<SetGoalStep {...defaultProps} onBack={onBack} />);
    fireEvent.click(screen.getByRole("button", { name: /back/i }));
    expect(onBack).toHaveBeenCalled();
  });
});

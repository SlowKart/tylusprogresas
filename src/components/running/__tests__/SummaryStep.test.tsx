import { render, screen, fireEvent } from "@testing-library/react";
import { SummaryStep } from "../SummaryStep";
import { DistanceValue, ExperienceLevel } from "@/constants/running";

describe("SummaryStep", () => {
  const defaultProps = {
    selected: "5km" as DistanceValue,
    finishTime: 1800,
    goalWeeks: 8,
    calculatedPace: "5:00",
    randomWorkout: null,
    onBack: vi.fn(),
    level: "beginner" as ExperienceLevel,
    frequency: 3,
  };

  it("displays summary for normal goal", () => {
    render(<SummaryStep {...defaultProps} />);
    expect(screen.getByText(/goal summary/i)).toBeInTheDocument();
    expect(screen.getByText(/distance/i)).toBeInTheDocument();
    expect(screen.getByText(/finish time/i)).toBeInTheDocument();
    expect(screen.getByText(/pace/i)).toBeInTheDocument();
    expect(screen.getByText(/time to achieve/i)).toBeInTheDocument();
    expect(screen.getByText(/experience level/i)).toBeInTheDocument();
    expect(screen.getByText(/training frequency/i)).toBeInTheDocument();
  });

  it("displays random workout if selected is none", () => {
    render(
      <SummaryStep
        {...defaultProps}
        selected={"none" as DistanceValue}
        randomWorkout="Random workout!"
      />
    );
    expect(screen.getByText(/your workout/i)).toBeInTheDocument();
    expect(screen.getAllByText(/random workout/i).length).toBeGreaterThan(0);
  });

  it("calls onBack when back button is clicked", () => {
    const onBack = vi.fn();
    render(<SummaryStep {...defaultProps} onBack={onBack} />);
    fireEvent.click(screen.getByRole("button", { name: /back/i }));
    expect(onBack).toHaveBeenCalled();
  });
});

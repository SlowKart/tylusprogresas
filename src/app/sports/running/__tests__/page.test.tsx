import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), prefetch: jest.fn() }),
}));
import RunningPage from "../page";

describe("RunningPage", () => {
  it("renders experience step first", () => {
    render(<RunningPage />);
    expect(screen.getAllByText(/experience/i).length).toBeGreaterThan(0);
  });

  it("navigates through steps", async () => {
    render(<RunningPage />);
    // Experience step
    expect(
      screen.getByText(/select your experience level/i)
    ).toBeInTheDocument();
    // Select 'Intermediate'
    await userEvent.click(screen.getByLabelText(/intermediate/i));
    // Change frequency slider (simulate arrow right)
    const sliders = screen.getAllByRole("slider");
    await userEvent.type(sliders[0], "{arrowright}");
    // Continue to distance step
    await userEvent.click(screen.getByRole("button", { name: /continue/i }));
    // Distance step
    expect(screen.getByText(/select your distance/i)).toBeInTheDocument();
    // Select '10 km'
    await userEvent.click(
      screen.getByRole("button", { name: /select 10 km/i })
    );
    // Goal step
    expect(screen.getByText(/set your goal/i)).toBeInTheDocument();
    // Continue to summary
    await userEvent.click(screen.getByRole("button", { name: /continue/i }));
    // Summary step
    expect(screen.getByText(/goal summary/i)).toBeInTheDocument();
    expect(screen.getByText(/10 km/i)).toBeInTheDocument();
  });

  it("handles random workout option", async () => {
    render(<RunningPage />);
    // Experience step: continue
    await userEvent.click(screen.getByRole("button", { name: /continue/i }));
    // Distance step: select 'No Specific Goal'
    await userEvent.click(
      screen.getByRole("button", { name: /select no specific goal/i })
    );
    // Summary step: random workout
    expect(screen.getByText(/your workout/i)).toBeInTheDocument();
    expect(screen.getByText(/randomly generated workout/i)).toBeInTheDocument();
  });

  it("displays summary with all selected values", async () => {
    render(<RunningPage />);
    // Experience step: select 'Advanced', frequency 5
    await userEvent.click(screen.getByLabelText(/advanced/i));
    const sliders = screen.getAllByRole("slider");
    // Move slider to 5 (simulate 3 right arrows from default 2)
    await userEvent.type(sliders[0], "{arrowright}{arrowright}{arrowright}");
    await userEvent.click(screen.getByRole("button", { name: /continue/i }));
    // Distance step: select 'Marathon'
    await userEvent.click(
      screen.getByRole("button", { name: /select marathon/i })
    );
    // Goal step: continue
    await userEvent.click(screen.getByRole("button", { name: /continue/i }));
    // Summary step: check all values
    expect(screen.getByText(/goal summary/i)).toBeInTheDocument();
    expect(screen.getByText(/marathon/i)).toBeInTheDocument();
    expect(screen.getByText(/experience level/i)).toBeInTheDocument();
    expect(screen.getByText(/advanced/i)).toBeInTheDocument();
    expect(screen.getByText(/training frequency/i)).toBeInTheDocument();
    expect(screen.getByText(/6x \/ week/i)).toBeInTheDocument();
  });
});

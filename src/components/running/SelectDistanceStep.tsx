import React from "react";
import { Button } from "../ui/button";
import { StepLayout } from "../StepLayout";
import { DistanceOption } from "@/constants/running";

export function SelectDistanceStep({
  distances,
  onSelect,
  onBack,
}: {
  distances: DistanceOption[];
  onSelect: (value: string) => void;
  onBack: () => void;
}) {
  return (
    <StepLayout title="Select Your Distance" onBack={onBack}>
      <div className="flex flex-col gap-form w-full max-w-card">
        {distances.map((d) => (
          <Button
            key={d.value}
            className="w-full"
            onClick={() => onSelect(d.value)}
            aria-label={`Select ${d.label}`}
          >
            {d.label}
          </Button>
        ))}
      </div>
    </StepLayout>
  );
}

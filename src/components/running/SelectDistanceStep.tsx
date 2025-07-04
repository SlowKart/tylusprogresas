import React from "react";
import { Button } from "@/components/ui/button";
import { StepLayout } from "@/components/StepLayout";
import { DistanceOption, DistanceValue } from "@/constants/running";

export function SelectDistanceStep({
  distances,
  onSelect,
  onBack,
}: {
  distances: DistanceOption[];
  onSelect: (value: DistanceValue) => void;
  onBack: () => void;
}) {
  return (
    <StepLayout title="Select Your Distance" onBack={onBack}>
      <div className="flex flex-col gap-form w-full">
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

"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AppContainer } from "@/components/AppContainer";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/theme-toggle";

export default function GeneralFitness() {
  const router = useRouter();
  const [daysPerWeek, setDaysPerWeek] = useState([3]);
  const [equipment, setEquipment] = useState<string[]>([]);

  const equipmentOptions = [
    { id: "dumbbells", label: "Dumbbells" },
    { id: "barbell", label: "Barbell" },
    { id: "gym-machines", label: "Gym Machines" },
    { id: "no-equipment", label: "No Equipment" },
  ];

  const handleEquipmentChange = (equipmentId: string, checked: boolean) => {
    if (checked) {
      setEquipment([...equipment, equipmentId]);
    } else {
      setEquipment(equipment.filter(id => id !== equipmentId));
    }
  };

  const handleContinue = () => {
    // For now, just show the selections in console
    console.log("Days per week:", daysPerWeek[0]);
    console.log("Selected equipment:", equipment);
    
    // TODO: Navigate to program selection or summary
    alert(`Selected ${daysPerWeek[0]} days per week with equipment: ${equipment.join(", ") || "none"}`);
  };

  return (
    <AppContainer>
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="flex flex-col items-center justify-center flex-1 p-4">
        <h1 className="text-3xl font-bold mb-8 text-primary">General Fitness</h1>
        
        <div className="flex flex-col gap-8 w-full max-w-card">
          {/* Days per week slider */}
          <div className="space-y-4">
            <Label className="text-lg font-medium">
              How many days per week do you want to exercise?
            </Label>
            <div className="space-y-2">
              <Slider
                value={daysPerWeek}
                onValueChange={setDaysPerWeek}
                max={7}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="text-center text-2xl font-bold text-primary">
                {daysPerWeek[0]} {daysPerWeek[0] === 1 ? "day" : "days"} per week
              </div>
            </div>
          </div>

          {/* Equipment selection */}
          <div className="space-y-4">
            <Label className="text-lg font-medium">
              What equipment do you have available?
            </Label>
            <div className="space-y-3">
              {equipmentOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.id}
                    checked={equipment.includes(option.id)}
                    onCheckedChange={(checked) => 
                      handleEquipmentChange(option.id, checked as boolean)
                    }
                  />
                  <Label 
                    htmlFor={option.id}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-4 mt-8">
            <Button
              className="w-full"
              onClick={handleContinue}
              disabled={equipment.length === 0}
            >
              Continue
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/")}
            >
              Back to Sports
            </Button>
          </div>
        </div>
      </div>
    </AppContainer>
  );
}
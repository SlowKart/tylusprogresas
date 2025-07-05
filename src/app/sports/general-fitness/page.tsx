"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AppContainer } from "@/components/AppContainer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/lib/auth";
import { generateMockWorkout } from "@/utils/mockWorkoutGenerator";
import { CARDIO_OPTIONS } from "@/constants/equipment";
import { EquipmentSelector } from "@/components/EquipmentSelector";
import { DaysPerWeekSelector } from "@/components/DaysPerWeekSelector";

type Step = "preferences" | "cardio";

export default function GeneralFitness() {
  const router = useRouter();
  const { user, isAuthenticated, refreshActiveProgram } = useAuth();
  const [currentStep, setCurrentStep] = useState<Step>("preferences");
  const [daysPerWeek, setDaysPerWeek] = useState([3]);
  const [equipment, setEquipment] = useState<string[]>([]);
  const [cardioType, setCardioType] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);


  const handleEquipmentChange = (equipmentId: string, checked: boolean) => {
    if (checked) {
      setEquipment([...equipment, equipmentId]);
    } else {
      setEquipment(equipment.filter(id => id !== equipmentId));
    }
  };

  const handleContinueToCardio = () => {
    setCurrentStep("cardio");
  };

  const handleFinish = async () => {
    setIsLoading(true);
    
    try {
      if (isAuthenticated && user) {
        // Save program for authenticated users
        const userSelections = {
          sportType: 'general-fitness' as const,
          daysPerWeek: daysPerWeek[0],
          equipment: equipment,
          cardioType: cardioType
        };

        const programData = generateMockWorkout({
          sport: 'general-fitness',
          daysPerWeek: daysPerWeek[0],
          equipment: equipment,
          cardioType: cardioType
        });

        await authService.saveProgram(user.id, 'general-fitness', userSelections, programData);
        await refreshActiveProgram();
        
        // Redirect to dashboard where they can start their program
        router.push("/dashboard");
      } else {
        // For guest users, navigate to workout display with parameters
        const params = new URLSearchParams({
          sport: "general-fitness",
          days: daysPerWeek[0].toString(),
          equipment: equipment.join(","),
          cardio: cardioType
        });
        
        router.push(`/sports/workout?${params.toString()}`);
      }
    } catch {
      // Program save failed - fallback to guest flow
      const params = new URLSearchParams({
        sport: "general-fitness",
        days: daysPerWeek[0].toString(),
        equipment: equipment.join(","),
        cardio: cardioType
      });
      
      router.push(`/sports/workout?${params.toString()}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppContainer>
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="flex flex-col items-center justify-center flex-1 p-4">
        <h1 className="text-3xl font-bold mb-8 text-primary">General Fitness</h1>
        
        <div className="flex flex-col gap-8 w-full max-w-card">
          {currentStep === "preferences" && (
            <>
              <DaysPerWeekSelector
                value={daysPerWeek}
                onChange={setDaysPerWeek}
              />

              <EquipmentSelector
                selectedEquipment={equipment}
                onEquipmentChange={handleEquipmentChange}
              />

              {/* Action buttons */}
              <div className="flex flex-col gap-4 mt-8">
                <Button
                  className="w-full"
                  onClick={handleContinueToCardio}
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
            </>
          )}

          {currentStep === "cardio" && (
            <>
              {/* Cardio type selection */}
              <div className="space-y-4">
                <Label className="text-lg font-medium">
                  What type of cardio do you want to do?
                </Label>
                <div className="space-y-3">
                  {CARDIO_OPTIONS.map((option) => (
                    <Button
                      key={option.id}
                      variant={cardioType === option.id ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => setCardioType(option.id)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col gap-4 mt-8">
                <Button
                  className="w-full"
                  onClick={handleFinish}
                  disabled={!cardioType || isLoading}
                >
                  {isLoading ? "Saving..." : "Finish Setup"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setCurrentStep("preferences")}
                >
                  Back
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </AppContainer>
  );
}
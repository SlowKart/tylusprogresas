"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AppContainer } from "@/components/AppContainer";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/lib/auth";
import { generateMockWorkout } from "@/utils/mockWorkoutGenerator";
import { EquipmentSelector } from "@/components/EquipmentSelector";
import { DaysPerWeekSelector } from "@/components/DaysPerWeekSelector";

export default function Bodybuilding() {
  const router = useRouter();
  const { user, isAuthenticated, refreshActiveProgram } = useAuth();
  const [daysPerWeek, setDaysPerWeek] = useState([3]);
  const [equipment, setEquipment] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);


  const handleEquipmentChange = (equipmentId: string, checked: boolean) => {
    if (checked) {
      setEquipment([...equipment, equipmentId]);
    } else {
      setEquipment(equipment.filter(id => id !== equipmentId));
    }
  };

  const handleContinue = async () => {
    setIsLoading(true);
    
    try {
      if (isAuthenticated && user) {
        // Save program for authenticated users
        const userSelections = {
          sportType: 'bodybuilding' as const,
          daysPerWeek: daysPerWeek[0],
          equipment: equipment
        };

        const programData = generateMockWorkout({
          sport: 'bodybuilding',
          daysPerWeek: daysPerWeek[0],
          equipment: equipment
        });

        await authService.saveProgram(user.id, 'bodybuilding', userSelections, programData);
        await refreshActiveProgram();
        
        // Redirect to dashboard where they can start their program
        router.push("/dashboard");
      } else {
        // For guest users, navigate to workout display with parameters
        const params = new URLSearchParams({
          sport: "bodybuilding",
          days: daysPerWeek[0].toString(),
          equipment: equipment.join(",")
        });
        
        router.push(`/sports/workout?${params.toString()}`);
      }
    } catch {
      // Program save failed - fallback to guest flow
      const params = new URLSearchParams({
        sport: "bodybuilding",
        days: daysPerWeek[0].toString(),
        equipment: equipment.join(",")
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
        <h1 className="text-3xl font-bold mb-8 text-primary">Bodybuilding</h1>
        
        <div className="flex flex-col gap-8 w-full max-w-card">
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
              onClick={handleContinue}
              disabled={equipment.length === 0 || isLoading}
            >
              {isLoading ? "Saving..." : "Continue"}
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
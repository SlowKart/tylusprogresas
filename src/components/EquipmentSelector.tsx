/**
 * Reusable equipment selection component
 */
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { EQUIPMENT_OPTIONS, type EquipmentOption } from "@/constants/equipment";

interface EquipmentSelectorProps {
  selectedEquipment: string[];
  onEquipmentChange: (equipmentId: string, checked: boolean) => void;
  title?: string;
  className?: string;
}

/**
 * Equipment selection component with checkboxes
 */
export function EquipmentSelector({
  selectedEquipment,
  onEquipmentChange,
  title = "What equipment do you have available?",
  className = ""
}: EquipmentSelectorProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      <Label className="text-lg font-medium">
        {title}
      </Label>
      <div className="space-y-3">
        {EQUIPMENT_OPTIONS.map((option: EquipmentOption) => (
          <div key={option.id} className="flex items-center space-x-2">
            <Checkbox
              id={option.id}
              checked={selectedEquipment.includes(option.id)}
              onCheckedChange={(checked) => 
                onEquipmentChange(option.id, Boolean(checked))
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
  );
}
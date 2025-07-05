"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { RunningForm } from "@/components/running/RunningForm";

export default function Running() {
  const router = useRouter();

  return (
    <RunningForm onBack={() => router.push("/")} />
  );
}
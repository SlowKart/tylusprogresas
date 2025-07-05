"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { SinglePageRunningForm } from "@/components/running/SinglePageRunningForm";

export default function Running() {
  const router = useRouter();

  return (
    <SinglePageRunningForm onBack={() => router.push("/")} />
  );
}
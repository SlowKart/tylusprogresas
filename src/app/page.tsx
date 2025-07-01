"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";

export default function Home() {
  const router = useRouter();
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <div className="w-full max-w-[393px] flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-8 text-[#1F2024]">
          Select a Sport
        </h1>
        <div className="flex flex-col gap-8 w-full">
          <Button
            variant="primary"
            className="w-full"
            onClick={() => router.push("/sports/running")}
          >
            Running
          </Button>
          <Button variant="primary" className="w-full" onClick={() => {}}>
            General Fitness
          </Button>
        </div>
      </div>
    </main>
  );
}

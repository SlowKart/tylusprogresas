"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 p-4">
      <div className="w-full max-w-[393px] flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">
          Select a Sport
        </h1>
        <div className="flex flex-col gap-8 w-full">
          <button
            className="bg-white shadow-md rounded-xl px-8 py-6 text-xl font-semibold text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition w-full"
            onClick={() => router.push("/sports/running")}
          >
            Running
          </button>
          <button className="bg-white shadow-md rounded-xl px-8 py-6 text-xl font-semibold text-green-600 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-400 transition w-full">
            General Fitness
          </button>
        </div>
      </div>
    </main>
  );
}

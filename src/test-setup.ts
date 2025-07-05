/// <reference types="vitest/globals" />

import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";
import React from "react";

// Make React available globally
global.React = React;

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock pointer capture methods for JSDOM
Object.defineProperty(Element.prototype, "setPointerCapture", {
  value: vi.fn(),
  writable: true,
});

Object.defineProperty(Element.prototype, "hasPointerCapture", {
  value: vi.fn().mockReturnValue(false),
  writable: true,
});

Object.defineProperty(Element.prototype, "releasePointerCapture", {
  value: vi.fn(),
  writable: true,
});

// Mock scrollIntoView for Radix components
Object.defineProperty(Element.prototype, "scrollIntoView", {
  value: vi.fn(),
  writable: true,
});

// Mock Next.js navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), prefetch: vi.fn() }),
}));

// Cleanup after each test case
afterEach(() => {
  cleanup();
});

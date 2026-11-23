import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// Testi tečejo v Nodeu, brez brskalnika: preverjamo poslovno logiko, ne strani.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "node",
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      reportsDirectory: "coverage",
      include: ["src/**/*.{js,jsx}"],
    },
  },
});

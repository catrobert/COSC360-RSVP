import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    test: {
        environment: "jsdom",
        setupFiles: ["./client/src/tests/setup.frontend.js"],
        include: ["client/src/tests/**/*.frontend.test.jsx"],
        css: true,
    },
});

import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    base: "./",
    resolve: {
        alias: {
            "@scenes": resolve(__dirname, "src/scenes"),
            "@objects": resolve(__dirname, "src/objects"),
            "@config": resolve(__dirname, "src/config"),
        },
    },
    server: {
        port: 3000,
        open: true,
    },
    build: {
        outDir: "dist",
    },
});
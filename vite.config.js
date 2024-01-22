import {defineConfig} from "vite";
import reactRefresh from "@vitejs/plugin-react";
import eslintPlugin from "vite-plugin-eslint";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [reactRefresh(), eslintPlugin()],
    server: {
        port: 8080
    },
    preview: {
        port: 8080
    },
    envPrefix: "EXC_"
});

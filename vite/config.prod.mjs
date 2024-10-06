import { defineConfig } from "vite";

export default defineConfig({
  base: "/zuma-phaser/", // Замените на имя вашего репозитория
  build: {
    outDir: "dist", // Убедитесь, что выходная папка указана правильно
    rollupOptions: {
      input: "./index.html", // Убедитесь, что путь к index.html указан правильно
      output: {
        manualChunks: {
          phaser: ["phaser"],
        },
      },
    },
  },
  server: {
    port: 8080,
  },
});

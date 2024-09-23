// import { defineConfig } from 'vite';

// export default defineConfig({
//     base: './',
//     build: {
//         rollupOptions: {
//             output: {
//                 manualChunks: {
//                     phaser: ['phaser']
//                 }
//             }
//         },
//     },
//     server: {
//         port: 8080
//     }
// });
export default {
  build: {
    sourcemap: true,
    outDir: "dist",
  },
};

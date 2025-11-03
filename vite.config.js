// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(),tailwindcss()],
// })


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,        // allow access from external hosts
    port: 5173,        // dev server port
    strictPort: false,
    // Allow all hosts (ngrok, LAN, etc.)
     allowedHosts: [
      'tomika-biogenic-phantasmagorially.ngrok-free.dev'
    ],

  },
});

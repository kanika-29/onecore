import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const divisionImageMap = {
  'general-medicine.jpg': '/assets/therapeutic-general-medicine.jpg',
  'orthopaedics.jpg': '/assets/ortheon.jpg',
  'womens-health.jpg': '/assets/therapeutic-womens-health.jpg',
  'pediatrics.jpg': '/assets/pediaplus.jpg',
  'paediatrics.jpg': '/assets/pediaplus.jpg',
  'neurology.jpg': '/assets/neurix.jpg',
  'ophthalmology.jpg': '/assets/eyerix.jpg',
  'dermatology.jpg': '/assets/vellis.webp',
  'ent.jpg': '/assets/otira.jpg',
  'oncology.jpg': '/assets/cytos.jpg',
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'divisions-image-middleware',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url && req.url.startsWith('/images/divisions/')) {
            const filename = req.url.split('/').pop()?.split('?')[0];
            if (filename && divisionImageMap[filename]) {
              req.url = divisionImageMap[filename];
            }
          }
          next();
        });
      },
    },
  ],
  base: '/',
  server: {
    port: 3000,
    open: false,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/assets/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})



import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // This allows the build process to handle process.env references
    // common in Gemini API code samples while keeping them compatible with static hosting.
    'process.env': process.env
  }
});
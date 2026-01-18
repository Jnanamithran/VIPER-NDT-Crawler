/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Identifies all React files for styling
  ],
  theme: {
    extend: {
      // Custom V.I.P.E.R. colors for the industrial look
      colors: {
        viper: {
          dark: '#020617',
          orange: '#ea580c',
          border: '#1e293b'
        }
      }
    },
  },
  plugins: [],
}
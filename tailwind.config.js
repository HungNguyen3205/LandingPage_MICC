/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#123C3B', // Xanh rừng sâu
          dark: '#0A292A',    // Xanh đậm footer / accent deep
          light: '#1B4E4D',
          surface: '#154443',
        },
        champagne: {
          DEFAULT: '#C8A46B', // Vàng champagne
          hover: '#B59055',
          light: '#F4ECE0',
          muted: '#E6D7BE',
          border: 'rgba(200, 164, 107, 0.35)',
        },
        sand: {
          DEFAULT: '#F7F5EF', // Nền trắng ngà (~70% diện tích)
          muted: '#EFECE2',
          light: '#FCFBF8',
        },
        ink: {
          DEFAULT: '#183D39', // Màu chữ chính
          muted: '#667770',   // Chữ phụ
          light: '#8E9E97',
        }
      },
      fontFamily: {
        serif: ['"Noto Serif"', 'Georgia', 'serif'],
        sans: ['"Be Vietnam Pro"', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        'content': '1240px',
      },
      boxShadow: {
        'subtle': '0 4px 20px -2px rgba(18, 60, 59, 0.05)',
        'card': '0 10px 30px -4px rgba(18, 60, 59, 0.08)',
        'elevated': '0 20px 40px -8px rgba(18, 60, 59, 0.12)',
        'gold': '0 4px 20px -2px rgba(200, 164, 107, 0.25)',
      },
      borderRadius: {
        'luxury': '6px',
      },
      transitionDuration: {
        'smooth': '350ms',
      }
    },
  },
  plugins: [],
}

// Theme colors matching the project design system
// These colors correspond to Tailwind CSS theme defined in globals.css

export const THEME = {
  alabaster: 'rgb(247 243 237)',
  carbon: 'rgb(35 35 35)',
  lightBlack: 'rgb(45 45 45)',
  flamingo: 'rgb(242 92 42)',
  flamingoHover: 'rgb(220 80 35)',
  flamingoLight: 'rgba(242, 92, 42, 0.1)',
} as const

export type ThemeColor = keyof typeof THEME

import { useThemeStore } from '../store/themeStore';

export const darkTheme = {
  background: '#0e0e0e',
  card: '#1c1c1c',
  input: '#141414',
  tabBar: '#2c2c2c',
  text: 'white',
  textMuted: '#9ca3af',
  textInverted: 'black',
  primary: 'white',
  placeholder: '#71717a',
  errorBg: 'rgba(127, 29, 29, 0.4)',
  errorText: '#fca5a5',
  errorInput: '#f87171',
  shadow: '#000',
  white: 'white',
  black: 'black',

  chartPeach: '#FED4B4',
  chartMint: '#3BB9A1',

  layer1: 'rgba(255, 255, 255, 0.05)',
  layer2: 'rgba(255, 255, 255, 0.08)',
};

export const lightTheme = {
  background: '#f9fafb', // very light gray
  card: '#ffffff',
  input: '#f3f4f6',
  tabBar: '#ffffff',
  text: '#111827', // dark slate
  textMuted: '#6b7280',
  textInverted: 'white',
  primary: '#111827', // matching text for primary elements
  placeholder: '#9ca3af',
  errorBg: 'rgba(254, 226, 226, 0.6)',
  errorText: '#b91c1c',
  errorInput: '#ef4444',
  shadow: '#e5e7eb',
  white: 'white',
  black: 'black',

  chartPeach: '#FED4B4',
  chartMint: '#3BB9A1',

  layer1: 'rgba(0, 0, 0, 0.05)',
  layer2: 'rgba(0, 0, 0, 0.08)',
};

export const Colors = darkTheme;

export function useThemeColors() {
  const { theme } = useThemeStore();
  return theme === 'light' ? lightTheme : darkTheme;
}

// Färger och typografi från Figma (Hushållet, node 1:8 "Sysslor - idag").
export const colors = {
  background: '#F2F2F2',
  surface: '#FFFFFF',
  text: '#333333',
  textMuted: '#828282',
  placeholder: '#BDBDBD',
  badge: '#F2F2F2',
  overdue: '#CD5D6F',
  onOverdue: '#FFFFFF',
  border: '#E0E0E0',
} as const;

export const shadow = {
  shadowColor: '#000',
  shadowOffset: { width: 1, height: 2 },
  shadowOpacity: 0.15,
  shadowRadius: 2,
  elevation: 2,
} as const;

export const typography = {
  title: { fontSize: 24, fontWeight: '500' },
  subtitle: { fontSize: 16, fontWeight: '700' },
  taskTitle: { fontSize: 18, fontWeight: '700' },
  taskEmoji: { fontSize: 22 },
  small: { fontSize: 14, fontWeight: '500' },
  caption: { fontSize: 12, fontWeight: '400' },
} as const;

export const AVATAR_COLORS = ['#F4A261', '#E76F51', '#2A9D8F', '#8AB17D', '#E9C46A', '#6D597A', '#457B9D', '#CD5D6F'] as const;

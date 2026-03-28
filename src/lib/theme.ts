export const palettes = [
  { name: 'pink',   point: '#FFDFDF', text: '#e07a7a' },
  { name: 'yellow', point: '#fffeca', text: '#9a9a7a' },
  { name: 'green',  point: '#e7ffe7', text: '#7aaa7a' },
  { name: 'lime',   point: '#d2ff80', text: '#8aaa3a' },
  { name: 'cyan',   point: '#a9fff9', text: '#5aaeaa' },
  { name: 'blue',   point: '#b1c1ff', text: '#6a7acc' },
  { name: 'purple', point: '#e3acff', text: '#9a6ab0' },
]

export function applyTheme() {
  const idx = Math.floor(Math.random() * palettes.length)
  const p = palettes[idx]
  const root = document.documentElement
  root.style.setProperty('--theme-point', p.point)
  root.style.setProperty('--theme-text', p.text)
}

// Utilitário de fallbacks visuais em SVG limpo para resiliência total contra falhas de rede

export const SVG_FALLBACK_SEWING_MACHINE = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="50%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#1e3a8a"/>
    </linearGradient>
  </defs>
  <rect width="800" height="500" fill="url(#bg)"/>
  <circle cx="400" cy="220" r="110" fill="#2563eb" opacity="0.15"/>
  <path d="M260 320h280v20H260z" fill="#f59e0b" rx="4"/>
  <path d="M300 320V180h180v40h-80v100h-30V240h-40v80z" fill="#f8fafc" opacity="0.9"/>
  <circle cx="480" cy="200" r="26" fill="#f59e0b" opacity="0.8"/>
  <path d="M420 280v40M420 320l-4-4" stroke="#f59e0b" stroke-width="4" stroke-linecap="round"/>
  <text x="400" y="380" font-family="system-ui, sans-serif" font-size="22" font-weight="bold" fill="#ffffff" text-anchor="middle">
    Grupo Eloizio · Mecânica &amp; Bancada Técnica
  </text>
  <text x="400" y="410" font-family="system-ui, sans-serif" font-size="14" fill="#94a3b8" text-anchor="middle">
    São Gonçalo - RJ · Padrão Ouro de Ajuste Mecânico
  </text>
</svg>
`)}`;

export const SVG_FALLBACK_CAMILLA = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
  <defs>
    <linearGradient id="cam" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#059669"/>
      <stop offset="100%" stop-color="#0f766e"/>
    </linearGradient>
  </defs>
  <rect width="200" height="200" fill="url(#cam)" rx="100"/>
  <circle cx="100" cy="75" r="38" fill="#fef3c7"/>
  <path d="M46 165c0-30 24-54 54-54s54 24 54 54" fill="#fef3c7" opacity="0.95"/>
  <text x="100" y="190" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">
    Camilla Faria (28a)
  </text>
</svg>
`)}`;

export const SVG_FALLBACK_LUIZA = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
  <defs>
    <linearGradient id="luiz" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e1b4b"/>
      <stop offset="100%" stop-color="#312e81"/>
    </linearGradient>
  </defs>
  <rect width="200" height="200" fill="url(#luiz)" rx="100"/>
  <circle cx="100" cy="75" r="38" fill="#fef08a"/>
  <path d="M46 165c0-30 24-54 54-54s54 24 54 54" fill="#fef08a" opacity="0.95"/>
  <text x="100" y="190" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="#f59e0b" text-anchor="middle">
    Luiza Souza (IA)
  </text>
</svg>
`)}`;

export const SVG_FALLBACK_COURSE = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450">
  <defs>
    <linearGradient id="cbg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e3a8a"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
  </defs>
  <rect width="800" height="450" fill="url(#cbg)"/>
  <circle cx="400" cy="180" r="80" fill="#3b82f6" opacity="0.2"/>
  <path d="M350 140h100v80h-100z" fill="#f59e0b" opacity="0.9" rx="8"/>
  <path d="M370 170l20 20 40-40" stroke="#0f172a" stroke-width="6" fill="none" stroke-linecap="round"/>
  <text x="400" y="280" font-family="system-ui, sans-serif" font-size="24" font-weight="900" fill="#ffffff" text-anchor="middle">
    Curso Padrão Ouro · Grupo Eloizio
  </text>
  <text x="400" y="315" font-family="system-ui, sans-serif" font-size="15" fill="#93c5fd" text-anchor="middle">
    Certificado Válido Lei 9.394/96 · 100% Online com Prática
  </text>
</svg>
`)}`;

export const handleImageError = (
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackType: 'machine' | 'camilla' | 'luiza' | 'course' = 'machine'
) => {
  const target = e.currentTarget;
  if (fallbackType === 'camilla') {
    target.src = SVG_FALLBACK_CAMILLA;
  } else if (fallbackType === 'luiza') {
    target.src = SVG_FALLBACK_LUIZA;
  } else if (fallbackType === 'course') {
    target.src = SVG_FALLBACK_COURSE;
  } else {
    target.src = SVG_FALLBACK_SEWING_MACHINE;
  }
};

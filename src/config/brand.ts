export const BRAND = {
  name: 'DeudARG',
  shortName: 'DeudARG',
  description: 'Organizá tus deudas. Una cosa por vez.',
  tagline: 'Una cosa por vez.',
  seoTitle: 'DeudARG — Organizá tus deudas',
  seoDescription: 'Una herramienta privada para organizar deudas, registrar pagos y entender tu progreso. Tus datos financieros quedan en tu dispositivo.',
  openGraphDescription: 'Una cosa por vez. Organizá tus deudas, registrá pagos y entendé tu progreso sin conectar bancos ni crear una cuenta.',
} as const

export const EXTERNAL_LINKS: { cafecito:string; feedbackUrl?:string } = {
  cafecito: 'https://cafecito.app/hmil',
}

export const PWA_META = {
  name: BRAND.name,
  short_name: BRAND.shortName,
  description: BRAND.description,
} as const

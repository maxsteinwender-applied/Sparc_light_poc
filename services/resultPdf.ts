import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib'
import QRCode from 'qrcode'
import dekaLogoImage from '../assets/e088cf5e6488ed30341523cb4f504779a4587bd6.png'

export interface ResultPdfPayload {
  goalLabel: string
  durationYears: number
  targetYear: number
  targetAmount: number
  monthlySavings: number
  annualRate: number
  totalInvested: number
  totalReturn: number
  generatedAt: Date
  resultDeepLink: string
}

interface ResultPdfProfileRow {
  label: string
  value: string
}

export interface ResultPdfViewModel {
  title: string
  generatedAtLabel: string
  monthlySavingsLabel: string
  overviewTitle: string
  overviewSentence: string
  profileRows: ResultPdfProfileRow[]
  linkCtaLabel: string
  linkUrl: string
  nextStepsTitle: string
  nextSteps: string[]
  contactTitle: string
  contactLines: string[]
  legalTitle: string
  legalText: string
}

const PAGE_WIDTH = 595.28
const PAGE_HEIGHT = 841.89
const PAGE_MARGIN = 28
const PRIMARY = rgb(0.933, 0, 0)
const INK = rgb(0, 0.216, 0.271)
const MUTED = rgb(0.31, 0.447, 0.502)
const BORDER = rgb(0.86, 0.91, 0.93)
const SURFACE = rgb(0.965, 0.979, 0.984)
const WHITE = rgb(1, 1, 1)

const currencyFormatter = new Intl.NumberFormat('de-DE', {
  maximumFractionDigits: 0,
})

const formatCurrency = (value: number): string => {
  return `${currencyFormatter.format(Math.round(value))} EUR`
}

const formatAnnualRate = (value: number): string => {
  return `${(value * 100).toFixed(1).replace('.', ',')} %`
}

const topToY = (top: number, textSizeOrHeight: number): number => {
  return PAGE_HEIGHT - top - textSizeOrHeight
}

const drawTextTop = ({
  page,
  text,
  x,
  top,
  size,
  font,
  color,
}: {
  page: PDFPage
  text: string
  x: number
  top: number
  size: number
  font: PDFFont
  color: ReturnType<typeof rgb>
}) => {
  page.drawText(text, {
    x,
    y: topToY(top, size),
    size,
    font,
    color,
  })
}

const drawRectTop = ({
  page,
  x,
  top,
  width,
  height,
  fill,
  borderColor,
  borderWidth = 1,
}: {
  page: PDFPage
  x: number
  top: number
  width: number
  height: number
  fill?: ReturnType<typeof rgb>
  borderColor?: ReturnType<typeof rgb>
  borderWidth?: number
}) => {
  page.drawRectangle({
    x,
    y: topToY(top, height),
    width,
    height,
    color: fill,
    borderColor,
    borderWidth,
  })
}

const splitLongToken = ({
  token,
  maxWidth,
  font,
  size,
}: {
  token: string
  maxWidth: number
  font: PDFFont
  size: number
}): string[] => {
  const chunks: string[] = []
  let current = ''

  for (const char of token) {
    const next = `${current}${char}`
    if (font.widthOfTextAtSize(next, size) <= maxWidth || current.length === 0) {
      current = next
      continue
    }

    chunks.push(current)
    current = char
  }

  if (current) {
    chunks.push(current)
  }

  return chunks
}

const wrapText = ({
  text,
  maxWidth,
  font,
  size,
}: {
  text: string
  maxWidth: number
  font: PDFFont
  size: number
}): string[] => {
  const tokens = text.trim().split(/\s+/).filter(Boolean)
  if (tokens.length === 0) {
    return []
  }

  const lines: string[] = []
  let current = ''

  const pushCurrent = () => {
    if (current) {
      lines.push(current)
      current = ''
    }
  }

  for (const token of tokens) {
    const candidate = current ? `${current} ${token}` : token
    if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
      current = candidate
      continue
    }

    if (current) {
      pushCurrent()
    }

    if (font.widthOfTextAtSize(token, size) <= maxWidth) {
      current = token
      continue
    }

    const tokenChunks = splitLongToken({
      token,
      maxWidth,
      font,
      size,
    })
    for (const chunk of tokenChunks) {
      if (font.widthOfTextAtSize(chunk, size) <= maxWidth) {
        lines.push(chunk)
      }
    }
  }

  pushCurrent()
  return lines
}

const truncateLine = ({
  line,
  maxWidth,
  font,
  size,
}: {
  line: string
  maxWidth: number
  font: PDFFont
  size: number
}): string => {
  if (font.widthOfTextAtSize(line, size) <= maxWidth) {
    return line
  }

  let truncated = line
  while (truncated.length > 1) {
    truncated = truncated.slice(0, -1)
    const withEllipsis = `${truncated}…`
    if (font.widthOfTextAtSize(withEllipsis, size) <= maxWidth) {
      return withEllipsis
    }
  }

  return '…'
}

const drawTextBlock = ({
  page,
  text,
  x,
  top,
  maxWidth,
  font,
  size,
  color,
  lineHeight = 1.25,
  maxLines,
}: {
  page: PDFPage
  text: string
  x: number
  top: number
  maxWidth: number
  font: PDFFont
  size: number
  color: ReturnType<typeof rgb>
  lineHeight?: number
  maxLines?: number
}): number => {
  const wrapped = wrapText({
    text,
    maxWidth,
    font,
    size,
  })

  const lines = maxLines ? wrapped.slice(0, maxLines) : wrapped
  if (maxLines && wrapped.length > maxLines && lines.length > 0) {
    const lastIndex = lines.length - 1
    lines[lastIndex] = truncateLine({
      line: lines[lastIndex],
      maxWidth,
      font,
      size,
    })
  }

  const lineHeightPx = size * lineHeight
  let cursorTop = top
  for (const line of lines) {
    drawTextTop({
      page,
      text: line,
      x,
      top: cursorTop,
      size,
      font,
      color,
    })
    cursorTop += lineHeightPx
  }

  return cursorTop
}

const slugify = (value: string): string => {
  const slug = value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

  return slug || 'ziel'
}

const datePart = (value: Date): string => {
  return value.toISOString().slice(0, 10)
}

const loadImageBytes = async (imageUrl: string): Promise<Uint8Array | null> => {
  try {
    const response = await fetch(imageUrl)
    if (!response.ok) {
      return null
    }
    return new Uint8Array(await response.arrayBuffer())
  } catch {
    return null
  }
}

const loadQrBytes = async (url: string): Promise<Uint8Array | null> => {
  try {
    const dataUrl = await QRCode.toDataURL(url, {
      width: 256,
      margin: 1,
      color: {
        dark: '#003745',
        light: '#FFFFFF',
      },
    })

    return await loadImageBytes(dataUrl)
  } catch {
    return null
  }
}

export const buildResultPdfViewModel = (
  payload: ResultPdfPayload,
): ResultPdfViewModel => {
  const years = Math.max(1, Math.round(payload.durationYears))
  const overviewSentence = `Ihr angespartes Kapital nach ${years} Jahren Laufzeit und einer monatlichen Sparrate von ${formatCurrency(payload.monthlySavings)} bei einer angenommenen jährlichen Wertentwicklung von ${formatAnnualRate(payload.annualRate)} beträgt voraussichtlich ${formatCurrency(payload.targetAmount)}.`

  return {
    title: 'Ihr persönlicher Vorsparplan',
    generatedAtLabel: payload.generatedAt.toLocaleDateString('de-DE'),
    monthlySavingsLabel: formatCurrency(payload.monthlySavings),
    overviewTitle: 'Ihr Ergebnis im Überblick',
    overviewSentence,
    profileRows: [
      { label: 'Sparziel', value: payload.goalLabel },
      { label: 'Laufzeit', value: `${years} Jahre` },
      { label: 'Zieljahr', value: `${payload.targetYear}` },
      { label: 'Zielbetrag', value: formatCurrency(payload.targetAmount) },
      { label: 'Monatliche Sparrate', value: formatCurrency(payload.monthlySavings) },
      { label: 'Angenommene Wertentwicklung p. a.', value: formatAnnualRate(payload.annualRate) },
      { label: 'Investiertes Kapital', value: formatCurrency(payload.totalInvested) },
      { label: 'Erträge', value: `+${formatCurrency(payload.totalReturn)}` },
    ],
    linkCtaLabel: 'Ergebnis online öffnen',
    linkUrl: payload.resultDeepLink,
    nextStepsTitle: 'Ihre nächsten Schritte',
    nextSteps: [
      'Abschluss in der Filiale',
      'Abschluss in der Internetfiliale',
      'Abschluss in der S-Invest-App',
    ],
    contactTitle: 'Kontaktmöglichkeiten (Platzhalter)',
    contactLines: [
      'Filiale: Bitte Sparkassen-Standort ergänzen',
      'Telefon: Bitte Servicenummer ergänzen',
      'Internetfiliale: Bitte URL ergänzen',
    ],
    legalTitle: 'Rechtliche Hinweise (vorläufig)',
    legalText:
      'Diese Auswertung dient ausschließlich Informationszwecken und stellt weder Anlageberatung noch ein verbindliches Angebot dar. Die dargestellten Werte beruhen auf modellhaften Annahmen, insbesondere zur Wertentwicklung, und können von der tatsächlichen Entwicklung abweichen. Wertentwicklungen der Vergangenheit sind kein verlässlicher Indikator für zukünftige Ergebnisse. Bitte lassen Sie alle Angaben vor einem Abschluss individuell prüfen.',
  }
}

const triggerPdfDownload = ({
  bytes,
  filename,
}: {
  bytes: Uint8Array
  filename: string
}) => {
  const normalizedBytes = Uint8Array.from(bytes)
  const blob = new Blob([normalizedBytes], { type: 'application/pdf' })
  const objectUrl = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = objectUrl
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(objectUrl)
}

export const exportResultPdf = async (
  payload: ResultPdfPayload,
): Promise<void> => {
  const viewModel = buildResultPdfViewModel(payload)
  const pdf = await PDFDocument.create()
  const page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT])
  const fontRegular = await pdf.embedFont(StandardFonts.Helvetica)
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold)

  const contentWidth = PAGE_WIDTH - PAGE_MARGIN * 2
  const linkBlockWidth = 188
  const heroGap = 12
  const heroWidth = contentWidth - linkBlockWidth - heroGap

  const logoBytes = await loadImageBytes(dekaLogoImage)
  const qrBytes = await loadQrBytes(viewModel.linkUrl)

  drawRectTop({
    page,
    x: PAGE_MARGIN,
    top: 18,
    width: contentWidth,
    height: 7,
    fill: PRIMARY,
  })

  drawTextTop({
    page,
    text: 'DekaBank',
    x: PAGE_MARGIN,
    top: 34,
    size: 10,
    font: fontBold,
    color: MUTED,
  })

  drawTextTop({
    page,
    text: `Erstellt am ${viewModel.generatedAtLabel}`,
    x: PAGE_MARGIN,
    top: 48,
    size: 10,
    font: fontRegular,
    color: MUTED,
  })

  drawTextTop({
    page,
    text: viewModel.title,
    x: PAGE_MARGIN,
    top: 64,
    size: 23,
    font: fontBold,
    color: INK,
  })

  if (logoBytes) {
    try {
      const logo = await pdf.embedPng(logoBytes)
      const logoSize = 34
      page.drawImage(logo, {
        x: PAGE_WIDTH - PAGE_MARGIN - logoSize,
        y: topToY(36, logoSize),
        width: logoSize,
        height: logoSize,
      })
    } catch {
      drawTextTop({
        page,
        text: 'DK',
        x: PAGE_WIDTH - PAGE_MARGIN - 18,
        top: 42,
        size: 14,
        font: fontBold,
        color: PRIMARY,
      })
    }
  } else {
    drawTextTop({
      page,
      text: 'DK',
      x: PAGE_WIDTH - PAGE_MARGIN - 18,
      top: 42,
      size: 14,
      font: fontBold,
      color: PRIMARY,
    })
  }

  drawRectTop({
    page,
    x: PAGE_MARGIN,
    top: 108,
    width: heroWidth,
    height: 128,
    fill: PRIMARY,
  })
  drawTextTop({
    page,
    text: 'Monatliche Sparrate',
    x: PAGE_MARGIN + 16,
    top: 126,
    size: 11,
    font: fontBold,
    color: WHITE,
  })
  drawTextTop({
    page,
    text: viewModel.monthlySavingsLabel,
    x: PAGE_MARGIN + 16,
    top: 148,
    size: 31,
    font: fontBold,
    color: WHITE,
  })
  drawTextTop({
    page,
    text: `Sparziel: ${payload.goalLabel}`,
    x: PAGE_MARGIN + 16,
    top: 194,
    size: 12,
    font: fontRegular,
    color: WHITE,
  })

  const linkX = PAGE_MARGIN + heroWidth + heroGap
  drawRectTop({
    page,
    x: linkX,
    top: 108,
    width: linkBlockWidth,
    height: 128,
    fill: SURFACE,
    borderColor: BORDER,
  })
  drawTextTop({
    page,
    text: viewModel.linkCtaLabel,
    x: linkX + 12,
    top: 120,
    size: 11,
    font: fontBold,
    color: INK,
  })

  if (qrBytes) {
    try {
      const qrImage = await pdf.embedPng(qrBytes)
      const qrSize = 64
      page.drawImage(qrImage, {
        x: linkX + 12,
        y: topToY(136, qrSize),
        width: qrSize,
        height: qrSize,
      })
    } catch {
      drawRectTop({
        page,
        x: linkX + 12,
        top: 136,
        width: 64,
        height: 64,
        borderColor: BORDER,
      })
      drawTextTop({
        page,
        text: 'QR',
        x: linkX + 35,
        top: 166,
        size: 12,
        font: fontBold,
        color: MUTED,
      })
    }
  } else {
    drawRectTop({
      page,
      x: linkX + 12,
      top: 136,
      width: 64,
      height: 64,
      borderColor: BORDER,
    })
    drawTextTop({
      page,
      text: 'QR',
      x: linkX + 35,
      top: 166,
      size: 12,
      font: fontBold,
      color: MUTED,
    })
  }

  drawTextBlock({
    page,
    text: viewModel.linkUrl,
    x: linkX + 84,
    top: 142,
    maxWidth: linkBlockWidth - 96,
    font: fontRegular,
    size: 8,
    color: MUTED,
    lineHeight: 1.2,
    maxLines: 7,
  })

  drawTextTop({
    page,
    text: viewModel.overviewTitle,
    x: PAGE_MARGIN,
    top: 252,
    size: 16,
    font: fontBold,
    color: INK,
  })
  drawTextBlock({
    page,
    text: viewModel.overviewSentence,
    x: PAGE_MARGIN,
    top: 274,
    maxWidth: contentWidth,
    font: fontRegular,
    size: 11,
    color: MUTED,
    lineHeight: 1.25,
    maxLines: 3,
  })

  drawRectTop({
    page,
    x: PAGE_MARGIN,
    top: 324,
    width: contentWidth,
    height: 170,
    fill: WHITE,
    borderColor: BORDER,
  })
  drawTextTop({
    page,
    text: 'Steckbrief',
    x: PAGE_MARGIN + 12,
    top: 336,
    size: 12,
    font: fontBold,
    color: INK,
  })

  const rowsPerColumn = 4
  const columnWidth = contentWidth / 2
  const rowHeight = 31
  for (let row = 0; row < rowsPerColumn; row += 1) {
    const rowTop = 354 + row * rowHeight
    drawRectTop({
      page,
      x: PAGE_MARGIN,
      top: rowTop,
      width: contentWidth,
      height: 1,
      fill: BORDER,
    })
  }
  drawRectTop({
    page,
    x: PAGE_MARGIN + columnWidth,
    top: 354,
    width: 1,
    height: rowsPerColumn * rowHeight,
    fill: BORDER,
  })

  viewModel.profileRows.forEach((entry, index) => {
    const columnIndex = index < rowsPerColumn ? 0 : 1
    const rowIndex = index % rowsPerColumn
    const x = PAGE_MARGIN + columnIndex * columnWidth + 12
    const top = 362 + rowIndex * rowHeight

    drawTextTop({
      page,
      text: entry.label,
      x,
      top,
      size: 9,
      font: fontRegular,
      color: MUTED,
    })
    drawTextBlock({
      page,
      text: entry.value,
      x,
      top: top + 11,
      maxWidth: columnWidth - 22,
      font: fontBold,
      size: 10,
      color: INK,
      maxLines: 1,
    })
  })

  drawRectTop({
    page,
    x: PAGE_MARGIN,
    top: 506,
    width: contentWidth,
    height: 118,
    fill: SURFACE,
    borderColor: BORDER,
  })
  drawTextTop({
    page,
    text: viewModel.nextStepsTitle,
    x: PAGE_MARGIN + 12,
    top: 520,
    size: 12,
    font: fontBold,
    color: INK,
  })

  const stepGap = 8
  const stepWidth = (contentWidth - 24 - stepGap * 2) / 3
  viewModel.nextSteps.forEach((step, index) => {
    const cardX = PAGE_MARGIN + 12 + index * (stepWidth + stepGap)
    drawRectTop({
      page,
      x: cardX,
      top: 540,
      width: stepWidth,
      height: 72,
      fill: WHITE,
      borderColor: BORDER,
    })
    drawTextTop({
      page,
      text: `${index + 1}.`,
      x: cardX + 8,
      top: 550,
      size: 10,
      font: fontBold,
      color: PRIMARY,
    })
    drawTextBlock({
      page,
      text: step,
      x: cardX + 20,
      top: 548,
      maxWidth: stepWidth - 28,
      font: fontBold,
      size: 10,
      color: INK,
      maxLines: 2,
    })
  })

  drawRectTop({
    page,
    x: PAGE_MARGIN,
    top: 638,
    width: contentWidth,
    height: 70,
    fill: WHITE,
    borderColor: BORDER,
  })
  drawTextTop({
    page,
    text: viewModel.contactTitle,
    x: PAGE_MARGIN + 12,
    top: 650,
    size: 11,
    font: fontBold,
    color: INK,
  })
  viewModel.contactLines.forEach((line, index) => {
    drawTextTop({
      page,
      text: line,
      x: PAGE_MARGIN + 12,
      top: 666 + index * 11,
      size: 9,
      font: fontRegular,
      color: MUTED,
    })
  })

  drawRectTop({
    page,
    x: PAGE_MARGIN,
    top: 720,
    width: contentWidth,
    height: 94,
    fill: WHITE,
    borderColor: BORDER,
  })
  drawTextTop({
    page,
    text: viewModel.legalTitle,
    x: PAGE_MARGIN + 12,
    top: 732,
    size: 10,
    font: fontBold,
    color: INK,
  })
  drawTextBlock({
    page,
    text: viewModel.legalText,
    x: PAGE_MARGIN + 12,
    top: 746,
    maxWidth: contentWidth - 24,
    font: fontRegular,
    size: 8.5,
    color: MUTED,
    lineHeight: 1.25,
    maxLines: 7,
  })

  const fileName = `vorsparplan-${slugify(payload.goalLabel)}-${datePart(payload.generatedAt)}.pdf`
  const bytes = await pdf.save()
  triggerPdfDownload({
    bytes,
    filename: fileName,
  })
}

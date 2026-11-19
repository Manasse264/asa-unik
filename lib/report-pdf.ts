import type { jsPDF } from "jspdf"

export async function addReportLogo(doc: jsPDF) {
  const response = await fetch("/logo2.jpeg")
  if (!response.ok) {
    throw new Error("Unable to load the Adventist logo")
  }

  const logoBlob = await response.blob()
  const logoData = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result)
      } else {
        reject(new Error("Unable to read the Adventist logo"))
      }
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(logoBlob)
  })

  const logoWidth = 24
  const logoHeight = 11.5
  const pageWidth = doc.internal.pageSize.getWidth()
  doc.addImage(logoData, "JPEG", (pageWidth - logoWidth) / 2, 3, logoWidth, logoHeight)
}

export function addReportWatermark(doc: jsPDF) {
  const drawWatermark = () => {
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 10
    const horizontalRange = pageWidth - margin * 2
    const verticalRange = pageHeight - margin * 2
    const diagonalLength = Math.hypot(horizontalRange, verticalRange)
    const watermarkText = "SDA"

    doc.saveGraphicsState()
    doc.setFont("helvetica", "bold")
    doc.setFontSize(88)
    doc.setTextColor(226, 226, 226)
    const horizontalScale = diagonalLength / doc.getTextWidth(watermarkText)
    const angle = Math.atan2(verticalRange, horizontalRange) * 180 / Math.PI
    doc.text(watermarkText, margin, pageHeight - margin, { angle, horizontalScale })
    doc.restoreGraphicsState()
  }

  doc.internal.events.subscribe("addPage", drawWatermark)
  drawWatermark()
}
import type { jsPDF } from "jspdf"

export async function addReportLogo(doc: jsPDF) {
  const response = await fetch("/logo.jpeg")
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

  const size = 24
  const pageWidth = doc.internal.pageSize.getWidth()
  doc.addImage(logoData, "JPEG", (pageWidth - size) / 2, 6, size, size)
}
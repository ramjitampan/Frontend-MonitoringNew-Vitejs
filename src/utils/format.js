export function formatRupiah(angka) {
  if (angka == null || isNaN(angka)) return "Rp0"
  return "Rp" + Number(angka).toLocaleString("id-ID")
}

export function formatRupiahSingkat(angka) {
  if (angka == null || isNaN(angka)) return "Rp0"
  if (angka >= 1000000000) return "Rp " + (angka / 1000000000).toFixed(1).replace(".", ",") + " M"
  if (angka >= 1000000) return "Rp " + (angka / 1000000).toFixed(1).replace(".", ",") + " Jt"
  return "Rp " + Number(angka).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}

export function formatDate(dateStr) {
  if (!dateStr) return "-"
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString("id-ID", { year: "numeric", month: "short", day: "numeric" })
  } catch {
    return dateStr
  }
}

export function getInitials(name) {
  if (!name) return "?"
  const words = name.trim().split(/\s+/).filter(Boolean)
  return words.slice(0, 2).map((w) => w[0].toUpperCase()).join("")
}

export function formatNumber(num) {
  if (num == null || isNaN(num)) return "0"
  return Number(num).toLocaleString("id-ID")
}

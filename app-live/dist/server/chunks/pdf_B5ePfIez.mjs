import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

async function buildInvoicePdf(inv) {
  const doc = await PDFDocument.create();
  const page = doc.addPage([612, 792]);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const gold = rgb(0.78, 0.62, 0.31);
  const ink = rgb(0.1, 0.1, 0.12);
  const grey = rgb(0.45, 0.45, 0.5);
  const M = 56;
  let y = 740;
  const text = (s, x, yy, size = 11, f = font, c = ink) => page.drawText(s, { x, y: yy, size, font: f, color: c });
  text("INOVISION STUDIOS", M, y, 20, bold, ink);
  text("INVOICE", 612 - M - 90, y, 20, bold, gold);
  y -= 18;
  text("445 S Livernois Rd, Suite 333, Rochester Hills, MI 48307", M, y, 9, font, grey);
  text("Inovisionstudiosllc@gmail.com", M, y - 12, 9, font, grey);
  y -= 56;
  page.drawLine({ start: { x: M, y }, end: { x: 612 - M, y }, thickness: 1, color: gold });
  y -= 26;
  text("BILL TO", M, y, 9, bold, grey);
  text(inv.client_name || "Client", M, y - 16, 13, bold, ink);
  text("INVOICE #" + String(inv.id).padStart(4, "0"), 612 - M - 140, y, 9, bold, grey);
  text("Period: " + inv.period, 612 - M - 140, y - 16, 11, font, ink);
  text("Status: " + inv.status.toUpperCase(), 612 - M - 140, y - 32, 11, font, inv.status === "paid" ? rgb(0.2, 0.7, 0.45) : gold);
  y -= 70;
  page.drawRectangle({ x: M, y: y - 6, width: 612 - 2 * M, height: 26, color: rgb(0.96, 0.96, 0.97) });
  text("DESCRIPTION", M + 10, y + 2, 9, bold, grey);
  text("AMOUNT", 612 - M - 90, y + 2, 9, bold, grey);
  y -= 30;
  text(`Monthly services — ${inv.period}`, M + 10, y, 11);
  text("$" + inv.amount.toFixed(2), 612 - M - 90, y, 11);
  y -= 30;
  page.drawLine({ start: { x: M, y }, end: { x: 612 - M, y }, thickness: 0.5, color: rgb(0.8, 0.8, 0.82) });
  y -= 24;
  text("TOTAL", 612 - M - 200, y, 12, bold, ink);
  text("$" + inv.amount.toFixed(2), 612 - M - 90, y, 14, bold, gold);
  text("Thank you for your business. — Inovision Studios", M, 70, 9, font, grey);
  return doc.save();
}

export { buildInvoicePdf as b };

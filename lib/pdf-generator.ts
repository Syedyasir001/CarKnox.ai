"use client";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { AnalysisResult, AnalysisFormData } from "./types";

const formatINR = (value: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};

export async function generateReportPDF(
  result: AnalysisResult,
  formData: AnalysisFormData
): Promise<void> {
  const serviceCosts = result?.firstYearServiceCost?.estimated ?? 0;
  const partsCosts = result?.spareParts?.reduce(
    (acc, part) => acc + (part?.estimatedCost ?? 0),
    0
  ) ?? 0;
  const computedTotalCost = (formData.askingPrice ?? 0) + serviceCosts + partsCosts;

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let y = 22;

  // Dark background
  doc.setFillColor(10, 15, 30);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // Logo - larger and better positioned
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  doc.text("Car", margin, y);

  doc.setTextColor(56, 189, 248);
  doc.text("Knox", margin + 22, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text("VEHICLE ANALYSIS REPORT", margin, y + 5);

  y += 12;

  // Thin divider
  doc.setDrawColor(30, 41, 59);
  doc.setLineWidth(0.2);
  doc.line(margin, y, pageWidth - margin, y);
  y += 5;

  // Vehicle Title - bigger
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  const vehicleTitle = `${formData.yearOfManufacture} ${formData.carMake} ${formData.carModel}`;
  doc.text(vehicleTitle, margin, y);
  y += 6;

  // Date on same line as title
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }), margin, y);
  y += 8;

  // Verdict badge
  const getVerdict = (verdict: string) => {
    switch (verdict) {
      case "GOOD_DEAL": return { text: "GREAT DEAL", color: [34, 211, 238] };
      case "FAIR": return { text: "FAIR PRICE", color: [56, 189, 248] };
      case "OVERPRICED": return { text: "OVERPRICED", color: [251, 113, 133] };
      default: return { text: verdict, color: [56, 189, 248] };
    }
  };

  const verdict = getVerdict(result?.priceVerdict ?? "FAIR");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(verdict.color[0], verdict.color[1], verdict.color[2]);
  doc.text(verdict.text, margin, y);
  y += 5;

  if (result?.priceVerdictReason) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(120, 130, 150);
    const split = doc.splitTextToSize(result.priceVerdictReason, contentWidth);
    doc.text(split, margin, y);
    y += split.length * 4 + 3;
  }

  y += 3;
  doc.line(margin, y, pageWidth - margin, y);
  y += 5;

  // Price Breakdown - compact
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text("Price Breakdown", margin, y);
  y += 4;

  autoTable(doc, {
    startY: y,
    head: [],
    body: [
      ["Asking Price", formatINR(formData.askingPrice ?? 0)],
      ["Fair Value", formatINR(result?.estimatedFairPrice ?? 0)],
      ["Service (Y1)", formatINR(serviceCosts)],
      ["Parts", formatINR(partsCosts)],
      ["Total Y1 Cost", formatINR(computedTotalCost)],
    ],
    theme: "plain",
    styles: { fontSize: 9, cellPadding: 2, textColor: [255, 255, 255] },
    columnStyles: {
      0: { fontStyle: "bold", textColor: [140, 150, 170] },
      1: { halign: "right" },
    },
    margin: { left: margin, right: margin },
    tableWidth: contentWidth,
  });

  // @ts-expect-error - jspdf-autotable appends lastAutoTable
  y = doc.lastAutoTable.finalY + 4;

  // Service Breakdown
  if (result?.firstYearServiceCost?.breakdown?.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text("Service Breakdown", margin, y);
    y += 4;

    const serviceBody = result.firstYearServiceCost.breakdown.map((item) => [
      item?.item ?? "Service Item",
      item?.priority ?? "ROUTINE",
      formatINR(item?.cost ?? 0),
    ]);

    autoTable(doc, {
      startY: y,
      head: [],
      body: serviceBody,
      theme: "plain",
      styles: { fontSize: 8, cellPadding: 2, textColor: [255, 255, 255] },
      columnStyles: {
        0: { cellWidth: 75 },
        1: { cellWidth: 25 },
        2: { halign: "right", cellWidth: 25 },
      },
      margin: { left: margin, right: margin },
      tableWidth: contentWidth,
    });

    // @ts-expect-error - jspdf-autotable
    y = doc.lastAutoTable.finalY + 4;
  }

  // Parts
  if (result?.spareParts?.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text("Parts Needed", margin, y);
    y += 4;

    const partsBody = result.spareParts.map((part) => [
      part?.partName ?? "Unknown",
      part?.urgency?.replace(/_/g, " ") ?? "ROUTINE",
      part?.isEssential ? "Yes" : "-",
      formatINR(part?.estimatedCost ?? 0),
    ]);

    autoTable(doc, {
      startY: y,
      head: [],
      body: partsBody,
      theme: "plain",
      styles: { fontSize: 8, cellPadding: 2, textColor: [255, 255, 255] },
      columnStyles: {
        0: { cellWidth: 55 },
        1: { cellWidth: 30 },
        2: { cellWidth: 12 },
        3: { halign: "right", cellWidth: 20 },
      },
      margin: { left: margin, right: margin },
      tableWidth: contentWidth,
    });

    // @ts-expect-error - jspdf-autotable
    y = doc.lastAutoTable.finalY + 4;
  }

  // Pros & Cons
  const prosList = result?.pros ?? [];
  const consList = result?.cons ?? [];
  if (prosList.length > 0 || consList.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text("Pros & Cons", margin, y);
    y += 4;

    const allItems: [string, string][] = [];
    prosList.forEach((pro) => allItems.push(["✓", pro]));
    consList.forEach((con) => allItems.push(["✗", con]));

    autoTable(doc, {
      startY: y,
      head: [],
      body: allItems,
      theme: "plain",
      styles: { fontSize: 8, cellPadding: 1.5, textColor: [255, 255, 255] },
      columnStyles: {
        0: { cellWidth: 8 },
        1: { cellWidth: "auto" },
      },
      didParseCell: (data) => {
        if (data.column.index === 0 && data.section === "body") {
          data.cell.styles.textColor = data.cell.raw === "✓" ? [34, 211, 238] : [251, 113, 133];
        }
      },
      margin: { left: margin, right: margin },
      tableWidth: contentWidth,
    });

    // @ts-expect-error - jspdf-autotable
    y = doc.lastAutoTable.finalY + 4;
  }

  // Recommendation
  if (result?.finalRecommendation) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text("Recommendation", margin, y);
    y += 4;

    doc.setFontSize(11);
    doc.setTextColor(56, 189, 248);
    doc.text(result.finalRecommendation, margin, y);
    y += 4;

    if (result?.recommendationReason) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(120, 130, 150);
      const split = doc.splitTextToSize(result.recommendationReason, contentWidth);
      doc.text(split, margin, y);
      y += split.length * 4 + 2;
    }

    if (result?.negotiationTip) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(56, 189, 248);
      doc.text("Negotiation Tip:", margin, y);
      y += 4;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(120, 130, 150);
      const split = doc.splitTextToSize(result.negotiationTip, contentWidth);
      doc.text(split, margin, y);
    }
  }

  // Footer
  const footerY = pageHeight - 15;
  doc.setFontSize(7);
  doc.setTextColor(80, 90, 100);
  doc.text("Disclaimer: AI-generated. Get physical inspection before purchasing.", margin, footerY);
  doc.text("Generated by CarKnox AI", pageWidth - margin - 22, footerY);

  const fileName = `CarKnox_${formData.carMake}_${formData.carModel}_${formData.yearOfManufacture}.pdf`;
  doc.save(fileName);
}
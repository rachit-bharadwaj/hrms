import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export const generatePayslipPDF = async (data: any, outputPath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(outputPath);

    doc.pipe(stream);

    // Header
    doc.fillColor('#444444').fontSize(20).text('HARBOR HRMS', 50, 50);
    doc.fontSize(10).text('123 Business Plaza, Tech Hub', 50, 75);
    doc.text('support@harbor.com | +1 234 567 890', 50, 90);
    doc.moveDown();

    doc.fontSize(16).fillColor('#333333').text('SALARY SLIP', { align: 'center' });
    doc.fontSize(10).text(`${data.month} ${data.year}`, { align: 'center' });
    doc.moveDown();

    // Employee Details Table
    const top = 160;
    doc.text(`Employee Name: ${data.employeeName}`, 50, top);
    doc.text(`Employee Code: ${data.employeeCode}`, 50, top + 15);
    doc.text(`Department: ${data.department}`, 50, top + 30);
    
    doc.text(`Payslip No: ${data.payslipNumber}`, 350, top);
    doc.text(`Run Date: ${new Date().toLocaleDateString()}`, 350, top + 15);
    doc.moveDown();

    // Line items
    doc.rect(50, 220, 500, 20).fill('#f9f9f9');
    doc.fillColor('#333333').fontSize(10).text('Description', 60, 225);
    doc.text('Amount', 450, 225, { align: 'right', width: 90 });

    let y = 250;
    const items = [
      { label: 'Basic Salary', amount: data.basic },
      { label: 'HRA', amount: data.hra },
      { label: 'Other Allowances', amount: data.allowances },
      { label: 'Gross Earnings', amount: data.gross, bold: true },
      { label: 'Deductions (PF)', amount: -data.pf },
      { label: 'Deductions (ESI)', amount: -data.esi },
      { label: 'TDS', amount: -data.tds },
      { label: 'Absent Deductions (LWP)', amount: -data.lwp },
    ];

    items.forEach(item => {
      if (item.bold) doc.font('Helvetica-Bold');
      else doc.font('Helvetica');
      
      doc.text(item.label, 60, y);
      doc.text(item.amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }), 450, y, { align: 'right', width: 90 });
      y += 20;
    });

    // Net Pay
    doc.rect(50, y + 10, 500, 30).fill('#eef2ff');
    doc.fillColor('#1e40af').font('Helvetica-Bold').fontSize(12);
    doc.text('NET SALARY (Take Home)', 60, y + 20);
    doc.text(data.netPay.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }), 450, y + 20, { align: 'right', width: 90 });

    doc.end();
    stream.on('finish', () => resolve(outputPath));
    stream.on('error', reject);
  });
};

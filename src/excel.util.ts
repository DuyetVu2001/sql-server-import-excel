import * as ExcelJS from 'exceljs';
import * as fs from 'fs';

export async function readExcelFile(filePath: string) {
  const workbook = new ExcelJS.Workbook();
  const buffer = fs.readFileSync(filePath);
  const worksheet = await workbook.xlsx.load(buffer);

  const data = [];

  worksheet.eachSheet((sheet, sheetId) => {
    sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) {
        // Assuming the first row contains headers
        // You can process headers here if needed
        return;
      }

      const rowData = {};
      row.eachCell((cell, colNumber) => {
        rowData[`col${colNumber}`] = cell.value;
      });
      data.push(rowData);
    });
  });

  return data;
}

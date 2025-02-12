import * as XLSX from "xlsx";

// Function to parse uploaded Excel file and return JSON data
export function parseExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheetName = workbook.SheetNames[0]; // Get first sheet
      const worksheet = workbook.Sheets[sheetName];

      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // Convert to JSON
      resolve(jsonData);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
}

// Function to get unique OU values
export function getUniqueOUs(data) {
  const ouIndex = data[0].indexOf("OU"); // Find index of "OU" header
  if (ouIndex === -1) return [];

  const uniqueOUs = new Set();
  data.slice(1).forEach((row) => {
    if (row[ouIndex]) {
      uniqueOUs.add(row[ouIndex]);
    }
  });

  return Array.from(uniqueOUs);
}

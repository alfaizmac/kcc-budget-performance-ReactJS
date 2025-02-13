import * as XLSX from "xlsx";

async function UploadExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });

      // Get the first sheet
      const sheetName = workbook.SheetNames[0];
      const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
        header: 1, // Read data as an array
      });

      if (!sheet || sheet.length === 0) {
        reject("Error: The uploaded file is empty or has no readable data.");
        return;
      }

      const headers = sheet[0] || []; // First row as headers
      const data = sheet.slice(1) || []; // Rest as data

      resolve({ headers, data });
    };

    reader.onerror = (error) => reject(error);
    reader.readAsBinaryString(file);
  });
}

export default UploadExcel;

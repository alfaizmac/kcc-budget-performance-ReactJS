export async function fetchSpreadsheetData(spreadsheetUrl) {
  try {
    const response = await fetch(spreadsheetUrl);
    const text = await response.text();

    // Extract data from the HTML table inside the spreadsheet
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");
    const rows = doc.querySelectorAll("table tbody tr");

    const data = [];
    rows.forEach((row) => {
      const cells = row.querySelectorAll("td");
      const rowData = Array.from(cells).map((cell) => cell.innerText.trim());
      data.push(rowData);
    });

    return data;
  } catch (error) {
    console.error("Error fetching spreadsheet data:", error);
    return [];
  }
}

// Function to get unique Centers
export function getUniqueCenters(data) {
  const centerIndex = 4; // "Center" is the 5th column (0-based index)
  const uniqueCenters = new Set();

  data.forEach((row) => {
    if (row[centerIndex]) {
      uniqueCenters.add(row[centerIndex]);
    }
  });

  return Array.from(uniqueCenters);
}

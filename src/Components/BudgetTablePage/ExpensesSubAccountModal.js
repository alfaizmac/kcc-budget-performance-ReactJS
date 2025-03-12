import React, { useState, useEffect } from "react";
import ExpensesMonthlyTable from "./ExpensesMonthlyTable";

const ExpensesSubAccountModal = ({
  open,
  handleClose,
  selectedRow,
  category,
  tableData,
  headers,
  selectedOU,
}) => {
  const [subAccounts, setSubAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalActual, setTotalActual] = useState(0);
  const [totalBudget, setTotalBudget] = useState(0);
  const [selectedSubAccount, setSelectedSubAccount] = useState(null);
  const [subAccountModalOpen, setSubAccountModalOpen] = useState(false);

  useEffect(() => {
    if (open && category && selectedRow && tableData.length && headers.length) {
      extractSubAccounts();
    }
  }, [open, category, selectedRow, tableData]);

  const extractSubAccounts = () => {
    if (!selectedOU || !selectedRow?.center || !category) return;

    const ouIndex = headers.indexOf("OU");
    const centerIndex = headers.indexOf("Center");
    const accountIndex = headers.indexOf("Account");
    const subAccountIndex = headers.indexOf("Sub-Account");

    if (
      ouIndex === -1 ||
      centerIndex === -1 ||
      accountIndex === -1 ||
      subAccountIndex === -1
    ) {
      console.error(
        "❌ Missing required headers: OU, Center, Account, Sub-Account."
      );
      return;
    }

    const actualIndexes = headers
      .map((header, i) => (header.includes("Actual") ? i : -1))
      .filter((i) => i !== -1);

    const budgetIndexes = headers
      .map((header, i) => (header.includes("Budget") ? i : -1))
      .filter((i) => i !== -1);

    let subAccountMap = new Map();
    let totalActualSum = 0;
    let totalBudgetSum = 0;

    tableData.forEach((row) => {
      const accountName = row[accountIndex]?.trim() || "";
      const subAccountName = row[subAccountIndex]?.trim() || "";

      if (
        row[ouIndex]?.trim() === selectedOU &&
        row[centerIndex]?.trim() === selectedRow.center &&
        accountName.startsWith(category.name)
      ) {
        let subActual = actualIndexes.reduce(
          (sum, idx) => sum + (parseFloat(row[idx]) || 0),
          0
        );

        let subBudget = budgetIndexes.reduce(
          (sum, idx) => sum + (parseFloat(row[idx]) || 0),
          0
        );

        totalActualSum += subActual;
        totalBudgetSum += subBudget;

        if (subAccountMap.has(subAccountName)) {
          subAccountMap.set(subAccountName, {
            actual: subAccountMap.get(subAccountName).actual + subActual,
            budget: subAccountMap.get(subAccountName).budget + subBudget,
          });
        } else {
          subAccountMap.set(subAccountName, {
            actual: subActual,
            budget: subBudget,
          });
        }
      }
    });

    setSubAccounts(
      Array.from(subAccountMap, ([name, data]) => ({
        name,
        actual: data.actual,
        budget: data.budget,
      }))
    );
    setTotalActual(totalActualSum);
    setTotalBudget(totalBudgetSum);
  };

  if (!open || !category || !selectedRow) return null;

  const filteredSubAccounts = subAccounts.filter((sub) =>
    sub.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePrint = () => {
    const printContent = document.getElementById("printableContentSubAccount");
    const printWindow = window.open("", "", "width=800,height=600");

    // Adding a basic header and print styles
    printWindow.document.write("<html><head><title>Print Report</title>");
    printWindow.document.write("<style>");
    printWindow.document.write(`
      body { font-family: Intern, Arial, sans-serif; }

/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
}

/* Modal Container */
.modal-container {
  background: #f4f5f9 !important;
  height: calc(100%-0px);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  text-align: center;
  display: flex;
  flex-direction: column;
  max-height: 1200px;
  width: 1000px;
} 

.modal-header h2 {
  font-weight: 300;
  margin-bottom: 20px;
  font-size: 20px;
  margin-left: 8px;
}
/* Modal Header */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 22px;
  font-weight: bold;
  color: #316efa;
}

/* Category Container */
/* Category Container (With Scroll) */
.category-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
  background: #fff;
  padding: 10px;
  border-radius: 12px;
  border: 1px solid #c8c8c8;
  margin-top: 0px !important;

  /* Fix Overflow */
  max-height: 480px; /* Adjust to your preference */
  overflow-y: auto;
  overflow-x: hidden; /* Prevent horizontal scrolling */
}

/* Each Category Box */
.category-box {
  background: #316efa;
  color: white;
  border-radius: 10px;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  gap: 15px;
  align-items: center;
  font-size: 38px !important;
  font-weight: 300 !important;
  height: 100px;
  cursor: pointer !important;
  text-align: left;
  margin-bottom: 10px;
}

/* Category Total */
.category-total {
  text-align: right;
}
        .divider-line {
        width: 2px;
        background-color: white;
        height: 80%;
        opacity: 0.5;
      }

/* Total Labels */
.total-label {
  font-weight: bold;
  font-size: 16px !important;
}

.total-value {
  font-size: 18px;
}

/* Final Total Container */
.total-container {
  display: flex;
  flex-direction: row;
  gap: 15px;
  margin-top: 20px;
  background: #fff;
  padding: 10px;
  border-radius: 12px;
  border: 1px solid #c8c8c8;
}

.btm-total-box {
  background: #316efa;
  color: white;
  border-radius: 8px;
  font-size: 20px !important;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  width: 100%;
}

.total-flex {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 25%;
  text-align: right;
}

.category-name {
  width: 50%;
  font-size: 24px;
}

  .category-box {
    page-break-inside: avoid;
  }

  .total-container-inside {
  display: flex;
  flex-direction: row;
  gap: 15px;
  background: #fff;
}

.btm-total-box-actual {
  background: #51c1cd;
  color: white;
  border-radius: 8px;
  font-size: 32px !important;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  width: 100%;
  height: 100px;
}

.btm-total-box-budget {
  background: #fca44a;
  color: white;
  border-radius: 8px;
  font-size: 32px !important;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  width: 100%;
  height: 100px;
}

.btm-total-box-budget span, .btm-total-box-actual span{
font-size: 24px!important;

}

    `);
    printWindow.document.write("</style></head><body>");

    // Adding the title at the top
    printWindow.document.write(`
      <div class="print-title" style="text-align: center;">
        <div class="budget-title"><h1 style="color: #316efa;">Budget Performance Report</h1></div>
        <div class="center-title"><h2>${selectedOU} - ${selectedRow.center} Expenses - ${category.name} - Sub-Accounts </h2></div>
      </div>
    `);

    printWindow.document.write(printContent.innerHTML);
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>
            {selectedRow.center} / Expenses / {category.name}
          </h2>
          <button className="close-button" onClick={handleClose}>
            <svg
              width="26"
              height="26"
              fill="none"
              stroke="#c8c8c8"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </button>
        </div>

        <div className="search-print-container">
          {/* Search Bar */}
          <div className="search-bar">
            <svg width="24" height="24" fill="#2a5ed4" viewBox="0 0 24 24">
              <path d="M10.5 16.5a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm6.32-1.094 3.58 3.58a.998.998 0 0 1-.318 1.645.999.999 0 0 1-1.098-.232l-3.58-3.58a8 8 0 1 1 1.415-1.413Z"></path>
            </svg>
            <input
              type="text"
              placeholder="Search Center..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            />
          </div>
          <div className="print">
            {/* Print Button */}
            <button className="print-button-center" onClick={handlePrint}>
              <svg
                width="26"
                height="26"
                fill="none"
                stroke="#ffffff"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path d="M18.5 16h-13v6h13v-6Z"></path>
                <path
                  d="M2 10h20v9h-3.491v-3H5.49v3H2v-9Z"
                  clipRule="evenodd"
                ></path>
                <path d="M19 2H5v8h14V2Z"></path>
              </svg>
              Print
            </button>
          </div>
        </div>

        <div className="category-container" id="printableContentSubAccount">
          {filteredSubAccounts.length > 0 ? (
            filteredSubAccounts.map((sub, index) => (
              <div
                className="category-box"
                key={index}
                style={{
                  background: index % 2 === 0 ? "#316df8" : "#013aa6",
                  color: "#ffffff",
                }}
                onClick={() => {
                  setSelectedSubAccount(sub.name);
                  setSubAccountModalOpen(true);
                }}
              >
                <span className="category-name">{sub.name}</span>
                <div className="total-flex">
                  <span className="total-label">Total Actual</span>
                  <span className="total-value">
                    {sub.actual.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="divider-line"></div>
                <div className="total-flex">
                  <span className="total-label">Total Budget</span>
                  <span className="total-value">
                    {sub.budget.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="no-results">No Sub-Accounts found</p>
          )}
          <div className="total-container-inside">
            <div className="btm-total-box-actual">
              <span className="total-label">Total Actual</span>
              <span className="total-value">
                {totalActual.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="btm-total-box-budget">
              <span className="total-label">Total Budget</span>
              <span className="total-value">
                {totalBudget.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="total-container">
          <div className="btm-total-box">
            <span className="total-label">Total Actual</span>
            <span className="total-value">
              {totalActual.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
          <div className="btm-total-box">
            <span className="total-label">Total Budget</span>
            <span className="total-value">
              {totalBudget.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>

        {subAccountModalOpen && (
          <ExpensesMonthlyTable
            open={subAccountModalOpen}
            handleClose={() => setSubAccountModalOpen(false)}
            selectedRow={selectedRow}
            selectedCategory={category.name}
            selectedSubAccount={selectedSubAccount}
            tableData={tableData}
            headers={headers}
            selectedOU={selectedOU}
          />
        )}
      </div>
    </div>
  );
};

export default ExpensesSubAccountModal;

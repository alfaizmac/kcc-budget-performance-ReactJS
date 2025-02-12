import React from "react";

function FilterSection({ ous = [], selectedOU, setSelectedOU }) {
  return (
    <div className="filter-section">
      <svg
        width="30"
        height="30"
        fill="#2a5ed4"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="m4.08 4 6.482 8.101a2 2 0 0 1 .438 1.25V20l2-1.5v-5.15a2 2 0 0 1 .438-1.249L19.92 4H4.08Zm0-2h15.84a2 2 0 0 1 1.56 3.25L15 13.35v5.15a2 2 0 0 1-.8 1.6l-2 1.5A1.999 1.999 0 0 1 9 20v-6.65l-6.481-8.1A2 2 0 0 1 4.079 2Z"></path>
      </svg>
      <label>Filter</label>
      <select
        name="OU"
        value={selectedOU}
        onChange={(e) => setSelectedOU(e.target.value)}
      >
        <option value="">Select OU</option>
        {ous.map((ou, index) => (
          <option key={index} value={ou}>
            {ou}
          </option>
        ))}
      </select>

      <select name="">
        <option value="">Select Revenue/Expenses</option>
      </select>
      <select name="">
        <option value="">Select Center </option>
      </select>
      <select name="">
        <option value="">Select Account</option>
      </select>
      <select name="">
        <option value="">Select Sub-Account</option>
      </select>
      <select name="">
        <option value="">Select Year</option>
      </select>
    </div>
  );
}

export default FilterSection;

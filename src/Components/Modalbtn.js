import React from "react";
import Modal from "./Modal"; // Ensure this file exists

function Modalbtn({ isModalOpen, setIsModalOpen }) {
  return (
    <div className="tooltip-container">
      <button className="open-modal-btn" onClick={() => setIsModalOpen(true)}>
        <svg
          width="100"
          height="100"
          fill="#2a5ed4"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M18 15v3H6v-3H4v3c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-3h-2ZM7 9l1.41 1.41L11 7.83V16h2V7.83l2.59 2.58L17 9l-5-5-5 5Z"></path>
        </svg>
      </button>
      <span className="tooltip-text">
        Upload your Excel file <br /> or input a link here
      </span>
      {/* Modal Component */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default Modalbtn;

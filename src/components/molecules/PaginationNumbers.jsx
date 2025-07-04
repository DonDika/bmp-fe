import React from "react";
import PaginationButton from "../atoms/PaginationButton";

const PaginationNumbers = ({ totalPages, currentPage, onPageChange }) => {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: totalPages }, (_, index) => (
        <PaginationButton
          key={index}
          onClick={() => onPageChange(index + 1)}
          active={currentPage === index + 1}
        >
          {index + 1}
        </PaginationButton>
      ))}
    </div>
  );
};

export default PaginationNumbers;

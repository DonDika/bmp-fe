import React from "react";
import PaginationButton from "../atoms/PaginationButton";
import PaginationNumbers from "../molecules/PaginationNumbers";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-center items-center gap-4">
      <PaginationButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Prev
      </PaginationButton>

      <PaginationNumbers
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={onPageChange}
      />

      <PaginationButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </PaginationButton>
    </div>
  );
};

export default Pagination;

import { useState } from "react";

export const usePagination = (items) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage,] = useState(4);

    // current items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const totalItems = items?.length;

    // change page
    const paginate = (pageNum) => setCurrentPage(pageNum);

    let pageNums = [];
    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
        pageNums.push(i);
    }

    let currentItems = null;
    currentItems = items?.slice(indexOfFirstItem, indexOfLastItem);

    return { paginate, currentItems, pageNums };
};
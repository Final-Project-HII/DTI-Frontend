"use client";
import React, { useState } from "react";
import OrderHeader from "./components/OrderHeader";
import OrderFilters from "./components/OrderFilters";
import OrderCards from "./components/OrderCards";
import OrderPagination from "./components/OrderPagination";


const OrderList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [totalItems, setTotalItems] = useState(0);

  return (
    <div className="space-y-4 mt-28 mx-28">
      <OrderHeader />
      <OrderFilters
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />
      <OrderCards
        currentPage={currentPage}
        pageSize={pageSize}
        globalFilter={globalFilter}
        statusFilter={statusFilter}
        setTotalItems={setTotalItems}
      />
      <OrderPagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
        totalItems={totalItems}
      />
    </div>
  );
};

export default OrderList;
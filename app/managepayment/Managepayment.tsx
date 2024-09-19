"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";

const AdminPaymentSimulation: React.FC = () => {
  const [orderId, setOrderId] = useState("");
  const [message, setMessage] = useState("");
  const { data: session } = useSession();

  const handleApprove = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/payments/${orderId}/approve-proof`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session?.user.accessToken}`,
          },
        }
      );
      const data = await response.json();
      setMessage(data);
    } catch (error) {
      setMessage("Failed to approve payment proof");
    }
  };

  const handleReject = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/payments/${orderId}/reject-proof`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session?.user.accessToken}`,
          },
        }
      );
      const data = await response.json();
      setMessage(data);
    } catch (error) {
      setMessage("Failed to reject payment proof");
    }
  };

  return (
    <div className="mt-32">
      <h1 className="text-4xl">Admin Payment Simulation</h1>
      <div className="flex flex-col gap-5">
        <input
          className="p-4"
          type="text"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="Enter order ID"
        />
        <div className="flex flex-row gap-5">
          <button
            className="bg-gray-600 text-white text-lg p-5"
            onClick={handleApprove}
          >
            Approve Payment
          </button>
          <button
            className="bg-gray-600 text-white text-lg p-5"
            onClick={handleReject}
          >
            Reject Payment
          </button>
        </div>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default AdminPaymentSimulation;

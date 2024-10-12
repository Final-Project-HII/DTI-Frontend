import React from "react";
import { Button } from "@/components/ui/button";

interface AdminOrderStatusUpdateProps {
  orderId: number;
  currentStatus: string;
  onStatusChange: (orderId: number, newStatus: string) => Promise<void>;
  onCancel: (orderId: number) => Promise<void>;
}

const AdminOrderStatusUpdate: React.FC<AdminOrderStatusUpdateProps> = ({
  orderId,
  currentStatus,
  onStatusChange,
  onCancel,
}) => {
  const statusSequence = [
    "pending_payment",
    "confirmation",
    "process",
    "shipped",
    "delivered"
  ];

  const currentStatusIndex = statusSequence.indexOf(currentStatus);
  const nextStatus = statusSequence[currentStatusIndex + 1];

  const handleNextStep = () => {
    if (nextStatus) {
      onStatusChange(orderId, nextStatus);
    }
  };

  const handleCancel = () => {
    onCancel(orderId);
  };

  const isBeforeShipped = currentStatusIndex < statusSequence.indexOf("shipped");

  return (
    <div className="flex space-x-2">
      {nextStatus && (
        <Button onClick={handleNextStep}>
          Next Step ({nextStatus})
        </Button>
      )}
      {isBeforeShipped && (
        <Button onClick={handleCancel} variant="destructive">
          Cancel Order
        </Button>
      )}
    </div>
  );
};

export default AdminOrderStatusUpdate;
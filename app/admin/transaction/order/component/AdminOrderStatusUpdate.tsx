import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AdminOrderStatusUpdateProps {
  orderId: number;
  currentStatus: string;
  onStatusChange: (orderId: number, newStatus: string) => Promise<void>;
}

const AdminOrderStatusUpdate: React.FC<AdminOrderStatusUpdateProps> = ({
  orderId,
  currentStatus,
  onStatusChange,
}) => {
  return (
    <Select
      value={currentStatus}
      onValueChange={(newStatus) => onStatusChange(orderId, newStatus)}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Change status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="pending_payment">Pending Payment</SelectItem>
        <SelectItem value="confirmation">Confirmation</SelectItem>
        <SelectItem value="process">Process</SelectItem>
        <SelectItem value="shipped">Shipped</SelectItem>
        <SelectItem value="delivered">Delivered</SelectItem>
        <SelectItem value="cancelled">Cancelled</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default AdminOrderStatusUpdate;

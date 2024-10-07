import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
        <SelectItem value="pending_payment">pending_payment</SelectItem>
        <SelectItem value="confirmation">confirmation</SelectItem>
        <SelectItem value="process">process</SelectItem>
        <SelectItem value="shipped">shipped</SelectItem>
        <SelectItem value="delivered">delivered</SelectItem>
        <SelectItem value="cancelled">cancelled</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default AdminOrderStatusUpdate;

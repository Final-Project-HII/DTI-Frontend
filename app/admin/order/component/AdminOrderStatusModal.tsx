import React from "react";
import { Order } from "@/types/order";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AdminOrderStatusUpdate from "./AdminOrderStatusUpdate";

interface OrderStatusModalProps {
  order: Order;
  onClose: () => void;
  onStatusUpdate: (orderId: number, newStatus: string) => Promise<void>;
  onCancel: (orderId: number) => Promise<void>;
}

const OrderStatusModal: React.FC<OrderStatusModalProps> = ({
  order,
  onClose,
  onStatusUpdate,
  onCancel,
}) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Order Status</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>Current Status: {order.status}</p>
          <AdminOrderStatusUpdate
            orderId={order.id}
            currentStatus={order.status}
            onStatusChange={onStatusUpdate}
            onCancel={onCancel}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderStatusModal;
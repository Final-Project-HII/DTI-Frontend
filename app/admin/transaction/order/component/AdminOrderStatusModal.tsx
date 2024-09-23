import React, { useState } from 'react';
import { Order } from '@/types/order';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface OrderStatusModalProps {
  order: Order;
  onClose: () => void;
  onStatusUpdate: (orderId: number, newStatus: string) => Promise<void>;
  onPaymentApproval: (orderId: number, isApproved: boolean) => Promise<void>;
}

const OrderStatusModal: React.FC<OrderStatusModalProps> = ({
  order,
  onClose,
  onStatusUpdate,
  onPaymentApproval,
}) => {
  const [newStatus, setNewStatus] = useState(order.status);

  const handleStatusUpdate = async () => {
    await onStatusUpdate(order.id, newStatus);
    onClose();
  };

  const handlePaymentApproval = async (isApproved: boolean) => {
    await onPaymentApproval(order.id, isApproved);
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Order Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-medium text-right">Order ID:</span>
            <span className="col-span-2">{order.id}</span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-medium text-right">Invoice ID:</span>
            <span className="col-span-2">{order.invoiceId || 'N/A'}</span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-medium text-right">Current Status:</span>
            <span className="col-span-2">{order.status}</span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-medium text-right">Total Amount:</span>
            <span className="col-span-2">{order.finalAmount}</span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <label htmlFor="status" className="font-medium text-right">
              Update Status:
            </label>
            <div className="col-span-2">
              <Select onValueChange={setNewStatus} value={newStatus}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select new status" />
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
            </div>
          </div>
        </div>
        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <div className="flex gap-2">
            <Button onClick={handleStatusUpdate}>
              Update Status
            </Button>
            {order.status === 'pending_payment' && (
              <>
                <Button onClick={() => handlePaymentApproval(true)} variant="default">
                  Approve Payment
                </Button>
                <Button onClick={() => handlePaymentApproval(false)} variant="destructive">
                  Reject Payment
                </Button>
              </>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderStatusModal;
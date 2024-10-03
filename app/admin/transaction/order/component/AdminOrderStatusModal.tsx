import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Order } from "@/types/order";
import { PaymentDetails } from "@/types/payment";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface OrderStatusModalProps {
  order: Order;
  onClose: () => void;
  onStatusUpdate: (orderId: number, newStatus: string) => Promise<void>;
  onPaymentApproval: (orderId: number, isApproved: boolean) => Promise<void>;
}

const AdminOrderStatusModal: React.FC<OrderStatusModalProps> = ({
  order,
  onClose,
  onStatusUpdate,
  onPaymentApproval,
}) => {
  const [newStatus, setNewStatus] = useState(order.status);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      if (!session) {
        setError("No session available");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get<PaymentDetails>(
          `${process.env.NEXT_PUBLIC_API_URL}api/payments/${order.id}/status`,
          {
            headers: { Authorization: `Bearer ${session.user.accessToken}` },
          }
        );
        console.log("API Response:", response.data);
        setPaymentDetails(response.data);
      } catch (err) {
        console.error("Error fetching payment details:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [order.id, session]);

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
          <DialogTitle className="text-2xl font-bold">
            Order Details
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-medium text-right">Order ID:</span>
            <span className="col-span-2">{order.id}</span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-medium text-right">Invoice ID:</span>
            <span className="col-span-2">{order.invoiceId || "N/A"}</span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-medium text-right">Current Status:</span>
            <span className="col-span-2">{order.status}</span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-medium text-right">Total Amount:</span>
            <span className="col-span-2">{order.finalAmount}</span>
          </div>
          {loading ? (
            <div>Loading payment details...</div>
          ) : error ? (
            <div className="text-red-500">Error: {error}</div>
          ) : paymentDetails ? (
            <>
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-medium text-right">Payment Method:</span>
                <span className="col-span-2">
                  {paymentDetails.paymentMethod}
                </span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-medium text-right">Payment Status:</span>
                <span className="col-span-2">{paymentDetails.status}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-medium text-right">Payment Amount:</span>
                <span className="col-span-2">{paymentDetails.amount}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-medium text-right">Payment Date:</span>
                <span className="col-span-2">
                  {new Date(paymentDetails.createdAt).toLocaleString()}
                </span>
              </div>
              {paymentDetails.paymentMethod === "PAYMENT_PROOF" &&
                paymentDetails.paymentProofUrl && (
                  <div className="grid grid-cols-3 items-center gap-4">
                    <span className="font-medium text-right">
                      Payment Proof:
                    </span>
                    <div className="col-span-2">
                      <img
                        src={paymentDetails.paymentProofUrl}
                        alt="Payment Proof"
                        className="max-w-full h-auto"
                      />
                    </div>
                  </div>
                )}
            </>
          ) : (
            <div>No payment details available</div>
          )}
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
                  <SelectItem value="pending_payment">
                    pending_payment
                  </SelectItem>
                  <SelectItem value="confirmation">confirmation</SelectItem>
                  <SelectItem value="process">process</SelectItem>
                  <SelectItem value="shipped">shipped</SelectItem>
                  <SelectItem value="delivered">delivered</SelectItem>
                  <SelectItem value="cancelled">cancelled</SelectItem>
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
            <Button onClick={handleStatusUpdate}>Update Status</Button>
            {paymentDetails &&
              paymentDetails.status === "PENDING" &&
              paymentDetails.paymentMethod === "PAYMENT_PROOF" && (
                <>
                  <Button
                    onClick={() => handlePaymentApproval(true)}
                    variant="default"
                  >
                    Approve Payment
                  </Button>
                  <Button
                    onClick={() => handlePaymentApproval(false)}
                    variant="destructive"
                  >
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

export default AdminOrderStatusModal;

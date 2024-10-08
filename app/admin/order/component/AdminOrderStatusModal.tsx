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
import { Button } from "@/components/ui/button";

interface OrderStatusModalProps {
  order: Order;
  onClose: () => void;
  onStatusUpdate: (orderId: number, newStatus: string) => Promise<void>;
  onPaymentApproval: (orderId: number, isApproved: boolean) => Promise<void>;
  onCancelOrder: (orderId: number) => Promise<void>;
}

const OrderStatusModal: React.FC<OrderStatusModalProps> = ({
  order,
  onClose,
  onStatusUpdate,
  onPaymentApproval,
  onCancelOrder,
}) => {
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  const statusSequence = [
    "pending_payment",
    "confirmation",
    "process",
    "shipped",
    "delivered",
  ];

  const currentStatusIndex = statusSequence.indexOf(order.status);
  const nextStatus = statusSequence[currentStatusIndex + 1];

  useEffect(() => {
    fetchPaymentDetails();
  }, [order.id, session]);

  const fetchPaymentDetails = async () => {
    if (!session) {
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
      setPaymentDetails(response.data);
    } catch (err) {
      console.error("Error fetching payment details:", err);
      setPaymentDetails(null);
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = async () => {
    if (nextStatus) {
      await onStatusUpdate(order.id, nextStatus);
      onClose();
    }
  };

  const handleCancel = async () => {
    await onCancelOrder(order.id);
    onClose();
  };

  const handlePaymentApproval = async (isApproved: boolean) => {
    await onPaymentApproval(order.id, isApproved);
    await fetchPaymentDetails();
  };

  const renderActionButtons = () => {
    if (loading) return null;

    if (!paymentDetails || !paymentDetails.paymentMethod) {
      return <p>Waiting for user payment method selection</p>;
    }

    if (paymentDetails.paymentMethod === "PAYMENT_PROOF") {
      if (paymentDetails.status === "PENDING") {
        return (
          <Button onClick={() => handlePaymentApproval(true)} variant="default">
            Approve Payment
          </Button>
        );
      }
    }

    // Show Next Step button for all cases when there's a next status
    if (nextStatus && order.status.toLowerCase() !== "cancelled" && order.status.toLowerCase() !== "delivered") {
      return <Button onClick={handleNextStep}>Next Step ({nextStatus})</Button>;
    }

    return null;
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
            <div>Waiting for user payment method selection</div>
          )}
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-medium text-right">Update Status:</span>
            <div className="col-span-2 flex space-x-2">
              {renderActionButtons()}
              {order.status !== "shipped" && order.status !== "delivered" && (
                <Button onClick={handleCancel} variant="destructive">
                  Cancel Order
                </Button>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderStatusModal;

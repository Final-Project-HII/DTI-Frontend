// components/checkout/DeliveryAddressCard.tsx
import React from "react";
import { Session } from "next-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DeliveryAddressCardProps {
  session: Session | null;
}

const DeliveryAddressCard: React.FC<DeliveryAddressCardProps> = ({ session }) => {
  return (
    <Card className="mb-4 shadow-lg border-2 border-blue-200 bg-blue-100 p-1">
      <CardHeader className="pb-2">
        <CardTitle className="text-blue-800">Kirim ke:</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Card className="shadow-sm bg-white">
          <CardContent className="p-2">
            <p className="font-bold">Rumah</p>
            <p>
              {session?.user?.name || "User"} (
              {session?.user?.email || "No email"})
            </p>
            <p>Istana Negara</p>
            <a href="#" className="text-blue-500">
              Lihat Lokasi
            </a>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default DeliveryAddressCard;
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { AlertCircle } from 'lucide-react';

interface RemarkButtonProps {
    remarks: string | null;
    status: string;
}

const RemarkButton: React.FC<RemarkButtonProps> = ({ remarks, status }) => {
    const [isOpen, setIsOpen] = useState(false);

    if (status !== 'CANCELLED' || !remarks) {
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <AlertCircle className="mr-2 h-4 w-4" />
                    View
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Cancellation Remark</DialogTitle>
                </DialogHeader>
                <div className="mt-2">
                    <p className="text-sm text-gray-500">{remarks}</p>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default RemarkButton;
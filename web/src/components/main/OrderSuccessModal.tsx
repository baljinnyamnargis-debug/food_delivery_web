"use client";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react"; 
interface OrderSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md text-center">
        <div className="flex flex-col items-center justify-center space-y-4 py-4">
          <div className="bg-green-100 p-3 rounded-full">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
          
          <DialogTitle className="text-xl font-bold">Order Successful!</DialogTitle>
          <p className="text-gray-500 text-sm">
            Your order has been placed successfully. You can track your order in the "Order" tab.
          </p>
        </div>
        
        <DialogFooter className="sm:justify-center">
          <Button 
            onClick={onClose} 
            className="w-full bg-red-500 hover:bg-red-600"
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderSuccessModal

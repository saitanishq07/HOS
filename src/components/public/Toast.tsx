import React from 'react';
import { useCart } from '../../context/CartContext';
import { CheckCircle2, ShoppingBag } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useCart();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
      <div className="bg-[#01173C] text-[#CDEBFF] border border-[#D4AF37]/60 shadow-2xl px-5 py-3.5 flex items-center gap-3 text-sm font-sans">
        <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0" />
        <span className="font-light tracking-wide">{toastMessage}</span>
        <ShoppingBag className="w-4 h-4 text-[#D4AF37] ml-2 shrink-0" />
      </div>
    </div>
  );
};

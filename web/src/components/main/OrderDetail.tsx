"use client";

import React, { useState, useContext, useEffect } from 'react'; // 1. useEffect импортлов
import { UserContext } from "@/context/UserContext";
import { MapPin, X, AlertTriangle, Calendar } from "lucide-react"; 
import axios from 'axios';

interface OrderDetailProps {
  isOpen: boolean;
  onClose: () => void;
  orders?: any[]; 
  cartItems: any[];
  onRequiredLogin: () => void;
  deliveryAddress: string; 
  onOpenAddressModal?: () => void; 
  onClearCart?: () => void;        
  onRemoveItem?: (id: string) => void; 
  onClearAddress?: () => void; 
}

export const OrderDetail: React.FC<OrderDetailProps> = ({ 
  isOpen, 
  onClose, 
  cartItems, 
  onRequiredLogin,
  deliveryAddress,
  onOpenAddressModal,
  onClearCart,
  onRemoveItem,
  onClearAddress
}) => {
  const context = useContext(UserContext);
  const [activeTab, setActiveTab] = useState<'cart' | 'order'>('cart');
  const [isSuccess, setIsSuccess] = useState(false); 
  const [showAddressAlert, setShowAddressAlert] = useState(false); 
  const [userOrders, setUserOrders] = useState<any[]>([]); // 2. Захиалгын түүх хадгалах State

  // 3. 📍 Захиалгын түүх татах функц
  const fetchOrderHistory = async () => {
    if (!context?.user?._id) return;

    try {
      const response = await axios.get(
        `http://localhost:3001/foodOrder/${context.user._id}`
      );
      if (response.data?.foodOrders) {
        setUserOrders(response.data.foodOrders);
      }
    } catch (error) {
      console.error("Error fetching order history:", error);
    }
  };

  // 4. 📍 Модал нээгдэх болон Order таб руу шилжихэд захиалгын түүхийг татна
  useEffect(() => {
    if (isOpen && context?.user?._id) {
      fetchOrderHistory();
    }
  }, [isOpen, activeTab, context?.user?._id]);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + (item.food?.price || 0) * item.quantity, 0);
  const shippingFee = subtotal > 0 ? 5000 : 0; 
  const total = subtotal > 0 ? subtotal + shippingFee : 0;

  const handleCheckout = async () => {
    if (!context?.user) {
      onRequiredLogin();
      return;
    }

    if (!deliveryAddress) {
      setShowAddressAlert(true);
      return;
    }

    try {
      const response = await axios.post("http://localhost:3001/foodOrder", {
        user: context.user._id,
        foodOrderItems: cartItems.map((item) => ({
          food: item.food._id,
          quantity: item.quantity,
        })),
        totalPrice: total,
        address: deliveryAddress,
        status: "Pending",
      });

      console.log("Захиалга амжилттай үүслээ:", response.data);

      if (onClearCart) onClearCart();
      if (onClearAddress) onClearAddress();

      // Захиалга амжилттай үүссэний дараа түүхээ шинэчилж татна
      fetchOrderHistory();
      setIsSuccess(true);
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  const handleBackToHome = () => {
    setIsSuccess(false);
    onClose(); 
  };

  const getStatusBadge = (status: string) => {
    const s = status?.toLowerCase();
    if (s === 'pending' || s === 'үүссэн' || s === 'хүлээгдэж буй' || s === 'cancelled' || s === 'цуцлагдсан') {
      return (
        <span className="bg-red-50 text-red-500 font-bold text-[10px] px-2 py-0.5 rounded-full border border-red-100 uppercase tracking-wider">
          {s === 'cancelled' || s === 'цуцлагдсан' ? 'Cancelled' : 'Pending'}
        </span>
      );
    }
    return <span className="bg-gray-100 text-gray-600 font-bold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">Delivered</span>;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end p-6">
      
      <div className="relative flex h-[85vh] w-full max-w-md flex-col rounded-[24px] bg-[#222222] p-5 text-white shadow-2xl border border-neutral-800">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 px-1">
          <h2 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 text-neutral-200">
            🛒 Order detail
          </h2>
          <button onClick={handleBackToHome} className="text-white/70 hover:text-white text-sm p-1 cursor-pointer">✕</button>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-2 gap-1 rounded-xl bg-[#181818] p-1 text-xs font-bold mb-4">
          <button onClick={() => setActiveTab('cart')} className={`rounded-lg py-2.5 cursor-pointer transition ${activeTab === 'cart' ? 'bg-[#ef4444] text-white shadow-md' : 'text-neutral-400'}`}>Cart</button>
          <button onClick={() => setActiveTab('order')} className={`rounded-lg py-2.5 cursor-pointer transition ${activeTab === 'order' ? 'bg-[#ef4444] text-white shadow-md' : 'text-neutral-400'}`}>Order</button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
          {activeTab === 'cart' ? (
            <>
              {/* My Cart */}
              <div className="bg-white rounded-[16px] p-4 text-black space-y-4 shadow-xs">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide">My cart</h3>
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <span className="text-4xl mb-2">🍽️</span>
                    <p className="text-sm font-bold text-gray-800">Your cart is empty</p>
                    <p className="text-[11px] text-gray-400 mt-1 max-w-[180px]">Add some delicious dishes to satisfy your cravings</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[30vh] overflow-y-auto pr-1">
                    {cartItems.map((item: any) => (
                      <div key={item._id} className="flex items-center gap-3 border-b border-gray-100 pb-3 last:border-0 last:pb-0 relative group">
                        <img src={item.food?.image || "/Image.png"} className="h-14 w-16 rounded-lg object-cover bg-gray-50 flex-shrink-0" />
                        <div className="flex-1 min-w-0 pr-6">
                          <h4 className="font-bold text-xs text-[#ef4444] truncate">{item.food?.foodName}</h4>
                          <p className="text-[10px] text-gray-400 line-clamp-1 mt-0.5">
                            {item.food?.description || "Fluffy pancakes stacked with fruits, cream, syrup."}
                          </p>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-[11px] text-gray-500 font-medium">Qty: {item.quantity}</span>
                            <span className="font-bold text-xs text-gray-900">{(item.food?.price * item.quantity).toLocaleString()}₮</span>
                          </div>
                        </div>

                        <button
                          onClick={() => onRemoveItem?.(item._id)}
                          className="absolute top-0 right-0 p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100 transition cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Delivery location */}
              <div className="bg-white rounded-[16px] p-4 text-black space-y-2 shadow-xs">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Delivery location</span>
                <div onClick={onOpenAddressModal} className="w-full min-h-[40px] flex items-center justify-between border border-gray-200 rounded-xl px-3 py-2 bg-gray-50/50 hover:bg-gray-50 hover:border-gray-300 transition cursor-pointer">
                  <p className="text-xs text-gray-700 font-medium line-clamp-1">
                    {cartItems.length > 0 && deliveryAddress ? deliveryAddress : "Please share your complete address"}
                  </p>
                </div>
              </div>

              {/* Payment info */}
              <div className="bg-white rounded-[16px] p-4 text-black space-y-3 shadow-sm border border-gray-100">
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Payment info</h3>
                <div className="space-y-2 text-xs text-gray-500 font-medium">
                  <div className="flex justify-between items-center">
                    <span>Items</span>
                    <span className="font-bold text-gray-900">{subtotal.toLocaleString()}₮</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Shipping</span>
                    <span className="font-bold text-gray-900">{shippingFee.toLocaleString()}₮</span>
                  </div>
                </div>
                <div className="border-t border-dashed border-gray-200 my-1" />
                <div className="flex justify-between items-center text-xs font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-sm font-bold text-gray-900">{total.toLocaleString()}₮</span>
                </div>
                <button onClick={handleCheckout} disabled={cartItems.length === 0} className="w-full bg-[#ef4444] disabled:bg-gray-300 text-white py-3 rounded-xl font-bold text-xs shadow-md hover:bg-red-600 active:scale-[0.99] transition mt-1 cursor-pointer tracking-wider uppercase">
                  Checkout
                </button>
              </div>
            </>
          ) : (
            /* Order history таб */
            <div className="bg-white rounded-[16px] p-4 text-black space-y-4 shadow-xs">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide">Order history</h3>
              
              {userOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center text-gray-400 text-xs">
                  <span>📋</span>
                  <p className="mt-1">Order History is empty</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
                  {userOrders.map((order: any, idx: number) => (
                    <div key={order._id || idx} className="border-b border-dashed border-gray-100 pb-4 last:border-0 last:pb-0">
                      
                      <div className="flex justify-between items-center font-bold text-xs text-gray-900 mb-2">
                        <span>{(order.totalPrice || 0).toLocaleString()}₮ <span className="text-gray-400 font-normal">(#{order._id?.slice(-4) || idx + 1000})</span></span>
                        {getStatusBadge(order.status)}
                      </div>

                      {/* 5. 📍 order.items-ийг order.foodOrderItems болгож засав */}
                      <div className="space-y-1 pl-1 mb-2">
                        {order.foodOrderItems?.map((item: any, i: number) => (
                          <div key={i} className="flex justify-between text-[11px] text-gray-500">
                            <span className="truncate max-w-[200px]">• {item.food?.foodName || "Хоол"}</span>
                            <span className="font-medium text-gray-700">x {item.quantity}</span>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-1 text-[10px] text-gray-400 font-medium">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <span>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Өнөөдөр'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                          <span className="line-clamp-1">{order.address || "Хаяг оруулаагүй"}</span>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Alert Modals */}
      {showAddressAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 animate-in fade-in duration-200">
          <div className="flex flex-col items-center justify-center bg-white text-black w-full max-w-[340px] rounded-[24px] p-6 text-center shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-amber-500" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-2">Missing Delivery Address</h3>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">Please provide your complete delivery address to proceed with the checkout.</p>
            <div className="flex gap-2 w-full">
              <button onClick={() => setShowAddressAlert(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2.5 rounded-full text-xs transition cursor-pointer">Close</button>
              <button onClick={() => { setShowAddressAlert(false); onOpenAddressModal?.(); }} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 rounded-full text-xs transition cursor-pointer shadow-md shadow-red-500/10">Add Address</button>
            </div>
          </div>
        </div>
      )}

      {isSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 animate-in fade-in duration-200">
          <div className="flex flex-col items-center justify-center bg-white text-black w-full max-w-[360px] rounded-[24px] p-8 text-center shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200">
            <h2 className="text-base font-bold text-gray-900 mb-6 leading-snug">Your order has been successfully placed !</h2>
            <div className="w-28 h-28 flex items-center justify-center bg-red-50 rounded-full mb-6 relative">
              <span className="text-5xl">🎈</span>
              <div className="absolute bg-[#ef4444] text-white p-2 rounded-full -top-1 shadow-md">🍽️</div>
            </div>
            <button onClick={handleBackToHome} className="w-full max-w-[180px] bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 px-6 rounded-full text-xs transition active:scale-95 cursor-pointer shadow-md shadow-red-500/20">Back to home</button>
          </div>
        </div>
      )}

    </div>
  );
};
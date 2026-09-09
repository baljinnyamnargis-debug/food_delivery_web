"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, ArrowUpDown, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import axios from "axios";

// MongoDB & API Schema
interface FoodItem {
  foodId?: {
    foodName?: string;
    image?: string;
    price?: number;
  };
  food?: {
    foodName?: string;
    image?: string;
    price?: number;
  };
  foodName?: string;
  foodImage?: string;
  quantity?: number;
  count?: number;
}

interface OrderItem {
  _id?: string;
  id?: string;
  orderNo?: number;
  user?: {
    email?: string;
    username?: string;
  };
  customer?: string;
  foodOrderItems?: FoodItem[];
  foodOrderItem?: FoodItem[]; // 👈 Бэкендийн Schema-тай тааруулж нэмэв
  foodName?: string;
  foodCount?: number;
  foodImage?: string;
  createdAt?: string;
  date?: string;
  totalPrice?: number;
  total?: number;
  address?: string;
  status: "pending" | "delivered" | "cancelled" | string;
}

// 📍 Figma дизайнтай адил Food багана дээр задардаг Pop-over компонент
const FoodCell = ({ items }: { items?: FoodItem[] }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!items || items.length === 0) {
    return <span className="text-xs text-gray-400">Хоол байхгүй</span>;
  }

  // Нийт захиалсан хоолны тоо
  const totalQty = items.reduce(
    (sum, item) => sum + (item.quantity || item.count || 1),
    0
  );

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-gray-200 bg-white hover:bg-gray-50 text-xs font-medium text-gray-700 transition cursor-pointer"
      >
        <span>{totalQty} foods</span>
        {isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-60 bg-white border border-gray-200 rounded-xl shadow-lg p-2.5 z-50 space-y-2 animate-in fade-in zoom-in-95 duration-100">
          {items.map((item, idx) => {
            const name =
              item.food?.foodName ||
              item.foodId?.foodName ||
              item.foodName ||
              "Food Item";
            const img =
              item.food?.image ||
              item.foodId?.image ||
              item.foodImage ||
              "/placeholder.png";
            const qty = item.quantity || item.count || 1;

            return (
              <div
                key={idx}
                className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-gray-50 transition"
              >
                <div className="w-8 h-8 relative rounded overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                  <Image
                    src={img}
                    alt={name}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="text-xs font-semibold text-gray-800 flex-1 truncate">
                  {name}
                </span>
                <span className="text-xs font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                  x{qty}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default function OrdersTable() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("Pending");
  const [loading, setLoading] = useState(false);

  const today = new Date();
  const pastDate = new Date();
  pastDate.setDate(today.getDate() - 30);

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const dateRangeText = `${formatDate(pastDate)} - ${formatDate(today)}`;

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://food-delivery-server-dun.vercel.app/foodOrder?t=${Date.now()}`);
      
      let fetchedData: OrderItem[] = [];
      if (Array.isArray(response.data)) {
        fetchedData = response.data;
      } else if (Array.isArray(response.data?.foodOrders)) {
        fetchedData = response.data.foodOrders;
      } else if (Array.isArray(response.data?.orders)) {
        fetchedData = response.data.orders;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        fetchedData = response.data.data;
      }

      setOrders(fetchedData);
    } catch (error) {
      console.error("Захиалгуудыг татахад алдаа гарлаа:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(() => {
      fetchOrders();
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchOrders]);

  const getOrderId = (order: OrderItem, index: number): string => {
    return order._id || order.id || `order-${index}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
      case "process":
        return "border-red-500 text-red-500 hover:bg-red-50";
      case "delivered":
      case "completed":
        return "border-green-500 text-green-500 hover:bg-green-50";
      case "cancelled":
        return "border-gray-500 text-gray-500 hover:bg-gray-50";
      default:
        return "border-gray-300 text-gray-600";
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(orders.map((o, idx) => getOrderId(o, idx)));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedOrders((prev) => [...prev, id]);
    } else {
      setSelectedOrders((prev) => prev.filter((item) => item !== id));
    }
  };

  const handleStatusChange = async (id: string, newStatus: OrderItem["status"]) => {
    setOrders((prev) =>
      prev.map((order, idx) =>
        getOrderId(order, idx) === id ? { ...order, status: newStatus } : order
      )
    );

    try {
      await axios.put(`https://food-delivery-server-dun.vercel.app/foodOrder/${id}`, { status: newStatus });
    } catch (err) {
      console.error("Төлөв шинэчлэхэд алдаа гарлаа:", err);
    }
  };

  const handleBulkStatusSave = () => {
    setOrders((prev) =>
      prev.map((order, idx) =>
        selectedOrders.includes(getOrderId(order, idx))
          ? { ...order, status: selectedStatus as OrderItem["status"] }
          : order
      )
    );
    setIsBulkModalOpen(false);
    setSelectedOrders([]);
  };

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Orders</h1>
          <p className="text-xs text-gray-500">{orders.length} items</p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchOrders}
            className="text-xs flex items-center gap-1"
          >
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
            Refresh
          </Button>

          <Button variant="outline" className="text-xs flex items-center gap-2">
            <Calendar size={14} />
            {dateRangeText}
          </Button>

          <Button
            disabled={selectedOrders.length === 0}
            onClick={() => setIsBulkModalOpen(true)}
            className="bg-black text-white hover:bg-gray-800 disabled:opacity-40 text-xs"
          >
            Change delivery state
          </Button>
        </div>
      </div>

      <div className="border rounded-md overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-[40px]">
                <Checkbox
                  checked={
                    selectedOrders.length === orders.length && orders.length > 0
                  }
                  onCheckedChange={(checked) => handleSelectAll(!!checked)}
                />
              </TableHead>
              <TableHead className="text-xs font-semibold">№</TableHead>
              <TableHead className="text-xs font-semibold">Customer</TableHead>
              <TableHead className="text-xs font-semibold">Food</TableHead>
              <TableHead className="text-xs font-semibold">
                <div className="flex items-center gap-1 cursor-pointer">
                  Date <ArrowUpDown size={12} />
                </div>
              </TableHead>
              <TableHead className="text-xs font-semibold">Total</TableHead>
              <TableHead className="text-xs font-semibold">Delivery Address</TableHead>
              <TableHead className="text-xs font-semibold">
                <div className="flex items-center gap-1 cursor-pointer">
                  Delivery state <ArrowUpDown size={12} />
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-xs text-gray-400">
                  Захиалга олдсонгүй
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order, index) => {
                const orderId = getOrderId(order, index);
                const displayTotal = order.totalPrice ?? order.total ?? 0;
                const displayDate =
                  order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString("en-GB")
                    : order.date || "-";

                const customerName =
                  order.customer ||
                  order.user?.email ||
                  order.user?.username ||
                  "Guest";

                return (
                  <TableRow key={orderId} className="hover:bg-gray-50/50">
                    <TableCell>
                      <Checkbox
                        checked={selectedOrders.includes(orderId)}
                        onCheckedChange={(checked) =>
                          handleSelectRow(orderId, !!checked)
                        }
                      />
                    </TableCell>
                    <TableCell className="text-xs">{order.orderNo ?? index + 1}</TableCell>
                    <TableCell className="text-xs text-gray-600">
                      {customerName}
                    </TableCell>

                    {/* 📍 Зассан Food багана (s-тэй болон s-гүй талбарын алийг нь ч дэмжинэ) */}
                    <TableCell className="text-xs">
                      <FoodCell items={order.foodOrderItem || order.foodOrderItems} />
                    </TableCell>

                    <TableCell className="text-xs text-gray-500 whitespace-nowrap">
                      {displayDate}
                    </TableCell>
                    <TableCell className="text-xs font-medium">
                      ₮{displayTotal.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-xs text-gray-500 max-w-[180px] truncate">
                      {order.address || "Хаяг байхгүй"}
                    </TableCell>

                    <TableCell>
                      <Select
                        value={order.status || "pending"}
                        onValueChange={(val: OrderItem["status"]) =>
                          handleStatusChange(orderId, val)
                        }
                      >
                        <SelectTrigger
                          className={`w-[110px] h-7 text-xs font-medium rounded-full border px-2 justify-between ${getStatusBadge(
                            order.status || "pending"
                          )}`}
                        >
                          <SelectValue placeholder="pending" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isBulkModalOpen} onOpenChange={setIsBulkModalOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-center text-sm font-semibold">
              Change delivery state
            </DialogTitle>
          </DialogHeader>

          <div className="flex justify-center gap-2 my-4">
            {(["delivered", "pending", "cancelled"] as const).map((status) => (
              <Badge
                key={status}
                variant="outline"
                onClick={() => setSelectedStatus(status)}
                className={`cursor-pointer px-3 py-1.5 rounded-full text-xs ${
                  selectedStatus === status
                    ? getStatusBadge(status) + " bg-opacity-10 font-bold"
                    : "border-gray-200 text-gray-400"
                }`}
              >
                {status}
              </Badge>
            ))}
          </div>

          <Button
            onClick={handleBulkStatusSave}
            className="w-full bg-black text-white hover:bg-gray-800 text-xs"
          >
            Save
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
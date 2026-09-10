"use client";

import { useEffect, useState, useContext } from "react";
import axios from "axios";
import Image from "next/image";
import FoodsSection from "@/components/admin/FoodsSection";
import { CategoryType, DishType } from "@/types/common";
import { Header } from "@/components/main/Header";
import OrderDetail from "@/components/main/OrderDetail";
import { LoginAlertModal } from "@/components/main/LoginAlertModal";
import { AddressModal } from "@/components/main/AddressModal"; 
import { UserContext } from "@/context/UserContext"; 
import { Footer } from "@/components/main/Footer";

export default function Home() {
  const context = useContext(UserContext);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [dishes, setDishes] = useState<DishType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingCategoryId, setLoadingCategoryId] = useState<string | null>(null);

  // 📍 Хүргэлтийн хаяг хадгалах state (Анх уншигдахдаа localStorage-оос шалгаж авна)
  const [deliveryAddress, setDeliveryAddress] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const savedAddress = localStorage.getItem("delivery_address");
      return savedAddress || "";
    }
    return "";
  });

  // 🛒 Сагсны стейтийг анх уншигдахдаа localStorage-оос шалгаж авна
  const [cartItems, setCartItems] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("guest_cart");
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });

  // Модалуудын төлөв
  const [isOrderModalOpen, setIsOrderModalOpen] = useState<boolean>(false);
  const [isLoginAlertOpen, setIsLoginAlertOpen] = useState<boolean>(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState<boolean>(false); 
  const [orders, setOrders] = useState<any[]>([]);

  // 💾 Сагсны дата өөрчлөгдөх бүрд localStorage руу хадгална
  useEffect(() => {
    localStorage.setItem("guest_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // 🔄 Хуудас ачаалагдах үед localStorage-оос датаг сэргээнэ
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("guest_cart");
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (parsedCart.length > 0 && cartItems.length === 0) {
          setCartItems(parsedCart);
        }
      }
    }
  }, []);

  // Сагсанд хоол нэмэх үндсэн функц
  const handleAddToCart = (dish: DishType, quantity: number) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.food._id === dish._id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.food._id === dish._id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      }
      return [...prevItems, { _id: `cart_${Date.now()}`, quantity, food: dish }];
    });
  };

  // Сагснаас нэг хоолыг устгах функц
  const handleRemoveFromCart = (cartItemId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== cartItemId));
  };

  // Сагсыг бүрэн хоослох функц 
  const handleClearCart = () => {
    setCartItems([]);
    localStorage.removeItem("guest_cart");
  };

  // Хаяг оруулах модалыг нээх
  const handleOpenAddressModal = () => {
    setIsOrderModalOpen(false); 
    setIsAddressModalOpen(true); 
  };

  // 📍 Хаяг амжилттай хадгалагдсаны дараа localStorage руу давхар бичиж хадгална
  const handleSaveAddress = (address: string) => {
    setDeliveryAddress(address);
    localStorage.setItem("delivery_address", address);
    setIsAddressModalOpen(false);
    setIsOrderModalOpen(true); 
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [categoryRes, foodRes] = await Promise.all([
        axios.get("https://food-delivery-server-dun.vercel.app/category"),
        axios.get("https://food-delivery-server-dun.vercel.app/food"),
      ]);
      
      const allCategories: CategoryType[] = categoryRes.data?.foodCategories || [];
      const cleanCategories = allCategories.filter(
        (c) => c.categoryName.toLowerCase().trim() !== "all dishes"
      );

      setCategories(cleanCategories);
      setDishes(foodRes.data?.food || []);
    } catch (error) {
      console.error("Дата татахад алдаа гарлаа:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserOrders = async () => {
    if (!context?.user?._id) return;
    try {
      const response = await axios.get(`https://food-delivery-server-dun.vercel.app/foodOrder/${context.user._id}`);
      setOrders(response.data?.foodOrders || []); 
    } catch (error) {
      console.error("Захиалгын түүх татахад алдаа гарлаа:", error);
    }
  };

  // 📍 Хэрэглэгч нэвтрэх эсвэл гарах (signout) үед ажиллах зассан логик
  useEffect(() => {
    if (context?.user) {
      fetchUserOrders();
    } else {
      setDeliveryAddress("");
      localStorage.removeItem("delivery_address");
      setOrders([]); 
    }
    
    fetchData(); 
  }, [context?.user]);

  return (
    <div className="min-h-screen bg-[#181818] flex flex-col justify-between">
      <div>
        <Header 
          onCartClick={() => setIsOrderModalOpen(true)} 
          cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} 
        />
        
        <div className="w-full h-[500px] relative">
          <Image
            src="/Image.png" 
            alt="Food Banner"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="w-full py-12 flex justify-center items-start">
          <div className="w-full max-w-7xl px-8 flex flex-col items-center">
            <FoodsSection
              categoriesToRender={categories}
              dishes={dishes}
              loading={loading}
              loadingCategoryId={loadingCategoryId}
              setLoadingCategoryId={setLoadingCategoryId}
              getDishes={fetchData}
              isAdmin={false}
              onAddDishToCart={handleAddToCart} 
            />
          </div>
        </div>
      </div>

      {/* 🔽 Хөл хэсэг (Footer) */}
      <Footer />

      {/* Сагсны цонх */}
      <OrderDetail
        isOpen={isOrderModalOpen} 
        onClose={() => setIsOrderModalOpen(false)} 
        orders={orders}      
        cartItems={cartItems} 
        deliveryAddress={deliveryAddress} 
        onOpenAddressModal={handleOpenAddressModal} 
        onClearCart={handleClearCart} 
        onRemoveItem={handleRemoveFromCart}
        onRequiredLogin={() => {
          setIsOrderModalOpen(false); 
          setIsLoginAlertOpen(true);  
        }}
      />

      {/* Хаяг оруулах модал цонх */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => {
          setIsAddressModalOpen(false);
          setIsOrderModalOpen(true); 
        }}
        onSave={handleSaveAddress}
        currentAddress={deliveryAddress}
      />

      {/* Нэвтрэхийг сануулах цонх */}
      <LoginAlertModal 
        isOpen={isLoginAlertOpen} 
        onClose={() => setIsLoginAlertOpen(false)} 
      />
    </div>
  );
}
"use client";

import { ReactNode, createContext, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

axios.defaults.baseURL = "http://localhost:3001";

type UserType = {
  email: string;
  password: string;
  _id: string;
  id?: string;
  token?: string;
};

type UserContextType = {
  user: UserType | undefined;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  handleEmail: (email: string) => void;
  logout: () => void;
};

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType>();
  const [email, setEmail] = useState<string>("");
  const router = useRouter();

  const setAxiosAuthToken = (token: string | undefined) => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await axios.post("/user/signin", { email, password });
      
      if (response.status === 200) {
        const userData = response.data.user;
        const token = response.data.token || userData?.token;

        if (token) setAxiosAuthToken(token);

        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        if (token) localStorage.setItem("token", token);

        toast.success("Successfully logged in!");
        router.push("/");
      }
    } catch (error: any) {
      console.error("Нэвтрэхэд алдаа гарлаа:", error);
      toast.error(error.response?.data?.message || "Failed to log in.");
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const response = await axios.post("/user/signup", { email, password });
      if (response.status === 200 || response.status === 201) {
        toast.success("Account created successfully! Please log in.");
        router.push("/signin"); 
      }
    } catch (error: any) {
      console.error("Бүртгүүлэхэд алдаа гарлаа:", error);
      toast.error(error.response?.data?.message || "Failed to create account.");
    }
  };

  const loadUser = () => {
    if (typeof window === "undefined") return;
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");

    if (!savedUser) return;
    try {
      setUser(JSON.parse(savedUser));
      if (savedToken) setAxiosAuthToken(savedToken);
    } catch (e) {
      console.error("LocalStorage уншихад алдаа гарлаа", e);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setAxiosAuthToken(undefined);
    setUser(undefined);
    toast.success("Successfully logged out!");
    router.push("/");
  };

  const handleEmail = (email: string) => setEmail(email);

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, signIn, signUp, handleEmail, logout }}>
      {children}
    </UserContext.Provider>
  );
};

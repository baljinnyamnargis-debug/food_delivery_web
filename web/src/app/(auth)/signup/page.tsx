"use client";

import { useState, useEffect, useContext } from "react";  
import Image from "next/image";  
import { ChevronLeft } from "lucide-react"; 
import { useRouter } from "next/navigation";
import { UserContext } from "@/context/UserContext";
import SignUpEmail from "@/components/main/SignUpEmail";
import SignUpPassword from "@/components/main/SignUpPassword"; 

export default function SignUpPage() {
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState(""); 
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const context = useContext(UserContext);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const handleEmailSubmit = (userEmail: string) => {
    setEmail(userEmail); 
    setStep(1);          
  };

  const handlePasswordSubmit = async (password: string) => {
    console.log("Бүртгүүлэх эцсийн өгөгдөл:", { email, password });
    await context?.signUp(email, password);
  };

  return (
    <div className="w-full min-h-screen flex">
      <div className="w-full md:w-1/2 min-h-screen flex flex-col justify-center items-center px-8 md:px-16 lg:px-24 relative bg-background">
        
        <button 
          onClick={step === 1 ? () => setStep(0) : () => router.push("/login")}
          className="absolute top-8 left-8 flex items-center text-sm text-muted-foreground hover:text-foreground transition"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
        </button>

        <div className="w-full max-w-sm space-y-6">
          <div className="space-y-2 text-center md:text-left">
            <h1 className="text-3xl font-bold tracking-tight">Create your account</h1>
            <p className="text-sm text-muted-foreground">
               Sign up to enjoy your favorite dishes.
            </p>
          </div>

          {step === 0 ? (
            <SignUpEmail handleStep={handleEmailSubmit} />
          ) : (
            <SignUpPassword onSubmit={handlePasswordSubmit} />
          )}

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <button 
              onClick={() => router.push("/login")}
              className="text-primary font-medium hover:underline bg-transparent border-none p-0 cursor-pointer"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>

      <div className="w-1/2 h-screen relative hidden md:block">
        <Image
          src="/Frame 1321316047.png"
          alt="Food Delivery"
          fill
          className="rounded-2xl object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>
    </div>
  );
};


 



























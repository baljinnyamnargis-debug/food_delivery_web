"use client";

import { useState, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { ChevronLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { UserContext } from "@/context/UserContext";

const loginSchema = z.object({
  email: z.string().email({ message: "Зөв мэйл хаяг оруулна уу." }),
  password: z
    .string()
    .min(6, { message: "Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой." }),
});

type LoginValues = z.infer<typeof loginSchema>;

const LogInPage = () => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const context = useContext(UserContext);

  const onSubmit = async (data: LoginValues) => {
    context?.signIn(data.email, data.password);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="w-full min-h-screen flex">
      <div className="w-full md:w-1/2 min-h-screen flex flex-col justify-center items-center px-8 md:px-16 lg:px-24 relative bg-background">
        <button className="absolute top-8 left-8 flex items-center text-sm text-muted-foreground hover:text-foreground transition">
          <ChevronLeft className="w-4 h-4 mr-1" />
        </button>

        <div className="w-full max-w-sm space-y-6">
          <div className="space-y-2 text-center md:text-left">
            <h1 className="text-3xl font-bold tracking-tight">Log in</h1>
            <p className="text-sm text-muted-foreground">
             Log in to enjoy your favorite dishes.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Enter your email address"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm font-medium text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <a href="#" className="text-xs text-primary hover:underline">
                  Forgot password ?
                </a>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm font-medium text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full mt-2 rounded-[6px] bg-[#18181B] text-white hover:bg-[#27272A]"
            >
             Let's Go
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
          Don’t have an account?{" "}
            <a href="#" className="text-primary font-medium hover:underline">
              Sign up 
            </a>
          </p>
        </div>
      </div>

      <div className="w-1/2 h-screen relative hidden md:block">
        <Image
          src="/Frame 1321316047.png"
          alt="Food Delivery"
          fill
          className="rounded-2xl object-cover (max-width: 768px) 100vw 50vw"
          priority
        />
      </div>
    </div>
  );
};

export default LogInPage;

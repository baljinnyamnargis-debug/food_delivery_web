"use client";

import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserContext } from "@/context/UserContext";

const passwordSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long." })
      .regex(/[0-9]/, { message: "Weak password. Use numbers and symbols." })
      .regex(/[a-zA-Z]/, {
        message: "Weak password. Use numbers and symbols.",
      }),
    confirmPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Those passwords didn't match. Try again.",
    path: ["confirmPassword"],
  });

type PasswordValue = z.infer<typeof passwordSchema>;

interface SignUpPasswordProps {
  onSubmit: (password: string) => void;
}

export default function SignUpPassword({ onSubmit }: SignUpPasswordProps) {
  const context = useContext(UserContext);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordValue>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const handleFormSubmit = (data: PasswordValue) => {
    onSubmit(data.password);
    context?.signUp(context?.user?.email || "", data.password);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium leading-none">Password</label>
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-sm font-medium text-destructive">
            {errors.password.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium leading-none">
          Confirm Password
        </label>
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="text-sm font-medium text-destructive">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <div className="flex items-center space-x-2 pt-1">
        <input
          type="checkbox"
          id="show-password"
          checked={showPassword}
          onChange={(e) => setShowPassword(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
        />
        <label
          htmlFor="show-password"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer select-none"
        >
          Show password
        </label>
      </div>

      <Button
        type="submit"
        className="w-full mt-2 rounded-[6px] bg-[#18181B] text-white hover:bg-[#27272A]"
      >
        Create Account
      </Button>
    </form>
  );
}

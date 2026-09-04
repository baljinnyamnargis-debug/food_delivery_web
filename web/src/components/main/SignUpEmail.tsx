import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserContext } from "@/context/UserContext";
import { useContext } from "react";

export const signUpSchema = z.object({
  email: z.string().email({ message: "Invalid email. Use a format like example@email.com" }),
});

type SignUpValues = z.infer<typeof signUpSchema>;


const SignUpEmail = ({ handleStep }: { handleStep: (email: string) => void }) => {
const context = useContext(UserContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: SignUpValues) => {
    console.log("Имэйл баталгаажлаа:", data);
    handleStep(data.email);
    context?.handleEmail(data.email); 
  };

  return (
    <div>
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

        <Button
          type="submit"
          className="w-full mt-2 rounded-[6px] bg-[#18181B] text-white hover:bg-[#27272A]"
        >
          Let's Go
        </Button>
      </form>
    </div>
  );
};

export default SignUpEmail;

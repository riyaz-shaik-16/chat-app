import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import GoogleLoginButton from "../components/GoogleLoginButton";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
// import { login } from "@/redux/thunks/auth.thunk";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const formSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/user/login",
        form.getValues()
      );
      if (data.success) {
        toast("OTP sent!");
        navigate(`/verify?email=${form.getValues("email")}`);
      }
    } catch (error) {
      toast(error.message || "Internal Server Error!");
      console.log("Error in login: ", error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md rounded-lg shadow-lg border p-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold mb-2">Welcome back</h1>
          <p className="text-sm">Sign in to your account</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="you@example.com"
                      className="mt-1 block w-full rounded-md shadow-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full py-2.5 px-4 text-sm font-medium rounded-md shadow-sm"
            >
              Send OTP
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Login;

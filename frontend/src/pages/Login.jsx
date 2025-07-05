import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import GoogleLoginButton from "../components/GoogleLoginButton";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { login } from "@/redux/thunks/auth.thunk";
import {
  selectAuthError,
  selectIsAuthenticated,
} from "@/redux/slices/auth.slice";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const formSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Invalid Password"),
});

const Login = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const authError = useSelector(selectAuthError);
  const navigate = useNavigate();
  const location = useLocation(); // 👈 get user's previous location

  const from = location.state?.from?.pathname || "/profile";

  console.log("User came from:", from);

  useEffect(() => {
    if (isAuthenticated) {
      toast.success("Logged in successfully!");
      navigate(from,{replace:true})
    }
  }, [isAuthenticated,from,navigate]);

  useEffect(() => {
    if (authError) {
      toast.error(authError);
    }
  }, [authError]);

  const dispatch = useDispatch();
  const onSubmit = (values) => {
    dispatch(login(values));
  };

  const handleOnClick = () => {
    window.location.href = "http://localhost:9000/api/auth/google";
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

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

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="********"
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
              Sign In
            </Button>
          </form>
        </Form>

        <div className="mt-6 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-background">Or</span>
          </div>
        </div>

        <div className="mt-6">
          <GoogleLoginButton
            className="w-full cursor-pointer"
            onClick={handleOnClick}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;

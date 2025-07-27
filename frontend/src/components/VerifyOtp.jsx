import axios from "axios";
import { ArrowRight, ChevronLeft, Loader2, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useAppData, user_service } from "../context/AppContext";
import Loading from "./Loading";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const VerifyOtp = () => {
  const {
    isAuth,
    setIsAuth,
    setUser,
    loading: userLoading,
    fetchChats,
    fetchUsers,
  } = useAppData();

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(60);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";

  useEffect(() => {
    if (isAuth) navigate("/chat");
  }, [isAuth, navigate]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const { data } = await axios.post(`${user_service}/api/v1/verify`, {
        email,
        otp,
      });

      toast.success(data.message);
      Cookies.set("token", data.token, { path: "/" });

      setOtp("");
      setUser(data.user);
      setIsAuth(true);
      fetchChats();
      fetchUsers();

      setTimeout(() => setIsAuth(true), 20000);
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    setError("");
    try {
      const { data } = await axios.post(`${user_service}/api/v1/login`, {
        email,
      });
      toast.success(data.message);
      setTimer(60);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  if (userLoading) return <Loading />;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background text-foreground">
      <div className="w-full max-w-md">
        <Card className="shadow-xl relative">
          <CardHeader className="text-center">
            <button
              className="absolute left-4 top-4 text-muted-foreground hover:text-foreground"
              onClick={() => navigate("/login")}
              type="button"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="mx-auto w-20 h-20 bg-primary rounded-lg flex items-center justify-center mb-4">
              <Lock size={40} className="text-white" />
            </div>
            <CardTitle className="text-3xl">Verify Your Email</CardTitle>
            <CardDescription className="mt-2">
              We have sent a 6-digit code to
              <span className="block text-primary font-medium">{email}</span>
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6  flex items-center flex-col">
              <div className="text-center space-y-3">
                <p className="text-sm text-muted-foreground">
                  Enter your 6-digit OTP here
                </p>
                <InputOTP
                  maxLength={6}
                  pattern={REGEXP_ONLY_DIGITS}
                  value={otp}
                  onChange={(value) => {
                    setOtp(value);
                    setError("");
                  }}
                >
                  <InputOTPGroup className="justify-center gap-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <InputOTPSlot key={i} index={i} className='h-12 w-12'/>
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>

              {error && (
                <div className="bg-destructive/10 border border-destructive rounded-lg p-3">
                  <p className="text-destructive text-sm text-center">{error}</p>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Verifying...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>Verify</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <p className="text-muted-foreground mb-2">
                Didn’t receive the code?
              </p>
              {timer > 0 ? (
                <p className="text-muted-foreground text-sm">
                  Resend code in {timer} seconds
                </p>
              ) : (
                <Button
                  variant="link"
                  size="sm"
                  onClick={handleResendOtp}
                  disabled={resendLoading}
                  className="text-sm text-primary"
                >
                  {resendLoading ? "Sending..." : "Resend Code"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerifyOtp;

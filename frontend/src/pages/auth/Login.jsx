import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "@/components/auth/AuthLayout";

function getLoginErrorMessage(error) {
  if (axios.isAxiosError(error)) {
    if (error.code === "ECONNABORTED") {
      return "Yeu cau dang nhap bi timeout. Hay thu lai sau vai giay.";
    }

    if (error.response) {
      const status = error.response.status;
      const serverMessage = error.response.data?.message;
      if (serverMessage) return `${serverMessage} (HTTP ${status})`;

      if (status === 400) return "Du lieu dang nhap khong hop le (HTTP 400).";
      if (status === 401) return "Sai email/username hoac password (HTTP 401).";
      if (status === 403)
        return "Tai khoan khong co quyen truy cap (HTTP 403).";
      if (status === 404)
        return "Khong tim thay API login. Kiem tra backend route (HTTP 404).";
      if (status >= 500)
        return "Backend dang loi noi bo. Kiem tra log server (HTTP 5xx).";

      return `Dang nhap that bai (HTTP ${status}).`;
    }

    if (error.code === "ERR_NETWORK") {
      return "Khong ket noi duoc backend. Kiem tra server dang chay, CORS va URL API.";
    }

    return error.message || "Co loi xay ra khi goi API dang nhap.";
  }

  return "Co loi khong xac dinh khi dang nhap.";
}

export default function Login({ setUserRole }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const normalizedIdentifier = identifier.trim();

    if (!normalizedIdentifier || !password.trim()) return;

    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/login",
        {
          identifier: normalizedIdentifier,
          password,
        },
        {
          withCredentials: true,
          timeout: 10000,
        },
      );

      if (res.data?.user?.role && typeof setUserRole === "function") {
        setUserRole(res.data.user.role);
      }

      setSuccessMessage(res.data?.message || "Đăng nhập thành công");
      setTimeout(() => navigate("/customer-dashboard"), 500);
    } catch (error) {
      setErrorMessage(getLoginErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <Card className="rounded-2xl border-0 shadow-md backdrop-blur-sm animate-in fade-in zoom-in-95 duration-500">
        <div className="h-1 bg-linear-to-r from-amber-400 via-amber-300 to-amber-500 rounded-t-2xl" />
        <CardContent className="p-5 sm:p-7 lg:p-8">
          {/* Brand */}
          <div className="flex items-center justify-center gap-2 mb-7">
            <div
              className="w-7 h-7 bg-zinc-900 rounded-md flex items-center justify-center
                            text-amber-400 font-serif text-sm font-medium"
            >
              M
            </div>
            <span className="font-serif text-zinc-900 tracking-wide">
              FabUric
            </span>
          </div>

          <h1 className="text-center text-xl sm:text-2xl font-serif font-normal text-zinc-900 mb-1">
            Welcome back
          </h1>
          <p className="text-center text-sm text-stone-400 mb-6">
            Sign in to your account to continue shopping
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {successMessage ? (
              <p className="text-sm text-green-600 text-center">
                {successMessage}
              </p>
            ) : null}
            {errorMessage ? (
              <p className="text-sm text-red-600 text-center">{errorMessage}</p>
            ) : null}

            <div className="space-y-1.5">
              <Label className="text-[11px] uppercase tracking-widest text-stone-500 font-semibold">
                Email or username
              </Label>
              <Input
                type="text"
                placeholder="your@email.com or your_username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="bg-stone-50 border-stone-200 rounded-xl h-11"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[11px] uppercase tracking-widest text-stone-500 font-semibold">
                Password
              </Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-stone-50 border-stone-200 rounded-xl h-11"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox id="remember" />
                <Label
                  htmlFor="remember"
                  className="text-sm font-normal text-stone-500 cursor-pointer"
                >
                  Remember me
                </Label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-amber-600 hover:text-amber-700 font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 rounded-xl"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>

            <div className="flex items-center gap-3">
              <Separator className="flex-1" />
              <span className="text-[11px] text-stone-300 tracking-widest">
                OR CONTINUE WITH
              </span>
              <Separator className="flex-1" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                variant="outline"
                type="button"
                className="rounded-xl h-11"
              >
                Google
              </Button>
              <Button
                variant="outline"
                type="button"
                className="rounded-xl h-11"
              >
                Facebook
              </Button>
            </div>
          </form>

          <p className="text-center text-sm text-stone-400 mt-5">
            No account?{" "}
            <Link
              to="/signup"
              className="text-amber-600 hover:text-amber-700 font-semibold"
            >
              Create one
            </Link>
          </p>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}

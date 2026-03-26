import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "@/components/auth/AuthLayout";

function getRegisterErrorMessage(error) {
  if (axios.isAxiosError(error)) {
    if (error.code === "ECONNABORTED") {
      return "Yeu cau dang ky bi timeout. Hay thu lai sau vai giay.";
    }

    if (error.response) {
      const status = error.response.status;
      const serverMessage = error.response.data?.message;
      if (serverMessage) return `${serverMessage} (HTTP ${status})`;

      if (status === 400) return "Du lieu dang ky khong hop le (HTTP 400).";
      if (status === 409) return "Tai khoan hoac email da ton tai (HTTP 409).";
      if (status === 404)
        return "Khong tim thay API register. Kiem tra backend route (HTTP 404).";
      if (status >= 500)
        return "Backend dang loi noi bo. Kiem tra log server (HTTP 5xx).";

      return `Dang ky that bai (HTTP ${status}).`;
    }

    if (error.code === "ERR_NETWORK") {
      return "Khong ket noi duoc backend. Kiem tra server dang chay, CORS va URL API.";
    }

    return error.message || "Co loi xay ra khi goi API dang ky.";
  }

  return "Co loi khong xac dinh khi dang ky.";
}

function PasswordStrength({ password }) {
  const getScore = (pw) => {
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
  };
  const score = getScore(password);
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = [
    "",
    "bg-red-400",
    "bg-amber-400",
    "bg-amber-400",
    "bg-green-400",
  ];

  return (
    <div className="mt-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all ${
              i <= score ? colors[score] : "bg-stone-200"
            }`}
          />
        ))}
      </div>
      {password && (
        <p className="text-xs mt-1 text-stone-400">{labels[score]}</p>
      )}
    </div>
  );
}

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const payload = {
      username: form.username.trim(),
      email: form.email.trim(),
      password: form.password,
      first_name: form.firstName.trim(),
      last_name: form.lastName.trim(),
    };

    if (!payload.username || !payload.email || !payload.password) {
      setErrorMessage("Vui lòng nhập username, email và password.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/register",
        payload,
        {
          withCredentials: true,
          timeout: 10000,
        },
      );
      setSuccessMessage(res.data?.message || "Đăng ký thành công!");
      setTimeout(() => navigate("/login"), 1000);
    } catch (error) {
      setErrorMessage(getRegisterErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <Card className="rounded-2xl border-0 shadow-sm">
        <div className="h-1 bg-linear-to-r from-amber-400 via-amber-300 to-amber-500 rounded-t-2xl" />
        <CardContent className="p-8">
          <div className="flex items-center justify-center gap-2 mb-5">
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

          <Badge
            variant="outline"
            className="mb-3 flex w-fit mx-auto text-amber-700 border-amber-200 bg-amber-50"
          >
            New account
          </Badge>
          <h1 className="text-center text-2xl font-serif font-normal text-zinc-900 mb-1">
            Create account
          </h1>
          <p className="text-center text-sm text-stone-400 mb-6">
            Join thousands of happy shoppers today
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
                Username
              </Label>
              <Input
                placeholder="your_username"
                value={form.username}
                onChange={update("username")}
                className="bg-stone-50 border-stone-200 rounded-xl h-11"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-[11px] uppercase tracking-widest text-stone-500 font-semibold">
                  First name
                </Label>
                <Input
                  placeholder="An"
                  value={form.firstName}
                  onChange={update("firstName")}
                  className="bg-stone-50 border-stone-200 rounded-xl h-11"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] uppercase tracking-widest text-stone-500 font-semibold">
                  Last name
                </Label>
                <Input
                  placeholder="Nguyễn"
                  value={form.lastName}
                  onChange={update("lastName")}
                  className="bg-stone-50 border-stone-200 rounded-xl h-11"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[11px] uppercase tracking-widest text-stone-500 font-semibold">
                Email
              </Label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={update("email")}
                className="bg-stone-50 border-stone-200 rounded-xl h-11"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[11px] uppercase tracking-widest text-stone-500 font-semibold">
                Password
              </Label>
              <Input
                type="password"
                placeholder="Min. 8 characters"
                value={form.password}
                onChange={update("password")}
                className="bg-stone-50 border-stone-200 rounded-xl h-11"
              />
              <PasswordStrength password={form.password} />
            </div>

            <div className="space-y-3 pt-1">
              <div className="flex items-start gap-2">
                <Checkbox id="terms" className="mt-0.5" />
                <Label
                  htmlFor="terms"
                  className="text-xs text-stone-500 font-normal leading-relaxed cursor-pointer"
                >
                  I agree to FabUric's{" "}
                  <Link to="/terms" className="text-amber-600">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-amber-600">
                    Privacy Policy
                  </Link>
                </Label>
              </div>
              <div className="flex items-start gap-2">
                <Checkbox id="marketing" className="mt-0.5" />
                <Label
                  htmlFor="marketing"
                  className="text-xs text-stone-500 font-normal leading-relaxed cursor-pointer"
                >
                  Send me deals, new arrivals, and style updates
                </Label>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 rounded-xl"
            >
              {isSubmitting ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <p className="text-center text-sm text-stone-400 mt-5">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-amber-600 hover:text-amber-700 font-semibold"
            >
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}

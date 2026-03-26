import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthLayout from "@/components/auth/AuthLayout";

function getSellerRegisterErrorMessage(error) {
  if (axios.isAxiosError(error)) {
    if (error.code === "ECONNABORTED") {
      return "Yeu cau dang ky seller bi timeout. Hay thu lai.";
    }

    if (error.response) {
      const status = error.response.status;
      const serverMessage = error.response.data?.message;

      if (serverMessage) return `${serverMessage} (HTTP ${status})`;
      if (status === 400)
        return "Du lieu dang ky seller khong hop le (HTTP 400).";
      if (status === 401)
        return "Ban can dang nhap truoc khi dang ky seller (HTTP 401).";
      if (status === 403) return "Khong du quyen dang ky seller (HTTP 403).";
      if (status === 404)
        return "Khong tim thay API seller register (HTTP 404).";
      if (status >= 500)
        return "Backend loi noi bo. Kiem tra log server (HTTP 5xx).";

      return `Dang ky seller that bai (HTTP ${status}).`;
    }

    if (error.code === "ERR_NETWORK") {
      return "Khong ket noi duoc backend. Kiem tra server/CORS/API URL.";
    }

    return error.message || "Co loi khi goi API dang ky seller.";
  }

  return "Co loi khong xac dinh khi dang ky seller.";
}

function RegisterSeller({ setUserRole }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    shop_name: "",
    shop_description: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    const payload = {
      shop_name: form.shop_name.trim(),
      shop_description: form.shop_description.trim(),
    };

    if (!payload.shop_name) {
      setErrorMessage("Vui long nhap ten cua hang.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await axios.post(
        "http://localhost:3000/api/seller/register",
        payload,
        {
          withCredentials: true,
          timeout: 10000,
        },
      );

      setSuccessMessage(res.data?.message || "Dang ky seller thanh cong!");

      if (typeof setUserRole === "function") {
        setUserRole("seller");
      }

      setTimeout(() => navigate("/seller-dashboard"), 900);
    } catch (error) {
      setErrorMessage(getSellerRegisterErrorMessage(error));
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
            <div className="w-7 h-7 bg-zinc-900 rounded-md flex items-center justify-center text-amber-400 font-serif text-sm font-medium">
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
            Seller onboarding
          </Badge>

          <h1 className="text-center text-2xl font-serif font-normal text-zinc-900 mb-1">
            Register your shop
          </h1>
          <p className="text-center text-sm text-stone-400 mb-6">
            Create your seller profile and start listing products today
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
                Shop name
              </Label>
              <Input
                placeholder="Maison by Duy"
                value={form.shop_name}
                onChange={update("shop_name")}
                className="bg-stone-50 border-stone-200 rounded-xl h-11"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[11px] uppercase tracking-widest text-stone-500 font-semibold">
                Shop description
              </Label>
              <textarea
                placeholder="Tell customers about your style, products and value..."
                value={form.shop_description}
                onChange={update("shop_description")}
                className="w-full min-h-28 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-zinc-900 outline-none ring-offset-background placeholder:text-stone-400 focus-visible:ring-2 focus-visible:ring-zinc-400"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 rounded-xl"
            >
              {isSubmitting ? "Submitting..." : "Register seller"}
            </Button>
          </form>

          <p className="text-center text-sm text-stone-400 mt-5">
            Want to continue shopping?{" "}
            <Link
              to="/customer-dashboard"
              className="text-amber-600 hover:text-amber-700 font-semibold"
            >
              Back to customer dashboard
            </Link>
          </p>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}

export default RegisterSeller;

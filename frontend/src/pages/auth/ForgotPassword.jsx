import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "@/components/auth/AuthLayout";

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1 = email, 2 = OTP
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const handleOtpChange = (val, idx) => {
    const next = [...otp];
    next[idx] = val.slice(-1);
    setOtp(next);
    if (val && idx < 5) inputRefs.current[idx + 1]?.focus();
  };

  const handleOtpKey = (e, idx) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0)
      inputRefs.current[idx - 1]?.focus();
  };

  return (
    <AuthLayout>
      <Card className="rounded-2xl border-0 shadow-sm">
        <div className="h-1 bg-linear-to-r from-amber-400 via-amber-300 to-amber-500 rounded-t-2xl" />
        <CardContent className="p-8">
          <div className="flex items-center justify-center gap-2 mb-7">
            <div
              className="w-7 h-7 bg-zinc-900 rounded-md flex items-center justify-center
                            text-amber-400 font-serif text-sm font-medium"
            >
              F
            </div>
            <span className="font-serif text-zinc-900 tracking-wide">
              FabUric
            </span>
          </div>

          {step === 1 ? (
            <>
              <h1 className="text-center text-2xl font-serif font-normal text-zinc-900 mb-1">
                Forgot password?
              </h1>
              <p className="text-center text-sm text-stone-400 mb-6">
                Enter your email and we'll send you a verification code
              </p>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-[11px] uppercase tracking-widest text-stone-500 font-semibold">
                    Email address
                  </Label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-stone-50 border-stone-200 rounded-xl h-11"
                  />
                </div>

                <Button
                  className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 rounded-xl"
                  onClick={() => setStep(2)}
                >
                  Send reset code
                </Button>

                <Button variant="ghost" className="w-full rounded-xl" asChild>
                  <Link to="/login">← Back to login</Link>
                </Button>
              </div>
            </>
          ) : (
            <>
              <div
                className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center
                              text-2xl mx-auto mb-5"
              >
                📬
              </div>
              <h1 className="text-2xl font-serif font-normal text-zinc-900 mb-1 text-center">
                Check your inbox
              </h1>
              <p className="text-sm text-stone-400 mb-6 text-center">
                We sent a 6-digit code to{" "}
                <strong className="text-zinc-700">{email}</strong>
              </p>

              <div className="flex gap-2 justify-center mb-6">
                {otp.map((val, i) => (
                  <input
                    key={i}
                    ref={(el) => (inputRefs.current[i] = el)}
                    value={val}
                    onChange={(e) => handleOtpChange(e.target.value, i)}
                    onKeyDown={(e) => handleOtpKey(e, i)}
                    maxLength={1}
                    className={`w-11 h-13 text-center text-lg font-bold rounded-xl border-[1.5px]
                      bg-stone-50 outline-none transition-all
                      ${val ? "border-green-400 bg-green-50" : "border-stone-200"}
                      focus:border-amber-400 focus:ring-2 focus:ring-amber-100`}
                  />
                ))}
              </div>

              <Button
                className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 rounded-xl mb-3"
                onClick={() => navigate("/reset-password")}
              >
                Verify code
              </Button>
              <Button variant="ghost" className="w-full rounded-xl">
                Resend code
              </Button>

              <p className="text-center text-sm text-stone-400 mt-4">
                <button
                  className="text-amber-600 font-semibold"
                  onClick={() => setStep(1)}
                >
                  ← Use a different email
                </button>
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </AuthLayout>
  );
}

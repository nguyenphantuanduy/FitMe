import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "@/components/auth/AuthLayout";

export default function ResetPassword() {
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

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

          {!done ? (
            <>
              {/* Progress steps */}
              <div className="flex gap-1.5 justify-center mb-7">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`h-1 w-7 rounded-full ${
                      i < 3 ? "bg-green-400" : "bg-amber-400"
                    }`}
                  />
                ))}
              </div>

              <h1 className="text-center text-2xl font-serif font-normal text-zinc-900 mb-1">
                New password
              </h1>
              <p className="text-center text-sm text-stone-400 mb-6">
                Must be different from your previous password
              </p>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-[11px] uppercase tracking-widest text-stone-500 font-semibold">
                    New password
                  </Label>
                  <Input
                    type="password"
                    placeholder="Min. 8 characters"
                    className="bg-stone-50 border-stone-200 rounded-xl h-11"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[11px] uppercase tracking-widest text-stone-500 font-semibold">
                    Confirm password
                  </Label>
                  <Input
                    type="password"
                    placeholder="Repeat your password"
                    className="bg-stone-50 border-stone-200 rounded-xl h-11"
                  />
                </div>

                <Button
                  className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 rounded-xl"
                  onClick={() => setDone(true)}
                >
                  Update password
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <div
                className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center
                              text-2xl mx-auto mb-5"
              >
                ✅
              </div>
              <h1 className="text-2xl font-serif font-normal text-zinc-900 mb-2">
                Password updated!
              </h1>
              <p className="text-sm text-stone-400 mb-7">
                You can now sign in with your new password
              </p>
              <Button
                className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 rounded-xl"
                onClick={() => navigate("/login")}
              >
                Go to login
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </AuthLayout>
  );
}

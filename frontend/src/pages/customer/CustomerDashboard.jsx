import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function CustomerDashboard({ userRole }) {
  const navigate = useNavigate();

  const categories = [
    {
      name: "Outerwear",
      count: "24 styles",
      tone: "from-zinc-900 to-zinc-700",
    },
    {
      name: "Dresses",
      count: "31 styles",
      tone: "from-amber-500 to-orange-400",
    },
    {
      name: "Essentials",
      count: "42 styles",
      tone: "from-stone-700 to-stone-500",
    },
  ];

  const products = [
    {
      name: "Tailored Wool Blazer",
      price: "$128",
      badge: "New",
      color: "bg-zinc-800",
    },
    {
      name: "Pleated Midi Dress",
      price: "$94",
      badge: "Hot",
      color: "bg-amber-500",
    },
    {
      name: "Premium Cotton Shirt",
      price: "$56",
      badge: "Best Seller",
      color: "bg-stone-700",
    },
    {
      name: "Wide Leg Trousers",
      price: "$72",
      badge: "Limited",
      color: "bg-neutral-700",
    },
  ];

  const handleGoSeller = () => {
    if (userRole === "seller") {
      navigate("/seller-dashboard");
    } else {
      navigate("/register-seller");
    }
  };

  // ⭐ NEW
  const handleVirtualTryOn = () => {
    navigate("/virtual-tryon");
  };

  return (
    <div className="min-h-screen bg-stone-100 text-zinc-900">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-10">
        <header className="mb-6 rounded-3xl bg-zinc-900 px-5 py-4 text-stone-100 shadow-lg sm:px-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-amber-300">
                FabUric Wardrobe
              </p>
              <h1 className="font-serif text-2xl sm:text-3xl">
                Your Fashion Storefront
              </h1>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="secondary"
                className="rounded-xl bg-stone-100 text-zinc-900 hover:bg-stone-200"
                onClick={handleVirtualTryOn}
              >
                Virtual Try-on
              </Button>
              <Button
                className="rounded-xl bg-amber-500 text-zinc-900 hover:bg-amber-400"
                onClick={handleGoSeller}
              >
                {userRole === "seller" ? "Seller Dashboard" : "Become a Seller"}
              </Button>
            </div>
          </div>
        </header>

        <section className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <Card className="overflow-hidden rounded-3xl border-0 bg-linear-to-br from-stone-200 via-stone-100 to-amber-50">
            <CardContent className="relative p-6 sm:p-8">
              <p className="mb-3 text-xs uppercase tracking-[0.24em] text-stone-500">
                Spring Summer 2026
              </p>
              <h2 className="max-w-lg font-serif text-3xl leading-tight sm:text-4xl">
                Minimal tailoring meets modern street couture.
              </h2>
              <p className="mt-4 max-w-xl text-stone-600">
                Discover curated drops, premium essentials, and statement
                silhouettes picked for your fit profile.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button className="rounded-xl bg-zinc-900 hover:bg-zinc-800">
                  Shop New Arrivals
                </Button>
                <Button
                  variant="outline"
                  className="rounded-xl border-zinc-300 bg-white/60"
                >
                  Explore Collection
                </Button>
              </div>
              <div className="pointer-events-none absolute -right-10 -bottom-12 h-44 w-44 rounded-full bg-amber-300/50 blur-2xl" />
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-0 bg-zinc-900 text-stone-100">
            <CardContent className="p-6 sm:p-7">
              <p className="text-xs uppercase tracking-[0.24em] text-amber-300">
                Style Tip
              </p>
              <h3 className="mt-2 font-serif text-2xl">
                Build a Capsule Closet
              </h3>
              <p className="mt-3 text-sm text-stone-300">
                Pair structured outerwear with neutral basics. Use Virtual
                Try-on to preview silhouettes before checkout.
              </p>
              <div className="mt-5 rounded-2xl bg-white/10 p-4 text-sm">
                Recommended today:
                <p className="mt-1 font-medium text-amber-200">
                  Oversized blazer + relaxed trousers
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mt-7">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-serif text-2xl">Shop by Category</h3>
            <button className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
              View all
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Card
                key={category.name}
                className="overflow-hidden rounded-2xl border-0"
              >
                <CardContent
                  className={`bg-linear-to-br ${category.tone} p-6 text-white`}
                >
                  <p className="text-sm text-white/80">{category.count}</p>
                  <h4 className="mt-1 font-serif text-2xl">{category.name}</h4>
                  <button className="mt-5 text-sm underline underline-offset-4">
                    Browse
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-7">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-serif text-2xl">Trending Products</h3>
            <button className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
              See more
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {products.map((product) => (
              <Card
                key={product.name}
                className="overflow-hidden rounded-2xl border-0 bg-white shadow-sm"
              >
                <CardContent className="p-0">
                  <div className={`relative h-48 ${product.color}`}>
                    <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-zinc-900">
                      {product.badge}
                    </span>
                  </div>
                  <div className="p-4">
                    <h4 className="font-medium text-zinc-900">
                      {product.name}
                    </h4>
                    <p className="mt-1 text-lg font-semibold text-zinc-900">
                      {product.price}
                    </p>
                    <Button className="mt-4 w-full rounded-xl bg-zinc-900 hover:bg-zinc-800">
                      Add to bag
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default CustomerDashboard;

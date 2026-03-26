import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function SellerDashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [sellerInfo, setSellerInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("analytics");
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [uploadForm, setUploadForm] = useState({
    name: "",
    description: "",
    cost: "",
    type: "tops",
  });
  const [frontFile, setFrontFile] = useState(null);
  const [backFile, setBackFile] = useState(null);
  const [frontPreview, setFrontPreview] = useState(null);
  const [backPreview, setBackPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const productCount = products.length;
  const estimatedRevenue = useMemo(
    () =>
      products.reduce((sum, p) => {
        const cost = Number(p.cost) || 0;
        return sum + cost;
      }, 0),
    [products],
  );

  const typeBreakdown = useMemo(() => {
    return products.reduce(
      (acc, p) => {
        acc[p.type] = (acc[p.type] || 0) + 1;
        return acc;
      },
      { tops: 0, bottoms: 0, "one-pieces": 0 },
    );
  }, [products]);

  const fetchSellerData = async () => {
    try {
      setErrorMessage("");
      const [productsRes, sellerRes] = await Promise.all([
        axios.get("http://localhost:3000/api/seller/products", {
          withCredentials: true,
        }),
        axios.get("http://localhost:3000/api/seller/me", {
          withCredentials: true,
        }),
      ]);

      setProducts(productsRes.data.products || []);
      setSellerInfo(sellerRes.data.seller || null);
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu seller:", err);
      setErrorMessage("Khong the tai du lieu seller. Hay thu lai.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerData();
  }, []);

  const updateUploadField = (key) => (e) => {
    setUploadForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleFileChange = (setterFile, setterPreview) => (e) => {
    const file = e.target.files?.[0] || null;
    setterFile(file);
    if (file) {
      setterPreview(URL.createObjectURL(file));
    } else {
      setterPreview(null);
    }
  };

  const resetUploadForm = () => {
    setUploadForm({
      name: "",
      description: "",
      cost: "",
      type: "tops",
    });
    setFrontFile(null);
    setBackFile(null);
    setFrontPreview(null);
    setBackPreview(null);
  };

  const handleUploadProduct = async (e) => {
    e.preventDefault();
    setStatusMessage("");
    setErrorMessage("");

    if (
      !uploadForm.name.trim() ||
      !uploadForm.cost ||
      !uploadForm.type ||
      !frontFile ||
      !backFile
    ) {
      setErrorMessage(
        "Vui long dien day du thong tin va chon 2 anh front/back.",
      );
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("name", uploadForm.name.trim());
      formData.append("description", uploadForm.description.trim());
      formData.append("cost", uploadForm.cost);
      formData.append("type", uploadForm.type);
      formData.append("front", frontFile);
      formData.append("back", backFile);

      const res = await axios.post(
        "http://localhost:3000/api/seller/products",
        formData,
        { withCredentials: true, timeout: 20000 },
      );

      const uploadedProduct = res.data?.product;
      if (uploadedProduct) {
        setProducts((prev) => [uploadedProduct, ...prev]);
      } else {
        await fetchSellerData();
      }

      setStatusMessage(res.data?.message || "Upload san pham thanh cong.");
      resetUploadForm();
      setActiveTab("shop");
    } catch (err) {
      const msg =
        err.response?.data?.message || "Upload that bai. Vui long thu lai.";
      setErrorMessage(msg);
    } finally {
      setUploading(false);
    }
  };

  const renderTabButton = (tabKey, label) => (
    <Button
      type="button"
      variant={activeTab === tabKey ? "default" : "outline"}
      className={
        activeTab === tabKey
          ? "rounded-xl bg-zinc-900 hover:bg-zinc-800"
          : "rounded-xl"
      }
      onClick={() => setActiveTab(tabKey)}
    >
      {label}
    </Button>
  );

  return (
    <div className="min-h-screen bg-stone-100 px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-7xl">
        <Card className="mb-6 overflow-hidden rounded-3xl border-0 bg-zinc-900 text-stone-100 shadow-xl">
          <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-amber-300">
                FabUric Seller Center
              </p>
              <h1 className="font-serif text-2xl sm:text-3xl">
                Seller Dashboard
              </h1>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="secondary"
                className="rounded-xl bg-stone-100 text-zinc-900 hover:bg-stone-200"
                onClick={() => navigate("/customer-dashboard")}
              >
                Customer Dashboard
              </Button>
              <Button
                className="rounded-xl bg-amber-500 text-zinc-900 hover:bg-amber-400"
                onClick={() => setActiveTab("upload")}
              >
                Dang san pham
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mb-4 flex flex-wrap gap-2">
          {renderTabButton("analytics", "Thong ke doanh so")}
          {renderTabButton("upload", "Dang san pham")}
          {renderTabButton("shop", "Shop hien tai")}
        </div>

        {statusMessage ? (
          <Card className="mb-4 rounded-2xl border border-green-200 bg-green-50 text-green-700">
            <CardContent className="p-3 text-sm font-medium">
              {statusMessage}
            </CardContent>
          </Card>
        ) : null}

        {errorMessage ? (
          <Card className="mb-4 rounded-2xl border border-red-200 bg-red-50 text-red-700">
            <CardContent className="p-3 text-sm font-medium">
              {errorMessage}
            </CardContent>
          </Card>
        ) : null}

        {loading ? (
          <Card className="rounded-2xl border-zinc-200">
            <CardContent className="p-6 text-zinc-600">
              Dang tai du lieu seller...
            </CardContent>
          </Card>
        ) : null}

        {!loading && activeTab === "analytics" ? (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="rounded-2xl border-zinc-200">
                <CardContent className="p-5">
                  <p className="text-xs uppercase tracking-wider text-zinc-500">
                    Tong san pham
                  </p>
                  <p className="mt-2 font-serif text-3xl text-zinc-900">
                    {productCount}
                  </p>
                </CardContent>
              </Card>
              <Card className="rounded-2xl border-zinc-200">
                <CardContent className="p-5">
                  <p className="text-xs uppercase tracking-wider text-zinc-500">
                    Tong gia tri niem yet
                  </p>
                  <p className="mt-2 font-serif text-2xl text-zinc-900">
                    {estimatedRevenue.toLocaleString()} VND
                  </p>
                </CardContent>
              </Card>
              <Card className="rounded-2xl border-zinc-200">
                <CardContent className="p-5">
                  <p className="text-xs uppercase tracking-wider text-zinc-500">
                    Tops
                  </p>
                  <p className="mt-2 font-serif text-3xl text-zinc-900">
                    {typeBreakdown.tops || 0}
                  </p>
                </CardContent>
              </Card>
              <Card className="rounded-2xl border-zinc-200">
                <CardContent className="p-5">
                  <p className="text-xs uppercase tracking-wider text-zinc-500">
                    Bottoms + One-piece
                  </p>
                  <p className="mt-2 font-serif text-3xl text-zinc-900">
                    {(typeBreakdown.bottoms || 0) +
                      (typeBreakdown["one-pieces"] || 0)}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="rounded-2xl border-zinc-200">
              <CardContent className="p-5">
                <h2 className="font-serif text-2xl text-zinc-900">
                  Phan bo theo danh muc
                </h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl bg-stone-100 p-4">
                    <p className="text-sm text-zinc-500">Tops</p>
                    <p className="text-xl font-semibold text-zinc-900">
                      {typeBreakdown.tops || 0}
                    </p>
                  </div>
                  <div className="rounded-xl bg-stone-100 p-4">
                    <p className="text-sm text-zinc-500">Bottoms</p>
                    <p className="text-xl font-semibold text-zinc-900">
                      {typeBreakdown.bottoms || 0}
                    </p>
                  </div>
                  <div className="rounded-xl bg-stone-100 p-4">
                    <p className="text-sm text-zinc-500">One-pieces</p>
                    <p className="text-xl font-semibold text-zinc-900">
                      {typeBreakdown["one-pieces"] || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}

        {!loading && activeTab === "upload" ? (
          <Card className="rounded-2xl border-zinc-200">
            <CardContent className="p-5 sm:p-6">
              <h2 className="font-serif text-2xl text-zinc-900">
                Dang san pham moi
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Them san pham voi day du front/back image.
              </p>

              <form onSubmit={handleUploadProduct} className="mt-5 space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-[11px] uppercase tracking-widest text-stone-500 font-semibold">
                    Ten san pham
                  </Label>
                  <Input
                    value={uploadForm.name}
                    onChange={updateUploadField("name")}
                    placeholder="Premium Linen Shirt"
                    className="bg-stone-50 border-stone-200 rounded-xl h-11"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[11px] uppercase tracking-widest text-stone-500 font-semibold">
                    Mo ta
                  </Label>
                  <textarea
                    value={uploadForm.description}
                    onChange={updateUploadField("description")}
                    placeholder="Short description for buyers"
                    className="w-full min-h-24 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-zinc-900 outline-none ring-offset-background placeholder:text-stone-400 focus-visible:ring-2 focus-visible:ring-zinc-400"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className="text-[11px] uppercase tracking-widest text-stone-500 font-semibold">
                      Gia (VND)
                    </Label>
                    <Input
                      type="number"
                      min="0"
                      value={uploadForm.cost}
                      onChange={updateUploadField("cost")}
                      placeholder="100000"
                      className="bg-stone-50 border-stone-200 rounded-xl h-11"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[11px] uppercase tracking-widest text-stone-500 font-semibold">
                      Loai
                    </Label>
                    <select
                      value={uploadForm.type}
                      onChange={updateUploadField("type")}
                      className="h-11 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 text-sm text-zinc-900"
                    >
                      <option value="tops">Tops</option>
                      <option value="bottoms">Bottoms</option>
                      <option value="one-pieces">One-pieces</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-[11px] uppercase tracking-widest text-stone-500 font-semibold">
                      Front image
                    </Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange(setFrontFile, setFrontPreview)}
                      className="bg-stone-50 border-stone-200 rounded-xl"
                    />
                    {frontPreview ? (
                      <img
                        src={frontPreview}
                        alt="Front preview"
                        className="h-40 w-full rounded-xl border border-stone-200 object-cover"
                      />
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[11px] uppercase tracking-widest text-stone-500 font-semibold">
                      Back image
                    </Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange(setBackFile, setBackPreview)}
                      className="bg-stone-50 border-stone-200 rounded-xl"
                    />
                    {backPreview ? (
                      <img
                        src={backPreview}
                        alt="Back preview"
                        className="h-40 w-full rounded-xl border border-stone-200 object-cover"
                      />
                    ) : null}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <Button
                    type="submit"
                    disabled={uploading}
                    className="rounded-xl bg-zinc-900 hover:bg-zinc-800"
                  >
                    {uploading ? "Dang upload..." : "Upload san pham"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-xl"
                    onClick={resetUploadForm}
                  >
                    Reset form
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : null}

        {!loading && activeTab === "shop" ? (
          <div className="space-y-4">
            <Card className="rounded-2xl border-zinc-200">
              <CardContent className="p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                      Current shop
                    </p>
                    <h2 className="font-serif text-2xl text-zinc-900">
                      {sellerInfo?.shop_name || "Seller Shop"}
                    </h2>
                  </div>
                  <Badge variant="outline" className="text-zinc-700">
                    {productCount} products
                  </Badge>
                </div>
                <p className="mt-3 text-zinc-600">
                  {sellerInfo?.shop_description || "Chua co mo ta cua hang."}
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-zinc-200">
              <CardContent className="p-5">
                <h3 className="font-serif text-xl text-zinc-900">
                  San pham dang ban
                </h3>

                {products.length === 0 ? (
                  <p className="mt-3 text-zinc-500">
                    Chua co san pham nao. Hay dang san pham dau tien.
                  </p>
                ) : (
                  <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {products.map((p) => (
                      <Card
                        key={`${p.seller_uuid}-${p.product_id}`}
                        className="overflow-hidden rounded-xl border-zinc-200"
                      >
                        <CardContent className="p-0">
                          <div className="grid grid-cols-2 gap-1 bg-zinc-100 p-1">
                            <img
                              src={p.front_img}
                              alt={`${p.name} front`}
                              className="h-32 w-full rounded-md object-cover"
                            />
                            <img
                              src={p.back_img || p.front_img}
                              alt={`${p.name} back`}
                              className="h-32 w-full rounded-md object-cover"
                            />
                          </div>
                          <div className="p-3">
                            <h4 className="font-medium text-zinc-900">
                              {p.name}
                            </h4>
                            <p className="mt-1 line-clamp-2 text-sm text-zinc-500">
                              {p.description || "No description"}
                            </p>
                            <div className="mt-3 flex items-center justify-between">
                              <span className="text-sm font-semibold text-zinc-900">
                                {Number(p.cost).toLocaleString()} VND
                              </span>
                              <Badge variant="secondary">{p.type}</Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default SellerDashboard;

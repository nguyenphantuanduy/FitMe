import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function ErrorBanner({ message }) {
  if (!message) return null;

  return (
    <Card className="mb-4 rounded-2xl border border-red-200 bg-red-50 text-red-800">
      <CardContent className="p-3 text-sm font-medium">{message}</CardContent>
    </Card>
  );
}

function PreviewSection({ title, badge, children }) {
  return (
    <Card className="rounded-2xl border-zinc-200">
      <CardContent className="p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-serif text-xl">{title}</h2>
          {badge}
        </div>
        {children}
      </CardContent>
    </Card>
  );
}

function VirtualTryOnAdvanced() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const aiResultRef = useRef(null);

  const scanningRef = useRef(false);
  const aiRunningRef = useRef(false);

  // =========================
  // STATES
  // =========================
  const [cameraStream, setCameraStream] = useState(null);
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [scanningEffect, setScanningEffect] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [statusMessage, setStatusMessage] = useState(
    "Chon trang phuc va nhan Start Try-On.",
  );

  const [tops, setTops] = useState([]);
  const [bottoms, setBottoms] = useState([]);
  const [onePieces, setOnePieces] = useState([]);

  const [selectedTop, setSelectedTop] = useState(null);
  const [selectedBottom, setSelectedBottom] = useState(null);
  const [selectedOnePiece, setSelectedOnePiece] = useState(null);

  const [showTops, setShowTops] = useState(false);
  const [showBottoms, setShowBottoms] = useState(false);
  const [showOnePieces, setShowOnePieces] = useState(false);

  const hasSelection = Boolean(
    selectedTop || selectedBottom || selectedOnePiece,
  );
  const navigate = useNavigate();

  // =========================
  // CAMERA
  // =========================
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (!videoRef.current) throw new Error("video_ref_not_ready");

      videoRef.current.srcObject = stream;
      await new Promise((resolve) => {
        videoRef.current.onloadedmetadata = resolve;
      });
      setCameraStream(stream);
      setErrorMessage("");
      setStatusMessage("Camera da san sang.");
    } catch {
      setErrorMessage(
        "Khong the mo camera. Hay kiem tra quyen truy cap camera.",
      );
      throw new Error("camera_unavailable");
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((t) => t.stop());
      setCameraStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    aiResultRef.current = aiResult;
  }, [aiResult]);

  useEffect(() => {
    return () => {
      scanningRef.current = false;
      stopCamera();
      if (aiResultRef.current) {
        URL.revokeObjectURL(aiResultRef.current);
      }
    };
  }, []);

  // =========================
  // CAPTURE
  // =========================
  const captureFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, "image/jpeg");
    });
  };

  // =========================
  // FETCH FILE
  // =========================
  const fetchFileFromUrl = async (url, filename) => {
    const res = await fetch(url);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type });
  };

  // =========================
  // SEND AI
  // =========================
  const sendToAI = async (personBlob) => {
    if (aiRunningRef.current) return;

    aiRunningRef.current = true;
    setAiLoading(true);
    setErrorMessage("");
    setStatusMessage("Dang tao ket qua thu do ao...");

    const formData = new FormData();
    formData.append("person_img", personBlob, "person.jpg");

    const appendGarment = async (selected, type) => {
      if (!selected) return;
      if (selected.front_img) {
        const frontFile = await fetchFileFromUrl(
          selected.front_img,
          `${type}_front.jpg`,
        );
        formData.append(`${type}_front`, frontFile);
      }
      if (selected.back_img) {
        const backFile = await fetchFileFromUrl(
          selected.back_img,
          `${type}_back.jpg`,
        );
        formData.append(`${type}_back`, backFile);
      }
    };

    await appendGarment(selectedTop, "tops");
    await appendGarment(selectedBottom, "bottoms");
    await appendGarment(selectedOnePiece, "onepieces");

    try {
      const res = await axios.post(
        "http://localhost:8000/vton/generate",
        formData,
        { responseType: "blob", withCredentials: true, timeout: 60000 },
      );

      if (aiResult) URL.revokeObjectURL(aiResult);
      setAiResult(URL.createObjectURL(res.data));
      setStatusMessage("Da cap nhat ket qua moi.");
    } catch {
      setErrorMessage(
        "Khong the tao ket qua thu do ao. Kiem tra AI server (localhost:8000).",
      );
      setStatusMessage("AI server khong phan hoi.");
    } finally {
      setAiLoading(false);
      aiRunningRef.current = false;
    }
  };

  // =========================
  // LOOP + Countdown
  // =========================
  const runLoop = async () => {
    while (scanningRef.current) {
      setScanningEffect(true);
      setStatusMessage("Dang quet tu camera...");

      for (let i = 3; i >= 1; i--) {
        setCountdown(i);
        await new Promise((r) => setTimeout(r, 1000));
        if (!scanningRef.current) break;
      }

      setCountdown(0);
      setScanningEffect(false);

      if (!scanningRef.current) break;

      const blob = await captureFrame();
      if (!blob) {
        setErrorMessage("Khong chup duoc khung hinh tu camera.");
        setStatusMessage("Khong nhan duoc frame tu camera.");
        scanningRef.current = false;
        break;
      }
      await sendToAI(blob);
    }

    setScanningEffect(false);
    setCountdown(0);
    setIsScanning(false);
    if (!errorMessage) {
      setStatusMessage("Da dung Try-On.");
    }
  };

  // =========================
  // START / STOP
  // =========================
  const startTryOn = async () => {
    if (isScanning || aiRunningRef.current) return;

    if (!hasSelection) {
      setErrorMessage("Hay chon it nhat 1 san pham truoc khi bat dau.");
      setStatusMessage("Chua co trang phuc nao duoc chon.");
      return;
    }

    if (!cameraStream) {
      try {
        await startCamera();
      } catch {
        return;
      }
    }

    scanningRef.current = true;
    setIsScanning(true);
    setErrorMessage("");
    setStatusMessage("Dang bat dau quy trinh thu do ao...");
    void runLoop();
  };

  const stopTryOn = () => {
    scanningRef.current = false;
    setIsScanning(false);
    stopCamera();
    setScanningEffect(false);
    setCountdown(0);
    setStatusMessage("Da dung Try-On.");
  };

  // =========================
  // FETCH PRODUCTS
  // =========================
  const fetchProducts = async (type) => {
    if (isScanning) {
      setErrorMessage("Hay dung Try-On truoc khi chon lai san pham.");
      return;
    }
    try {
      const res = await axios.get(
        `http://localhost:3000/api/products/${type}`,
        { withCredentials: true },
      );
      if (type === "tops") {
        setTops(res.data.products);
        setShowTops(true);
      }
      if (type === "bottoms") {
        setBottoms(res.data.products);
        setShowBottoms(true);
      }
      if (type === "one-pieces") {
        setOnePieces(res.data.products);
        setShowOnePieces(true);
      }
      setErrorMessage("");
      setStatusMessage("Da tai danh sach san pham.");
    } catch {
      setErrorMessage(
        "Khong tai duoc danh sach san pham. Kiem tra backend server.",
      );
      setStatusMessage("Tai san pham that bai.");
    }
  };

  // =========================
  // SELECT
  // =========================
  const handleSelect = (p, type) => {
    if (type === "tops") setSelectedTop(p);
    if (type === "bottoms") setSelectedBottom(p);
    if (type === "one-pieces") setSelectedOnePiece(p);

    setShowTops(false);
    setShowBottoms(false);
    setShowOnePieces(false);
    setStatusMessage("Da chon san pham. Ban co the bat dau Try-On.");
  };

  // =========================
  // SCAN EFFECT
  // =========================
  const ScanOverlay = () => {
    if (!scanningEffect) return null;

    return (
      <>
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent, rgba(34,197,94,0.35), transparent)",
            animation: "scanMove 2s linear infinite",
          }}
        />
        {countdown > 0 && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl font-bold text-lime-300 drop-shadow-[0_3px_8px_rgba(0,0,0,0.85)]">
            {countdown}
          </div>
        )}
      </>
    );
  };

  // =========================
  // AI RESULT RENDER
  // =========================
  const renderAIResult = () => {
    if (aiLoading) {
      return (
        <div
          className="aspect-square w-full rounded-2xl border border-zinc-300 p-3 text-center text-lg font-semibold text-zinc-600"
          style={{
            background: "linear-gradient(90deg, #eee 25%, #ddd 50%, #eee 75%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s infinite",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          FitMe Virtual Try-On <br /> Loading, please wait...
        </div>
      );
    }

    if (aiResult) {
      return (
        <img
          src={aiResult}
          alt="AI try-on result"
          className="aspect-square w-full rounded-2xl border border-zinc-300 object-cover"
        />
      );
    }

    return (
      <div className="aspect-square w-full rounded-2xl border-2 border-dashed border-zinc-300 bg-white/70 text-zinc-500 flex items-center justify-center">
        AI Result
      </div>
    );
  };

  // =========================
  // GRID SELECTOR
  // =========================
  const renderSelector = (products, type) => (
    <div className="mt-3 grid grid-cols-2 gap-2">
      {products.map((p) => (
        <button
          key={p.product_id}
          type="button"
          className="overflow-hidden rounded-lg border border-zinc-200 bg-white hover:border-zinc-400"
          onClick={() => handleSelect(p, type)}
        >
          <img
            src={p.front_img}
            alt={p.name || `${type} item`}
            className="h-20 w-full object-cover"
          />
          <p className="truncate px-2 py-1 text-left text-xs text-zinc-700">
            {p.name || `Product ${p.product_id}`}
          </p>
        </button>
      ))}
    </div>
  );

  // =========================
  // UI
  // =========================
  return (
    <div className="min-h-screen bg-stone-100 px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-7xl">
        <Card className="mb-6 overflow-hidden rounded-3xl border-0 bg-zinc-900 text-stone-100 shadow-xl">
          <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-amber-300">
                FabUric Lab
              </p>
              <h1 className="font-serif text-2xl sm:text-3xl">
                Virtual Try-On Studio
              </h1>
            </div>
            <div className="flex flex-wrap gap-2">
              {!isScanning ? (
                <Button
                  className="rounded-xl bg-amber-500 text-zinc-900 hover:bg-amber-400"
                  onClick={startTryOn}
                  disabled={!hasSelection || aiLoading}
                >
                  Start Try-On
                </Button>
              ) : (
                <Button
                  variant="destructive"
                  className="rounded-xl"
                  onClick={stopTryOn}
                >
                  Stop Try-On
                </Button>
              )}
              <Button
                variant="secondary"
                className="rounded-xl bg-stone-100 text-zinc-900 hover:bg-stone-200"
                onClick={() => navigate("/customer-dashboard")}
              >
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>

        <ErrorBanner message={errorMessage} />

        <Card className="mb-4 rounded-2xl border-zinc-200 bg-white/80">
          <CardContent className="flex flex-wrap items-center gap-2 p-3 text-sm text-zinc-700">
            <Badge variant={isScanning ? "secondary" : "outline"}>
              {isScanning ? "Scanning" : "Idle"}
            </Badge>
            <span>{statusMessage}</span>
          </CardContent>
        </Card>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_300px]">
          <PreviewSection
            title="AI Result"
            badge={
              aiLoading ? (
                <Badge className="bg-amber-500 text-zinc-900">Generating</Badge>
              ) : null
            }
          >
            {renderAIResult()}
          </PreviewSection>

          <PreviewSection
            title="Camera Feed"
            badge={
              isScanning ? (
                <Badge variant="secondary">Scanning</Badge>
              ) : (
                <Badge variant="outline">Idle</Badge>
              )
            }
          >
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="aspect-square w-full rounded-2xl border border-zinc-300 bg-zinc-900 object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />
              <ScanOverlay />
            </div>
          </PreviewSection>

          <Card
            className={`rounded-2xl border-zinc-200 transition-opacity ${
              isScanning ? "pointer-events-none opacity-55" : "opacity-100"
            }`}
          >
            <CardContent className="h-160 overflow-y-auto p-4 sm:p-5">
              <h2 className="mb-4 font-serif text-xl">Choose Garments</h2>

              <div className="mb-5">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-600">
                    Tops
                  </h3>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => fetchProducts("tops")}
                  >
                    Choose
                  </Button>
                </div>
                {selectedTop ? (
                  <img
                    src={selectedTop.front_img}
                    alt={selectedTop.name || "Selected top"}
                    className="h-24 w-full rounded-lg border border-zinc-200 object-cover"
                  />
                ) : null}
                {showTops && renderSelector(tops, "tops")}
              </div>

              <div className="mb-5">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-600">
                    Bottoms
                  </h3>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => fetchProducts("bottoms")}
                  >
                    Choose
                  </Button>
                </div>
                {selectedBottom ? (
                  <img
                    src={selectedBottom.front_img}
                    alt={selectedBottom.name || "Selected bottom"}
                    className="h-24 w-full rounded-lg border border-zinc-200 object-cover"
                  />
                ) : null}
                {showBottoms && renderSelector(bottoms, "bottoms")}
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-600">
                    One-Piece
                  </h3>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => fetchProducts("one-pieces")}
                  >
                    Choose
                  </Button>
                </div>
                {selectedOnePiece ? (
                  <img
                    src={selectedOnePiece.front_img}
                    alt={selectedOnePiece.name || "Selected one-piece"}
                    className="h-24 w-full rounded-lg border border-zinc-200 object-cover"
                  />
                ) : null}
                {showOnePieces && renderSelector(onePieces, "one-pieces")}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* SCAN CSS + SHIMMER */}
      <style>
        {`
        @keyframes scanMove {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        `}
      </style>
    </div>
  );
}

export default VirtualTryOnAdvanced;

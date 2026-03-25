// file: VirtualTryOnAdvanced.jsx

import React, { useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function VirtualTryOnAdvanced() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

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

  const [tops, setTops] = useState([]);
  const [bottoms, setBottoms] = useState([]);
  const [onePieces, setOnePieces] = useState([]);

  const [selectedTop, setSelectedTop] = useState(null);
  const [selectedBottom, setSelectedBottom] = useState(null);
  const [selectedOnePiece, setSelectedOnePiece] = useState(null);

  const [showTops, setShowTops] = useState(false);
  const [showBottoms, setShowBottoms] = useState(false);
  const [showOnePieces, setShowOnePieces] = useState(false);

  const navigate = useNavigate();

  // =========================
  // CAMERA
  // =========================
  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
    await new Promise((resolve) => {
      videoRef.current.onloadedmetadata = resolve;
    });
    setCameraStream(stream);
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((t) => t.stop());
      setCameraStream(null);
    }
  };

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
    aiRunningRef.current = true;
    setAiLoading(true);

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
        { responseType: "blob", withCredentials: true },
      );

      if (aiResult) URL.revokeObjectURL(aiResult);
      setAiResult(URL.createObjectURL(res.data));
    } catch (err) {
      console.error("Error sending to AI:", err);
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

      for (let i = 10; i >= 1; i--) {
        setCountdown(i);
        await new Promise((r) => setTimeout(r, 1000));
        if (!scanningRef.current) break;
      }

      setCountdown(0);
      setScanningEffect(false);

      if (!scanningRef.current) break;

      const blob = await captureFrame();
      await sendToAI(blob);
    }
  };

  // =========================
  // START / STOP
  // =========================
  const startTryOn = async () => {
    if (!selectedTop && !selectedBottom && !selectedOnePiece) {
      alert("Hãy chọn ít nhất 1 sản phẩm trước!");
      return;
    }

    if (!cameraStream) await startCamera();
    scanningRef.current = true;
    runLoop();
  };

  const stopTryOn = () => {
    scanningRef.current = false;
    stopCamera();
  };

  // =========================
  // FETCH PRODUCTS
  // =========================
  const fetchProducts = async (type) => {
    if (scanningRef.current) {
      alert("Stop Try-On trước khi chọn lại!");
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
    } catch {
      alert("Không tải được sản phẩm");
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
  };

  // =========================
  // SCAN EFFECT
  // =========================
  const ScanOverlay = () => {
    if (!scanningEffect) return null;

    return (
      <>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            background:
              "linear-gradient(to bottom, transparent, rgba(0,255,0,0.3), transparent)",
            animation: "scanMove 2s linear infinite",
          }}
        />
        {countdown > 0 && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: 64,
              color: "lime",
              fontWeight: "bold",
              textShadow: "2px 2px 4px black",
            }}
          >
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
          style={{
            width: 420,
            height: 420,
            borderRadius: 12,
            border: "1px solid #ddd",
            background: "linear-gradient(90deg, #eee 25%, #ddd 50%, #eee 75%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s infinite",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            fontSize: 20,
            color: "#555",
            textAlign: "center",
            padding: 10,
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
          width={420}
          height={420}
          style={{ borderRadius: 12, border: "1px solid #ddd" }}
        />
      );
    }

    return (
      <div
        style={{
          width: 420,
          height: 420,
          border: "2px dashed #ccc",
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        AI Result
      </div>
    );
  };

  // =========================
  // GRID SELECTOR
  // =========================
  const renderSelector = (products, type) => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: 8,
        marginTop: 10,
      }}
    >
      {products.map((p) => (
        <img
          key={p.product_id}
          src={p.front_img}
          width={90}
          style={{ cursor: "pointer", borderRadius: 6 }}
          onClick={() => handleSelect(p, type)}
        />
      ))}
    </div>
  );

  // =========================
  // UI
  // =========================
  return (
    <div style={{ padding: 20 }}>
      <h2>Virtual Try-on</h2>

      <div style={{ marginBottom: 20 }}>
        {!scanningRef.current ? (
          <button onClick={startTryOn}>Start Virtual Try-On</button>
        ) : (
          <button onClick={stopTryOn}>Stop Virtual Try-On</button>
        )}
        <button
          style={{ marginLeft: 10 }}
          onClick={() => navigate("/customer-dashboard")}
        >
          Back to Dashboard
        </button>
      </div>

      <div style={{ display: "flex", gap: 20, justifyContent: "center" }}>
        {/* AI */}
        <div>
          <h3>AI Result</h3>
          {renderAIResult()}
        </div>

        {/* CAMERA */}
        <div>
          <h3>Camera</h3>
          <div style={{ position: "relative" }}>
            <video
              ref={videoRef}
              autoPlay
              width={420}
              height={420}
              style={{ borderRadius: 12, border: "1px solid #ddd" }}
            />
            <canvas ref={canvasRef} style={{ display: "none" }} />
            <ScanOverlay />
          </div>
        </div>

        {/* PRODUCT PANEL */}
        <div
          style={{
            width: 240,
            display: "flex",
            flexDirection: "column",
            gap: 20,
            height: 440,
            overflowY: "auto",
            background: "rgba(0,0,0,0.5)",
            padding: 15,
            borderRadius: 12,
            pointerEvents: scanningRef.current ? "none" : "auto",
            opacity: scanningRef.current ? 0.5 : 1,
            transition: "opacity 0.3s ease",
          }}
        >
          <h3>Choose Product</h3>

          <div>
            <h4>Tops</h4>
            {selectedTop && (
              <img
                src={selectedTop.front_img}
                width={90}
                style={{ marginBottom: 8, borderRadius: 6 }}
              />
            )}
            <button
              disabled={scanningRef.current}
              onClick={() => fetchProducts("tops")}
            >
              Choose Tops
            </button>
            {showTops && renderSelector(tops, "tops")}
          </div>

          <div>
            <h4>Bottoms</h4>
            {selectedBottom && (
              <img
                src={selectedBottom.front_img}
                width={90}
                style={{ marginBottom: 8, borderRadius: 6 }}
              />
            )}
            <button
              disabled={scanningRef.current}
              onClick={() => fetchProducts("bottoms")}
            >
              Choose Bottoms
            </button>
            {showBottoms && renderSelector(bottoms, "bottoms")}
          </div>

          <div>
            <h4>One-piece</h4>
            {selectedOnePiece && (
              <img
                src={selectedOnePiece.front_img}
                width={90}
                style={{ marginBottom: 8, borderRadius: 6 }}
              />
            )}
            <button
              disabled={scanningRef.current}
              onClick={() => fetchProducts("one-pieces")}
            >
              Choose One-piece
            </button>
            {showOnePieces && renderSelector(onePieces, "one-pieces")}
          </div>
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

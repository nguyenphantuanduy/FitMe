// file: VirtualTryOnAdvanced.jsx

import React, { useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function VirtualTryOnAdvanced() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // trạng thái scan
  const scanningRef = useRef(false);

  const navigate = useNavigate();

  // =========================
  // Product state
  // =========================

  const [tops, setTops] = useState([]);
  const [bottoms, setBottoms] = useState([]);
  const [onePieces, setOnePieces] = useState([]);

  const [selectedTop, setSelectedTop] = useState(null);
  const [selectedBottom, setSelectedBottom] = useState(null);
  const [selectedOnePiece, setSelectedOnePiece] = useState(null);

  const [showTops, setShowTops] = useState(false);
  const [showBottoms, setShowBottoms] = useState(false);
  const [showOnePieces, setShowOnePieces] = useState(false);

  // =========================
  // AI result
  // =========================

  const [aiResult, setAiResult] = useState(null);

  // =========================
  // Camera
  // =========================

  const [scanning, setScanning] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);

  const startCamera = async () => {
    try {
      console.log("🎥 Starting camera...");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      videoRef.current.srcObject = stream;
      setCameraStream(stream);

      await new Promise((resolve) => {
        videoRef.current.onloadedmetadata = () => {
          resolve();
        };
      });

      console.log("✅ Camera ready");
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
  };

  // =========================
  // Convert URL -> File
  // =========================

  const fetchFileFromUrl = async (url, filename) => {
    const res = await fetch(url);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type });
  };

  // =========================
  // Capture frame
  // =========================

  const captureAndSend = async () => {
    if (!scanningRef.current) return;

    const canvas = canvasRef.current;

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const ctx = canvas.getContext("2d");

    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    console.log("📸 Capturing frame...");

    canvas.toBlob(async (blob) => {
      if (!blob) return;

      console.log("📤 Sending to AI...");

      await sendToServer(blob);
    }, "image/jpeg");
  };

  // =========================
  // Scan effect 10s
  // =========================

  const runScanEffect = () => {
    return new Promise((resolve) => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      let y = 0;

      const interval = setInterval(() => {
        if (!scanningRef.current) {
          clearInterval(interval);
          resolve();
          return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "rgba(0,255,0,0.25)";

        ctx.fillRect(0, y, canvas.width, 20);

        y += 10;

        if (y > canvas.height) {
          y = 0;
        }
      }, 30);

      setTimeout(() => {
        clearInterval(interval);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        resolve();
      }, 10000);
    });
  };

  // =========================
  // Send to AI server
  // =========================

  const sendToServer = async (personBlob) => {
    const formData = new FormData();

    formData.append("person_img", personBlob, "person.jpg");

    if (selectedTop) {
      const front = await fetchFileFromUrl(
        selectedTop.front_img,
        "top_front.jpg",
      );

      formData.append("tops_front", front);
    }

    if (selectedBottom) {
      const front = await fetchFileFromUrl(
        selectedBottom.front_img,
        "bottom_front.jpg",
      );

      formData.append("bottoms_front", front);
    }

    if (selectedOnePiece) {
      const front = await fetchFileFromUrl(
        selectedOnePiece.front_img,
        "onepiece_front.jpg",
      );

      formData.append("onepieces_front", front);
    }

    try {
      const res = await axios.post(
        "http://localhost:8000/vton/generate",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
          responseType: "blob",
        },
      );

      console.log("✅ AI result received");

      setAiResult(URL.createObjectURL(res.data));

      // chạy hiệu ứng quét 10s

      await runScanEffect();

      // capture tiếp

      captureAndSend();
    } catch (err) {
      console.error("❌ AI error:", err);

      setTimeout(() => {
        captureAndSend();
      }, 5000);
    }
  };

  // =========================
  // Start / Stop
  // =========================

  const startTryOn = async () => {
    console.log("▶️ Start Try-On");

    if (!cameraStream) {
      await startCamera();
    }

    scanningRef.current = true;
    setScanning(true);

    captureAndSend();
  };

  const stopTryOn = () => {
    console.log("⏹ Stop Try-On");

    scanningRef.current = false;
    setScanning(false);

    stopCamera();
  };

  // =========================
  // Fetch products
  // =========================

  const fetchProducts = async (type) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/products/${type}`,
        { withCredentials: true },
      );

      if (type === "tops") {
        setTops(res.data.products);
        setShowTops(true);
      } else if (type === "bottoms") {
        setBottoms(res.data.products);
        setShowBottoms(true);
      } else if (type === "one-pieces") {
        setOnePieces(res.data.products);
        setShowOnePieces(true);
      }
    } catch (err) {
      console.error(err);
      alert("Không tải được sản phẩm");
    }
  };

  // =========================
  // Select / reset
  // =========================

  const handleSelect = (product, type) => {
    if (type === "tops") setSelectedTop(product);

    if (type === "bottoms") setSelectedBottom(product);

    if (type === "one-pieces") setSelectedOnePiece(product);

    setShowTops(false);
    setShowBottoms(false);
    setShowOnePieces(false);
  };

  const handleReset = (type) => {
    if (type === "tops") setSelectedTop(null);

    if (type === "bottoms") setSelectedBottom(null);

    if (type === "one-pieces") setSelectedOnePiece(null);
  };

  // =========================
  // Render helpers
  // =========================

  const renderSelector = (products, type) => (
    <div
      style={{
        display: "flex",
        gap: 10,
        overflowX: "auto",
        marginTop: 10,
      }}
    >
      {products.map((p) => (
        <img
          key={p.product_id}
          src={p.front_img}
          alt={p.name}
          width={100}
          style={{
            cursor: "pointer",
            borderRadius: 6,
          }}
          onClick={() => handleSelect(p, type)}
        />
      ))}
    </div>
  );

  const renderPreview = (selected, type) => {
    if (!selected) return null;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img
          src={selected.front_img}
          width={100}
          style={{
            marginBottom: 5,
          }}
        />

        <button onClick={() => handleReset(type)}>Reset</button>
      </div>
    );
  };

  // =========================
  // JSX
  // =========================

  return (
    <div style={{ padding: 20 }}>
      <h2>Virtual Try-on</h2>

      <button
        onClick={() => navigate("/customer-dashboard")}
        style={{ marginBottom: 20 }}
      >
        ← Back to Customer Dashboard
      </button>

      <div style={{ marginBottom: 20 }}>
        {!scanning ? (
          <button onClick={startTryOn}>Start Try-On</button>
        ) : (
          <button onClick={stopTryOn}>Stop Try-On</button>
        )}
      </div>

      <div
        style={{
          display: "flex",
          gap: 30,
          alignItems: "flex-start",
        }}
      >
        {/* Camera */}

        <div style={{ position: "relative" }}>
          <video
            ref={videoRef}
            autoPlay
            width={500}
            height={500}
            style={{
              borderRadius: 12,
            }}
          />

          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              pointerEvents: "none",
            }}
          />
        </div>

        {/* AI Result */}

        <div>
          {aiResult ? (
            <img src={aiResult} alt="AI Result" width={500} height={500} />
          ) : (
            <div
              style={{
                width: 500,
                height: 500,
                border: "2px dashed #ccc",
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              AI Result
            </div>
          )}
        </div>

        {/* Products */}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <div>
            <h3>Tops</h3>

            {renderPreview(selectedTop, "tops")}

            <button onClick={() => fetchProducts("tops")}>Choose Tops</button>

            {showTops && renderSelector(tops, "tops")}
          </div>

          <div>
            <h3>Bottoms</h3>

            {renderPreview(selectedBottom, "bottoms")}

            <button onClick={() => fetchProducts("bottoms")}>
              Choose Bottoms
            </button>

            {showBottoms && renderSelector(bottoms, "bottoms")}
          </div>

          <div>
            <h3>One-piece</h3>

            {renderPreview(selectedOnePiece, "one-pieces")}

            <button onClick={() => fetchProducts("one-pieces")}>
              Choose One-piece
            </button>

            {showOnePieces && renderSelector(onePieces, "one-pieces")}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VirtualTryOnAdvanced;

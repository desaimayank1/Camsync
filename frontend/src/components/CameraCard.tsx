import React, { useEffect, useRef, useState } from "react";
import { Button, Alert } from "@mui/material";

interface CameraCardProps {
  id: number;
  name: string;
  location?: string;
  enabled: boolean;
  faceDetection: boolean;
  rtspUrl?: string; // Example: rtsp://localhost:8554/camera1
  metadata?: Record<string, any>;
}

const CameraCard: React.FC<CameraCardProps> = ({
  id,
  name,
  enabled,
  faceDetection,
  rtspUrl,
  metadata,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [status, setStatus] = useState<"OFFLINE" | "LIVE" | "FAILED">("OFFLINE");
  const [loading, setLoading] = useState(false);

  const lastDetected = metadata?.lastDetectedTime || "No recent activity";

  useEffect(() => {
    if (enabled && faceDetection) {
      setStatus("LIVE");
    } else if (enabled && !faceDetection) {
      setStatus("FAILED");
    } else {
      setStatus("OFFLINE");
    }
  }, [enabled, faceDetection]);

  useEffect(() => {
    if (enabled) {
      startStream();
    }
  }, [enabled]);

  // --- WebRTC connection logic ---
  const startStream = async () => {
    if (!videoRef.current || !rtspUrl) return;
    setLoading(true);

    try {
      // Derive camera name (camera1) from RTSP URL
      const streamName = "camera1";
      const baseUrl = "http://localhost:8889"; // MediaMTX WebRTC endpoint

      const pc = new RTCPeerConnection({
        iceServers: [{ urls: ["stun:stun.l.google.com:19302"] }],
      });

      pc.ontrack = (event) => {
        if (videoRef.current) {
          videoRef.current.srcObject = event.streams[0];
        }
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // Send the SDP offer to MediaMTX
      const response = await fetch(`${baseUrl}/${streamName}`, {
        method: "POST",
        body: offer.sdp,
      });

      const answerSdp = await response.text();
      await pc.setRemoteDescription({
        type: "answer",
        sdp: answerSdp,
      });

      setLoading(false);
      setStatus("LIVE");
    } catch (err) {
      console.error("WebRTC stream error:", err);
      setStatus("FAILED");
      setLoading(false);
    }
  };

  return (
    <div className="p-4 rounded-xl shadow-md bg-white w-full md:w-[45%] lg:w-[30%] flex flex-col">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-800">{name}</h3>
        <span
          className={`text-xs px-2 py-1 rounded ${status === "LIVE"
              ? "bg-green-100 text-green-600"
              : status === "OFFLINE"
                ? "bg-gray-100 text-gray-600"
                : "bg-pink-100 text-pink-700"
            }`}
        >
          {status}
        </span>
      </div>

      {status === "FAILED" ? (
        <Alert severity="error">
          Could not connect to the camera. Please check the connection.
        </Alert>
      ) : status === "LIVE" ? (
        <div className="relative rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            className="w-full h-48 object-cover bg-black rounded-lg"
            autoPlay
            muted
            playsInline
            controls
          />
          <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
            Last Detected: {lastDetected}
          </div>
        </div>
      ) : (
        <div className="h-40 bg-gray-200 rounded-lg flex items-center justify-center">
          <Button
            variant="contained"
            color="primary"
            onClick={startStream}
            disabled={loading}
          >
            {loading ? "Connecting..." : "Start Stream"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default CameraCard;

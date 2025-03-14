import { useCallback, useEffect, useState } from "react";

export default function useMedia() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);

  const getStream = useCallback(async () => {
    try {
      const streamInstance = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 96000, // Higher sample rate for better quality
          channelCount: 2, // Stereo audio
          bitrate: 128000, // Higher bitrate for better quality
        },
      });

      const videoTrack = streamInstance.getVideoTracks()[0];
      const videoSettings = videoTrack.getSettings();
      console.log(`Video resolution: ${videoSettings.width}x${videoSettings.height}`);

      const audioTrack = streamInstance.getAudioTracks()[0];
      const audioSettings = audioTrack.getSettings();
      console.log(`Audio sample rate: ${audioSettings.sampleRate} Hz, channel count: ${audioSettings.channelCount}`);

      setStream(streamInstance);

      const pc = new RTCPeerConnection();
      pc.addStream(streamInstance);
      setPeerConnection(pc);

      pc.oniceconnectionstatechange = () => {
        if (pc.iceConnectionState === "connected") {
          monitorNetwork(pc);
        }
      };
    } catch (err) {
      console.log("Error accessing local media stream", err);
      return null;
    }
  }, []);

  const monitorNetwork = (pc: RTCPeerConnection) => {
    setInterval(async () => {
      const stats = await pc.getStats(null);
      stats.forEach((report) => {
        if (report.type === "outbound-rtp" && report.kind === "video") {
          if (report.bytesSent < 100000) {
            // Low bandwidth, reduce quality
            adjustQuality({ width: 640, height: 480, frameRate: 15 });
          } else {
            // High bandwidth, increase quality
            adjustQuality({ width: 1920, height: 1080, frameRate: 30 });
          }
        }
      });
    }, 5000); // Check every 5 seconds
  };

  const adjustQuality = (constraints: { width: number; height: number; frameRate: number }) => {
    if (!stream) return;
    const videoTrack = stream.getVideoTracks()[0];
    videoTrack.applyConstraints({
      width: constraints.width,
      height: constraints.height,
      frameRate: constraints.frameRate,
    });
  };

  const closeStream = useCallback(() => {
    if (!stream) return;
    stream.getTracks().forEach((track) => track.stop());
    setStream(null);
    if (peerConnection) {
      peerConnection.close();
      setPeerConnection(null);
    }
  }, [stream, peerConnection]);

  useEffect(() => {
    const initializeStream = async () => await getStream();
    initializeStream();
    return () => closeStream();
  }, []);

  return { stream, closeStream };
}

import { useCallback, useEffect, useState } from "react";

export default function useMedia() {
  const [stream, setStream] = useState<MediaStream | null>(null);

  const getStream = useCallback(async () => {
    try {
      const streamInstance = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { max: 1920 },
          height: { max: 1080 },
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100,
        },
      });

      const videoTrack = streamInstance.getVideoTracks()[0];
      const videoSettings = videoTrack.getSettings();
      console.log(`Video resolution: ${videoSettings.width}x${videoSettings.height}`);

      const audioTrack = streamInstance.getAudioTracks()[0];
      const audioSettings = audioTrack.getSettings();
      console.log(`Audio bitrate: ${audioSettings.sampleRate} Hz`);

      setStream(streamInstance);
    } catch (err) {
      console.log("Error accessing local media stream", err);
      return null;
    }
  }, []);

  const closeStream = useCallback(() => {
    if (!stream) return;
    stream.getTracks().forEach((track) => track.stop());
    setStream(null);
  }, [stream]);

  useEffect(() => {
    const initializeStream = async () => await getStream();
    initializeStream();
    return () => closeStream();
  }, []);

  return { stream, closeStream };
}

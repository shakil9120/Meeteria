import { useCallback, useEffect, useState } from "react";
import Controls from "../btn/controlBtn";
import useMedia from "@/hooks/useMedia";
import { useSocket } from "@/context/socketContext";
import RemoteCall from "./remoteCall";
import { useParams } from "react-router-dom";
import FriendCall from "./friendCall";
import { useFriend } from "@/context/friendContext";
import { usePeerState } from "@/context/peerStateContext";

type strangerProp = {
  pairId: string;
  pairName: string;
  polite: boolean;
};

interface userProps {
  id: string;
  name: string;
  pairId: string;
  pairName: string;
  duoId?: string;
  duoName?: string;
  polite: boolean;
}

export default function Call() {
  const socket = useSocket();
  const { duoId } = useParams();
  const { friend } = useFriend();
  const { peerState } = usePeerState();
  const { stream, closeStream } = useMedia();
  const [isMatched, setIsMatched] = useState(false);
  const [duo, setDuo] = useState<strangerProp | null>(null);
  const [stranger, setStranger] = useState<strangerProp | null>(null);

  const handlePeer = useCallback(
    (data?: userProps) => {
      setIsMatched(!!data);
      if (!data) {
        console.log("stranger left");
        setStranger(null);
        setDuo(null);
        return;
      }
      setStranger({
        pairName: data.pairName,
        pairId: data.pairId,
        polite: data.polite,
      });

      if (data.duoId && data.duoName) {
        setDuo({
          pairName: data.duoName,
          pairId: data.duoId,
          polite: data.polite,
        });
      }
    },
    [socket],
  );

  const handleBeforeUnload = useCallback(() => {
    socket?.emit("pairedclosedtab", {
      pairId: stranger?.pairId,
      duoId: duo?.pairId,
    });
  }, [socket, stranger]);

  useEffect(() => {
    socket?.on("peer", handlePeer);

    if (
      !socket ||
      stranger ||
      duoId ||
      (friend && peerState.friend === "disconnected")
    ) {
      return;
    }
    socket.emit("connectPeer", {
      duoSocketId: friend?.pairId,
      duoUsername: friend?.pairName,
    });
    console.log("send connectPeer");

    return () => {
      socket.off("peer", handlePeer);
    };
  }, [socket, stranger, peerState]);

  useEffect(() => {
    if (!socket) return;
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [socket, stranger]);

  return (
    <div className="flex flex-col md:flex-row w-full h-full">
      <div className="flex-1 md:h-full h-1/2 relative">
        <RemoteCall
          stream={stream}
          handleCallEnd={handlePeer}
          stranger={stranger}
          userType={duoId ? "duo" : "stranger"}
        />
      </div>
      {duo && peerState.stranger === "connected" && (
        <div className="flex-1 md:h-full h-1/2 relative">
          <RemoteCall
            stream={stream}
            handleCallEnd={handlePeer}
            stranger={duo}
            userType={"duo"}
          />
        </div>
      )}
      <Controls
        strangerId={stranger?.pairId}
        duoId={duo?.pairId}
        friendId={friend?.pairId}
        endCall={handlePeer}
        closeStream={closeStream}
      />
    </div>
  );
}

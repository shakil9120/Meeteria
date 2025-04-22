import { useStartPage } from "@/context/startPageContext";
import SwitchSoloDuo from "./btn/modeSwitch";
import { useEffect, useState } from "react";
import CreateDuoLink from "./btn/createDuoLink";
import { useFriendConnect } from "@/hooks/useFriendConnect";
import { CloudBackground } from "../ui/CloudBackground";
import { ChevronDown, HelpCircle, LogOut, Settings, User } from "lucide-react";
import axios from "axios";
import defaultPfp from "@/assets/img/defaultPfp.jpeg";

export default function StartCall() {
  const { setStartPage } = useStartPage();
  const [checkCopied, setCheckCopied] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);
  const [switchMode, setSwitchMode] = useState<"solo" | "duo">("solo");
  useFriendConnect({ copied: checkCopied });


  const [pfp, setPfp] = useState<string | undefined>();

  useEffect(() => {
    axios
      .post(import.meta.env.VITE_API_URL + "/getPfp", {
        username: localStorage.getItem("username"),
      })
      .then((res) => {
        res.data !== "default" ? setPfp(res.data) : setPfp(defaultPfp);
      });
  }, []);


  return (
    <div className="flex flex-col lg:flex-row  w-full">
      <div className="relative bg-gradient-to-br from-purple-600 to-purple-800 overflow-hidden w-auto md:w-6/12  h-96 md:h-auto">
        {/* Floating Clouds without images */}
        <CloudBackground />
        {/* Center Text */}
        <div className="absolute left-8 top-8 flex items-center gap-1 text-sm font-medium z-10">
          <span className="text-yellow-500">💛</span>
          <span className="text-white">Shop</span>
        </div>
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold">Meeteria</h1>
            <p className="mt-2 text-lg text-green-300">● 10,225 users online</p>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white  shadow-xl   p-6">
        <div className="flex flex-col justify-between h-full">
          {/* nav */}
          <div className="flex justify-end items-center mb-6 gap-3 mt-2">
            <div>
              <SwitchSoloDuo
                setSwitchMode={setSwitchMode}
                switchMode={switchMode}
              />
              {/* profile */}
            </div>
            <div>
              <button
                onClick={() => setIsNavOpen(!isNavOpen)}
                className="flex items-center space-x-2  rounded-full py-2 px-4  transition duration-200"
              >
                <span className="font-medium text-black">
                  {localStorage.getItem("username")}
                </span>
                <ChevronDown size={16} className="text-purple-700" />

                <img
                  src={pfp}
                  alt="User"
                  className="w-12 h-12 rounded-full border-2 "
                />

              </button>
              {isNavOpen && (
                <nav className="absolute right-0 mt-2 w-56 bg-card rounded-lg shadow-lg py-2 z-10">
                  {[
                    { icon: User, text: "Profile" },
                    { icon: Settings, text: "Settings" },
                    { icon: HelpCircle, text: "about" },
                    { icon: LogOut, text: "Logout" },
                  ].map(({ icon: Icon, text }) => (
                    <a
                      key={text}
                      href={text}
                      className="flex items-center px-4 py-2 hover:bg-muted hover:text-primary transition duration-200"
                    >
                      <Icon className="mr-3 text-purple-600" size={18} />
                      <span className="text-sm font-medium text-purple-600">{text}</span>
                    </a>
                  ))}
                </nav>
              )}
            </div>
          </div>

          {/* middle part */}


          {switchMode === "solo"
            ? (
              <div className="flex-grow flex items-center justify-center py-10">
                <div className="flex flex-col items-center justify-center  bg-white text-center px-4">
                  <div className="bg-gray-100 p-4 rounded-full mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-red-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 7h2l2-3h10l2 3h2a2 2 0 012 2v10a2 2 0 01-2 2H3a2 2 0 01-2-2V9a2 2 0 012-2z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 11a3 3 0 100 6 3 3 0 000-6z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">Camera permission denied</h2>
                  <p className="text-gray-600">Please grant permission to access your camera in your browser settings.</p>
                </div>

              </div>
            )
            : <CreateDuoLink setCheckCopied={setCheckCopied} />
          }

          {/* bottm button */}
          <div>
            <div className="flex-grow flex items-center justify-end  mb-0 md:mb-7">
              <button
                onClick={() => setStartPage("solo")}hover:bg-blue-700
                className="px-12 py-2 bg-purple-500 hover:bg-purple-600 text-white text-lg font-semibold rounded-lg shadow-md  transition duration-300 transform hover:scale-105 w-auto mx-auto"
              >
                Start Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

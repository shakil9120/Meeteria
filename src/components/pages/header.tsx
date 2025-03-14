import { useEffect, useState } from "react";
import defaultPfp from "@/assets/img/defaultPfp.jpeg";
import MeeteriaLogo from "@/assets/logo";
import { ChevronDown, HelpCircle, LogOut, Settings, User } from "lucide-react";
import axios from "axios";

export default function Header() {
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);
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
    <header className="bg-background shadow-md p-2 px-6 flex justify-between items-center">
      <div className="flex items-center">
        <MeeteriaLogo size="md" />
      </div>
      <div className="relative">
        <button
          onClick={() => setIsNavOpen(!isNavOpen)}
          className="flex items-center space-x-2 bg-muted rounded-full py-2 px-4 hover:bg-accent hover:text-accent-foreground transition duration-200"
        >
          <img
            src={pfp}
            alt="User"
            className="w-8 h-8 rounded-full border-2 border-primary"
          />
          <span className="font-medium text-foreground">
            {localStorage.getItem("username")}
          </span>
          <ChevronDown size={16} className="text-muted-foreground" />
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
                <Icon className="mr-3 text-primary" size={18} />
                <span className="text-sm font-medium text-foreground">{text}</span>
              </a>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
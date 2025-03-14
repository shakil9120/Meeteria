import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin, useGoogleOneTapLogin } from "@react-oauth/google";
import MeeteriaLogo from "@/assets/logo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, CheckCircle, Globe, Users, Video } from "lucide-react";
import GoogleButton from "./googleBtn";
import Feature from "./feature";
import axios from "axios";
import env from "@/utils/enviroment";

interface Notification {
  type: "success" | "error";
  message: string;
}

const Auth = () => {
  const navigate = useNavigate();
  const [notification, setNotification] = useState<Notification | null>(null);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = useCallback(
    (type: "success" | "error", message: string) => {
      setNotification({ type, message });
    },
    []
  );

  const handleOnSuccess = useCallback(async (credentialResponse: any) => {
    const { credential, access_token } = credentialResponse;
    try {
      const response = await axios.post(env.apiUrl + "/auth", {
        credential,
        access_token,
      });
      if (response) {
        const { token, username } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("username", username);
        navigate("/");
        return;
      }
    } catch (err) {
      navigate(`/username/${access_token}/${credential}`);
      showNotification("error", "An error occurred during authentication.");
    }
  }, [navigate, showNotification]);

  const handleOnError = useCallback(() => {
    showNotification("error", "An error occurred during login.");
  }, [showNotification]);

  const login = useGoogleLogin({
    onSuccess: handleOnSuccess,
    onError: handleOnError,
  });

  useGoogleOneTapLogin({
    onSuccess: handleOnSuccess,
    onError: handleOnError,
  });

  const techStack = [
    "React",
    "TypeScript",
    "NodeJS",
    "Docker",
    "Prisma DB",
    "PostgreSQL",
    "MongoDB",
    "WebRTC",
    "Socket.IO",
    "Nginx",
    "Google Engine",
  ];

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(252,43,76,0.3),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(252,43,76,0.05),transparent_40%)]" />

      <div className="relative mx-auto max-w-6xl px-4 py-12">
        <div className="mb-20 flex flex-col items-center space-y-12">
          <div className="relative">
            <div className="absolute -inset-8 rounded-full bg-[radial-gradient(circle_at_center,rgba(252,43,76,0.25),transparent_80%)] blur-xl" />
            <MeeteriaLogo size="md" />
          </div>

          <div className="relative max-w-2xl text-center">
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-foreground">
              Connect with the World
            </h1>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Experience seamless video chat with strangers worldwide through
              our Omegle-inspired platform.
            </p>
          </div>

          <GoogleButton login={login} />
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-8">
            <Card className="border-border bg-card shadow-xl backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-card-foreground">Key Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Feature
                  icon={Users}
                  title="Multiple Connections"
                  description="Connect with multiple users simultaneously in high-quality video calls"
                />
                <Feature
                  icon={Globe}
                  title="Global Random Pairing"
                  description="Meet interesting people from around the world instantly"
                />
                <Feature
                  icon={Video}
                  title="HD Video Quality"
                  description="Experience crystal clear video communication with low latency"
                />
              </CardContent>
            </Card>

            <Card className="border-border bg-card shadow-xl backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-card-foreground">Tech Stack</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {techStack.map((tech) => (
                    <Badge
                      key={tech}
                      variant="secondary"
                      className="bg-muted text-muted-foreground transition-all duration-300 hover:bg-accent hover:text-accent-foreground"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="border-border bg-card shadow-xl backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-card-foreground">
                  Watch Demo
                  <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
                </CardTitle>
              </CardHeader>
              <div className="aspect-video w-full overflow-hidden rounded-b-lg">
                <iframe
                  className="h-full w-full"
                  src=""
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  loading="lazy"
                  allowFullScreen
                />
              </div>
            </Card>
          </div>
        </div>

        <footer className="mt-16 text-center">
          <Link
            to="/privacypolicy"
            className="text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            Privacy Policy
          </Link>
        </footer>
      </div>

      {notification && (
        <div
          className={`fixed bottom-6 right-6 flex items-center gap-2 rounded-lg px-6 py-3 shadow-lg backdrop-blur-sm
            ${
              notification.type === "error"
                ? "bg-destructive text-destructive-foreground"
                : "bg-primary text-primary-foreground"
            }`}
        >
          <CheckCircle className="h-5 w-5" />
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default Auth;
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useTypedSelector, useAppDispatch } from "@/app/hook";
import { useGuestLoginMutation } from "@/features/auth/authAPI";
import { setCredentials } from "@/features/auth/authSlice";
import { Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const GUEST_ID_KEY = "monetra_guest_device_id";

const ProtectedRoute = () => {
  const dispatch = useAppDispatch();
  const { accessToken, user } = useTypedSelector((state) => state.auth);
  const [guestLogin] = useGuestLoginMutation();
  const [showDirectEnter, setShowDirectEnter] = useState(false);

  const initLocalFallbackSession = (guestId: string) => {
    const fallbackData = {
      accessToken: `guest_token_${Date.now()}`,
      user: {
        id: guestId,
        name: "Guest User",
        email: `guest_${guestId.slice(-6)}@monetra.local`,
        baseCurrency: "USD",
        isEmailVerified: true,
        profilePicture: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
    dispatch(setCredentials(fallbackData));
  };

  useEffect(() => {
    if (!accessToken || !user) {
      let storedGuestId = localStorage.getItem(GUEST_ID_KEY);
      if (!storedGuestId) {
        storedGuestId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        localStorage.setItem(GUEST_ID_KEY, storedGuestId);
      }

      // Show fallback button after 2.5s if network is slow
      const timer = setTimeout(() => {
        setShowDirectEnter(true);
      }, 2500);

      // Auto-fallback after 4s so user is never stuck
      const autoFallbackTimer = setTimeout(() => {
        if (!accessToken || !user) {
          initLocalFallbackSession(storedGuestId!);
        }
      }, 4000);

      guestLogin({ guestId: storedGuestId })
        .unwrap()
        .then((data) => {
          dispatch(setCredentials(data));
        })
        .catch((err) => {
          console.warn("Server guest login failed, activating instant local session:", err);
          initLocalFallbackSession(storedGuestId!);
        })
        .finally(() => {
          clearTimeout(timer);
          clearTimeout(autoFallbackTimer);
        });

      return () => {
        clearTimeout(timer);
        clearTimeout(autoFallbackTimer);
      };
    }
  }, [accessToken, user, guestLogin, dispatch]);

  if (accessToken && user) {
    return <Outlet />;
  }

  let currentGuestId = localStorage.getItem(GUEST_ID_KEY) || "guest_default";

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background px-4">
      <div className="flex flex-col items-center gap-3 text-center max-w-xs">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-semibold text-foreground">Opening Monetra...</p>
        <p className="text-xs text-muted-foreground">
          Preparing your financial workspace and syncing preferences.
        </p>

        {showDirectEnter && (
          <Button
            size="sm"
            onClick={() => initLocalFallbackSession(currentGuestId)}
            className="mt-2 text-xs font-semibold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 shadow-xs"
          >
            Enter Workspace Immediately <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProtectedRoute;

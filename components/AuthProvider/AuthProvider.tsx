"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { checkSession, logout } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

type Props = {
  children: React.ReactNode;
};

const privateRoutePrefixes = ["/notes", "/profile"];

const isPrivateRoute = (pathname: string) =>
  privateRoutePrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

export default function AuthProvider({ children }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated,
  );
  const [isChecking, setIsChecking] = useState(true);
  const [canRenderPrivateContent, setCanRenderPrivateContent] = useState(false);

  useEffect(() => {
    let isActive = true;
    const privateRoute = isPrivateRoute(pathname);

    const verifySession = async () => {
      setIsChecking(true);

      try {
        const user = await checkSession();

        if (!isActive) {
          return;
        }

        if (user) {
          setUser(user);
          setCanRenderPrivateContent(true);
          return;
        }

        clearIsAuthenticated();
        setCanRenderPrivateContent(!privateRoute);

        if (privateRoute) {
          await logout().catch(() => undefined);
          router.replace("/sign-in");
          router.refresh();
        }
      } catch {
        if (!isActive) {
          return;
        }

        clearIsAuthenticated();
        setCanRenderPrivateContent(!privateRoute);

        if (privateRoute) {
          router.replace("/sign-in");
          router.refresh();
        }
      } finally {
        if (isActive) {
          setIsChecking(false);
        }
      }
    };

    void verifySession();

    return () => {
      isActive = false;
    };
  }, [pathname, router, setUser, clearIsAuthenticated]);

  if (isPrivateRoute(pathname) && (isChecking || !canRenderPrivateContent)) {
    return <p>Loading...</p>;
  }

  return children;
}

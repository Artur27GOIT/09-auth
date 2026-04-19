"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import css from "./AuthNavigation.module.css";

export default function AuthNavigation() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated,
  );
  const [isPending, setIsPending] = useState(false);

  const handleLogout = async () => {
    setIsPending(true);

    try {
      await logout();
    } finally {
      clearIsAuthenticated();
      router.replace("/sign-in");
      router.refresh();
      setIsPending(false);
    }
  };

  if (isAuthenticated) {
    return (
      <>
        <li className={css.navigationItem}>
          <Link
            href="/profile"
            prefetch={false}
            className={css.navigationLink}
          >
            Profile
          </Link>
        </li>

        <li className={css.navigationItem}>
          <p className={css.userEmail}>{user?.email ?? "User email"}</p>
          <button
            type="button"
            className={css.logoutButton}
            onClick={handleLogout}
            disabled={isPending}
          >
            Logout
          </button>
        </li>
      </>
    );
  }

  return (
    <>
      <li className={css.navigationItem}>
        <Link
          href="/sign-in"
          prefetch={false}
          className={css.navigationLink}
        >
          Login
        </Link>
      </li>

      <li className={css.navigationItem}>
        <Link
          href="/sign-up"
          prefetch={false}
          className={css.navigationLink}
        >
          Sign up
        </Link>
      </li>
    </>
  );
}

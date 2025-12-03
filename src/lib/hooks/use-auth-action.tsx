"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { AuthModal } from "@/components/auth/auth-modal";
import { useAuth } from "@/lib/auth/context";
import { authEnabled } from "@/lib/config/auth";

export function useAuthAction() {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const requireAuth = (action: () => void) => {
    // Feature flag for auth - when disabled, allow all actions

    if (!authEnabled) {
      action();
      return;
    }

    if (loading) {
      return;
    }

    if (!user) {
      setShowAuthModal(true);
      return;
    }

    action();
  };

  const AuthModalComponent = () => (
    <AuthModal
      onOpenChange={setShowAuthModal}
      open={showAuthModal}
      redirectPath={pathname}
    />
  );

  return {
    requireAuth,
    AuthModalComponent,
    user,
    loading,
  };
}

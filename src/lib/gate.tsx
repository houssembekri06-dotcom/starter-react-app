import { useEffect, type ReactNode } from "react";
// @ts-ignore js module
import { useProgress } from "../context/ProgressContext";
import { useNavigate } from "@tanstack/react-router";

export function Gate({ children }: { children: ReactNode }) {
  const { onboarded } = useProgress();
  const navigate = useNavigate();
  useEffect(() => {
    if (!onboarded) navigate({ to: "/onboarding", replace: true });
  }, [onboarded, navigate]);
  if (!onboarded) return null;
  return <>{children}</>;
}

// The tab bar itself is rendered once at the phone-frame level (see
// __root.tsx) so it stays pinned outside the scrolling content area.
export function TabScreen({ children }: { children: ReactNode }) {
  return <Gate>{children}</Gate>;
}
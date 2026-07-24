import { useEffect, type ReactNode } from "react";
// @ts-ignore js module
import { useProgress } from "../context/ProgressContext";
import { useNavigate } from "@tanstack/react-router";
// @ts-ignore js module
import TabBar from "../components/TabBar";

export function Gate({ children }: { children: ReactNode }) {
  const { onboarded } = useProgress();
  const navigate = useNavigate();
  useEffect(() => {
    if (!onboarded) navigate({ to: "/onboarding", replace: true });
  }, [onboarded, navigate]);
  if (!onboarded) return null;
  return <>{children}</>;
}

export function TabScreen({ children }: { children: ReactNode }) {
  return (
    <Gate>
      {children}
      <TabBar />
    </Gate>
  );
}
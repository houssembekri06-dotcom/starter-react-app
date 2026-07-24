import { useCallback } from "react";
import {
  Link as TSRLink,
  useNavigate as tsrUseNavigate,
  useParams as tsrUseParams,
  useRouterState,
} from "@tanstack/react-router";

// Compat layer so screens written against react-router-dom keep working
// on top of TanStack Router. Screens use string paths like
// `navigate('/lesson/abc')`; TanStack accepts a plain path string in `to`.

export function useNavigate() {
  const navigate = tsrUseNavigate();
  return useCallback(
    (to: string | number, opts?: { replace?: boolean }) => {
      if (typeof to === "number") {
        if (typeof window !== "undefined") window.history.go(to);
        return;
      }
      navigate({ to, replace: opts?.replace });
    },
    [navigate],
  );
}

export function useParams() {
  return tsrUseParams({ strict: false }) as Record<string, string>;
}

type LinkProps = {
  to: string;
  replace?: boolean;
  className?: string;
  children?: React.ReactNode;
  [key: string]: unknown;
};

export function Link({ to, children, ...rest }: LinkProps) {
  return (
    // @ts-expect-error runtime string path
    <TSRLink to={to} {...rest}>
      {children}
    </TSRLink>
  );
}

type NavLinkProps = {
  to: string;
  end?: boolean;
  className?: string | ((state: { isActive: boolean }) => string);
  children?: React.ReactNode | ((state: { isActive: boolean }) => React.ReactNode);
  [key: string]: unknown;
};

export function NavLink({ to, end, className, children, ...rest }: NavLinkProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = end ? pathname === to : pathname === to || pathname.startsWith(to + "/");
  const cls = typeof className === "function" ? className({ isActive }) : className;
  const kids = typeof children === "function" ? children({ isActive }) : children;
  return (
    // @ts-expect-error runtime string path
    <TSRLink to={to} className={cls} {...rest}>
      {kids}
    </TSRLink>
  );
}

export function Navigate({ to, replace }: { to: string; replace?: boolean }) {
  const navigate = tsrUseNavigate();
  if (typeof window !== "undefined") {
    queueMicrotask(() => navigate({ to, replace }));
  }
  return null;
}
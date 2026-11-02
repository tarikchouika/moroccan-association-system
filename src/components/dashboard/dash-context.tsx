"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export interface DashAssociation {
  id: string;
  name: string;
  slug: string;
  acronym: string | null;
  status: string;
  isVerified: boolean;
  roleInAssociation: string;
  roleLabel: string;
  membershipNumber: string;
}

interface DashUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Ctx {
  user: DashUser;
  associations: DashAssociation[];
  associationId: string | null;
  setAssociationId: (id: string) => void;
  canManage: boolean;
  canFinance: boolean;
  isSuper: boolean;
  /** طاقم إدارة المنصة (سوبر أدمين/أدمين/كوأدمين/محاسب) — يرون رابط لوحة الإدارة */
  isStaff: boolean;
}

const DashboardCtx = createContext<Ctx | null>(null);

export function useDash(): Ctx {
  const ctx = useContext(DashboardCtx);
  if (!ctx) throw new Error("useDash must be used within DashboardShell");
  return ctx;
}

export function useSelectedAssociation() {
  const { associations, associationId } = useDash();
  return associations.find((a) => a.id === associationId) ?? null;
}

export function DashboardShell({
  user,
  associations,
  children,
}: {
  user: DashUser;
  associations: DashAssociation[];
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 15_000, retry: 1, refetchOnWindowFocus: false },
        },
      })
  );

  const [associationId, setAssociationIdState] = useState<string | null>(
    associations[0]?.id ?? null
  );

  const setAssociationId = useCallback((id: string) => {
    setAssociationIdState(id);
    try {
      localStorage.setItem("mamp_assoc", id);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("mamp_assoc");
      if (saved && associations.some((a) => a.id === saved)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- restore the saved association after mount
        setAssociationIdState(saved);
      }
    } catch {}
  }, [associations]);

  const current = associations.find((a) => a.id === associationId) ?? null;
  const isSuper = user.role === "SUPER_ADMIN";
  const isStaff = isSuper || ["ASSOCIATION_ADMIN", "CO_ADMIN", "ACCOUNTANT"].includes(user.role);
  // التصريف الإداري: المالك وأدمين المنصة وأعضاء المكتب — الكوأدمين والمحاسبون اطلاع
  const canManage =
    isSuper ||
    user.role === "ASSOCIATION_ADMIN" ||
    (!!current && ["PRESIDENT", "VICE_PRESIDENT", "SECRETARY", "TREASURER", "CO_ADMIN"].includes(current.roleInAssociation));
  const canFinance = isSuper || user.role === "ACCOUNTANT" || (!!current && ["PRESIDENT", "TREASURER"].includes(current.roleInAssociation));

  return (
    <QueryClientProvider client={queryClient}>
      <DashboardCtx.Provider
        value={{ user, associations, associationId, setAssociationId, canManage, canFinance, isSuper, isStaff }}
      >
        {children}
      </DashboardCtx.Provider>
    </QueryClientProvider>
  );
}

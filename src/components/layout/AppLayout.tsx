'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface AppLayoutProps {
  children: React.ReactNode;
  activeWard?: string;
  onWardChange?: (ward: string) => void;
}

export function AppLayout({ children, activeWard = 'all', onWardChange }: AppLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => {
        if (!res.ok) {
          // If unauthenticated, redirect to login
          router.push('/auth/login');
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/auth/login');
    } catch {
      router.push('/auth/login');
    }
  };

  const navItems = [
    { label: 'Overview', href: '/dashboard', icon: 'dashboard' },
    { label: 'Patient Arrivals & Records', href: '/patients', icon: 'emergency' },
    { label: 'Patient Discharge', href: '/discharge', icon: 'output' },
    { label: 'Flow Analytics & History', href: '/flow-history', icon: 'timeline' },
    { label: 'Data Import', href: '/data-import', icon: 'upload_file' },
  ];

  const agentItems = [
    { label: 'Demand Forecast', href: '/agents/forecasting', icon: 'trending_up' },
    { label: 'Resource Monitor', href: '/agents/resources', icon: 'inventory' },
    { label: 'AI Recommendations', href: '/agents/recommendations', icon: 'psychology' },
    { label: 'SMARTLOAD Workload', href: '/agents/smartload', icon: 'balance' },
    { label: 'SMARTSTRESS Surge', href: '/agents/smartstress', icon: 'bolt' },
  ];

  const adminItems = [
    { label: 'Admin Governance', href: '/admin', icon: 'shield' },
    { label: 'Staff Profile', href: '/profile', icon: 'manage_accounts' },
  ];

  const isCurrent = (href: string) => {
    if (href === '/dashboard' && (pathname === '/dashboard' || pathname === '/')) return true;
    return pathname.startsWith(href);
  };

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface min-h-screen">
      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 h-full w-72 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between overflow-y-auto">
        <div className="flex flex-col">
          {/* Logo Brand Header */}
          <div className="h-16 px-space-md flex items-center gap-space-sm bg-surface-container-lowest">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary text-[20px]">vital_signs</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-lg text-label-lg text-on-surface tracking-tight leading-none">
                AURA CLINICAL
              </span>
              <span className="font-label-sm text-label-sm text-outline tracking-wider uppercase mt-0.5">
                ETU / Trauma Digital Twin
              </span>
            </div>
          </div>

          {/* Ward Status Model Badge */}
          <div className="px-space-md py-space-sm">
            <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col gap-space-xs">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
                  Active Ward Model
                </span>
                <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
              </div>
              <div className="flex items-center justify-between text-on-surface">
                <span className="font-label-md text-label-md">Combined ETU &amp; Accident</span>
                <span className="material-symbols-outlined text-[16px] text-outline">unfold_more</span>
              </div>
            </div>
          </div>

          {/* Navigation Section 1: Clinical Command */}
          <div className="px-space-md pt-space-xs">
            <span className="px-space-sm font-label-sm text-label-sm text-outline uppercase tracking-wider">
              Clinical Command
            </span>
            <nav className="flex flex-col gap-1 mt-space-xs">
              {navItems.map((item) => {
                const active = isCurrent(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-space-sm px-space-sm py-2 rounded-lg transition-colors ${
                      active
                        ? 'bg-primary-container text-on-primary font-semibold shadow-sm'
                        : 'text-on-surface-variant hover:bg-surface-container-low'
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-[20px] ${
                        active ? 'text-on-primary' : 'text-on-surface-variant'
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span className="font-label-md text-label-md">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Navigation Section 2: Intelligent Agents */}
          <div className="px-space-md pt-space-md">
            <span className="px-space-sm font-label-sm text-label-sm text-outline uppercase tracking-wider">
              Intelligent Agents
            </span>
            <nav className="flex flex-col gap-1 mt-space-xs">
              {agentItems.map((item) => {
                const active = isCurrent(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-space-sm px-space-sm py-2 rounded-lg transition-colors ${
                      active
                        ? 'bg-primary-container text-on-primary font-semibold shadow-sm'
                        : 'text-on-surface-variant hover:bg-surface-container-low'
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-[20px] ${
                        active ? 'text-on-primary' : 'text-on-surface-variant'
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span className="font-label-md text-label-md">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Navigation Section 3: Administration */}
          <div className="px-space-md pt-space-md mb-space-md">
            <span className="px-space-sm font-label-sm text-label-sm text-outline uppercase tracking-wider">
              Administration
            </span>
            <nav className="flex flex-col gap-1 mt-space-xs">
              {adminItems.map((item) => {
                const active = isCurrent(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-space-sm px-space-sm py-2 rounded-lg transition-colors ${
                      active
                        ? 'bg-primary-container text-on-primary font-semibold shadow-sm'
                        : 'text-on-surface-variant hover:bg-surface-container-low'
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-[20px] ${
                        active ? 'text-on-primary' : 'text-on-surface-variant'
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span className="font-label-md text-label-md">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Sidebar Footer User Info */}
        <div className="p-space-md border-t border-surface-container-high bg-surface-container-lowest/60">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-xs shrink-0">
                {user?.name ? user.name.charAt(0) : 'E'}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-md text-label-md text-on-surface truncate">
                  {user?.name || 'Dr. Elena Vance, MD'}
                </span>
                <span className="font-label-sm text-label-sm text-outline truncate">
                  {user?.staffId || 'ID #STF-4029'}
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out of Clinical Mesh"
              className="p-1.5 rounded-lg text-on-surface-variant hover:text-error hover:bg-surface-container-low transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
            </button>
          </div>
          <div className="text-[10px] text-outline font-mono truncate">
            {user?.hospital || 'National Hospital of Sri Lanka (NHSL)'}
          </div>
        </div>
      </aside>

      {/* TOP HEADER */}
      <header className="fixed top-0 left-72 right-0 h-16 bg-surface-container-lowest/80 backdrop-blur-md border-b border-surface-container-high z-40 px-margin flex items-center justify-between">
        <div className="flex items-center gap-space-lg">
          <div className="flex items-center gap-space-xs">
            <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Ward View:</span>
            <div className="flex items-center bg-surface-container-low p-0.5 rounded-lg text-label-sm font-label-sm">
              <button
                onClick={() => onWardChange && onWardChange('all')}
                className={`px-space-xs py-0.5 rounded transition-colors ${
                  activeWard === 'all'
                    ? 'bg-surface-container-lowest text-primary shadow-sm font-bold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
                type="button"
              >
                Combined
              </button>
              <button
                onClick={() => onWardChange && onWardChange('ETU Complex')}
                className={`px-space-xs py-0.5 rounded transition-colors ${
                  activeWard === 'ETU Complex'
                    ? 'bg-surface-container-lowest text-primary shadow-sm font-bold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
                type="button"
              >
                ETU Complex
              </button>
              <button
                onClick={() => onWardChange && onWardChange('Accident Ward')}
                className={`px-space-xs py-0.5 rounded transition-colors ${
                  activeWard === 'Accident Ward'
                    ? 'bg-surface-container-lowest text-primary shadow-sm font-bold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
                type="button"
              >
                Accident Ward
              </button>
            </div>
          </div>

          <div className="hidden xl:flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            <span>
              TWIN SYNC: <strong className="text-on-surface">99.8% LIVE</strong> (0.4s lag)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-space-md">
          {/* Role Pill */}
          <div className="flex items-center gap-space-xs bg-surface-container px-space-sm py-1 rounded-full">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Role:</span>
            <span className="font-label-sm text-label-sm text-primary font-bold">
              {user?.role === 'SYSTEM_ADMIN'
                ? 'System Administrator'
                : user?.role === 'HOSPITAL_ADMIN'
                ? 'Hospital Administrator'
                : user?.role === 'DOCTOR'
                ? 'ETU In-Charge / MO'
                : user?.role === 'NURSE'
                ? 'Charge Nurse / Triage Lead'
                : 'Clinical Staff'}
            </span>
          </div>

          {/* Notifications & Help Buttons */}
          <div className="flex items-center gap-space-xs">
            <button
              className="w-9 h-9 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
              type="button"
              title="Operational Alerts"
            >
              <span className="material-symbols-outlined text-[18px]">notifications</span>
            </button>
            <Link
              href="/"
              className="w-9 h-9 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
              title="Return to Public Portal"
            >
              <span className="material-symbols-outlined text-[18px]">public</span>
            </Link>
          </div>

          <div className="h-6 w-px bg-surface-container-high"></div>

          {/* User profile dropdown trigger */}
          <div className="flex items-center gap-space-sm">
            <div className="flex flex-col text-right hidden sm:flex">
              <span className="font-label-md text-label-md text-on-surface leading-tight">
                {user?.name || 'Dr. Elena Vance, MD'}
              </span>
              <span className="font-label-sm text-label-sm text-outline leading-tight">
                {user?.staffId || 'ID #STF-4029'}
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <div className="pl-72 pt-16">
        <main className="w-full bg-surface min-h-[calc(100vh-4rem)] px-margin py-space-lg">
          {children}
        </main>
      </div>
    </div>
  );
}


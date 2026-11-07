'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) setUser(data.user);
        else router.push('/auth/login');
      })
      .catch(() => router.push('/auth/login'))
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/auth/login');
  };

  return (
    <AppLayout>
      <div className="flex flex-col w-full space-y-space-lg max-w-4xl">
        <div className="flex items-center justify-between pb-space-sm border-b border-surface-container-high">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface">Staff Identity &amp; Terminal Profile</h1>
            <p className="font-body-sm text-body-sm text-outline mt-0.5">
              Hardened clinical workstation profile and cryptographic credential credentials
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-error-container text-on-error-container hover:bg-error/20 font-semibold text-xs transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span>Sign Out of Terminal</span>
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-outline">Loading credential profile...</div>
        ) : (
          <div className="space-y-space-md">
            {/* Identity Card */}
            <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container-high p-space-lg flex flex-col sm:flex-row items-start sm:items-center gap-space-md">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-2xl shrink-0">
                {user?.name?.charAt(0) || 'E'}
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">{user?.name}</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-primary-fixed text-on-primary-fixed font-bold">
                    {user?.role}
                  </span>
                </div>
                <div className="text-xs text-outline font-mono">
                  Staff ID: <strong>{user?.staffId}</strong> • Email: <strong>{user?.email}</strong>
                </div>
                <div className="text-xs text-on-surface-variant">
                  {user?.designation} • {user?.department}
                </div>
              </div>
            </div>

            {/* Institutional Deployment Metadata */}
            <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container-high p-space-lg">
              <span className="font-label-md text-label-md font-bold text-on-surface block mb-3">
                Institutional Deployment Information
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md text-xs">
                <div className="p-3 rounded-lg bg-surface-container-low flex flex-col">
                  <span className="text-outline uppercase text-[10px]">Hospital / Institution</span>
                  <span className="font-bold text-on-surface mt-1">{user?.hospital}</span>
                </div>
                <div className="p-3 rounded-lg bg-surface-container-low flex flex-col">
                  <span className="text-outline uppercase text-[10px]">Primary Operational Sector</span>
                  <span className="font-bold text-on-surface mt-1">{user?.preferredWorkArea}</span>
                </div>
                <div className="p-3 rounded-lg bg-surface-container-low flex flex-col">
                  <span className="text-outline uppercase text-[10px]">Account Clearance Status</span>
                  <span className="font-bold text-emerald-700 mt-1">{user?.status}</span>
                </div>
                <div className="p-3 rounded-lg bg-surface-container-low flex flex-col">
                  <span className="text-outline uppercase text-[10px]">Hardware Bound Session</span>
                  <span className="font-mono text-on-surface mt-1">12-Hour Shift Lease • HMAC-SHA256</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}


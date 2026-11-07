'use client';

import React from 'react';
import Link from 'next/link';

export default function AccessDeniedPage() {
  return (
    <main className="w-full min-h-screen bg-surface flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-surface-container-lowest p-8 rounded-xl shadow-xl border border-surface-container-high text-center">
        <div className="w-16 h-16 rounded-full bg-error-container text-on-error-container flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-[36px]">gpp_bad</span>
        </div>
        <span className="font-label-sm text-label-sm uppercase tracking-wider text-error font-bold block mb-1">
          Access Denied • Security Tier Restriction
        </span>
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">
          Administrative Privileges Required
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant mb-6 leading-relaxed">
          Your current authenticated staff role does not possess authorization to access this operational portal. Please
          contact the ETU In-Charge or System Administrator to request credential elevation.
        </p>
        <div className="flex flex-col gap-2">
          <Link
            href="/patients"
            className="w-full py-3 rounded-lg bg-primary-container text-on-primary font-semibold hover:bg-tertiary transition-colors shadow"
          >
            Return to Patient Records
          </Link>
          <Link
            href="/dashboard"
            className="w-full py-3 rounded-lg bg-surface-container-low text-on-surface font-semibold hover:bg-surface-container transition-colors"
          >
            Go to Operations Overview
          </Link>
        </div>
      </div>
    </main>
  );
}


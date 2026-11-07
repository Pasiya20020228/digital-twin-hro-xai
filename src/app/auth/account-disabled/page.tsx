'use client';

import React from 'react';
import Link from 'next/link';

export default function AccountDisabledPage() {
  return (
    <main className="w-full min-h-screen bg-surface flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-surface-container-lowest p-8 rounded-xl shadow-xl border border-surface-container-high text-center">
        <div className="w-16 h-16 rounded-full bg-error-container text-on-error-container flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-[36px]">block</span>
        </div>
        <span className="font-label-sm text-label-sm uppercase tracking-wider text-error font-bold block mb-1">
          Access Inactivated
        </span>
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">
          Account Status Disabled
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant mb-6 leading-relaxed">
          Your hospital credential status has been inactivated by System Security or Hospital Administration. For
          restoration of clinical mesh access, please report to the IT Directorate with your physical staff ID.
        </p>
        <div className="flex flex-col gap-2">
          <Link
            href="/auth/login"
            className="w-full py-3 rounded-lg bg-surface-container-low text-on-surface font-semibold hover:bg-surface-container transition-colors"
          >
            Return to Login Portal
          </Link>
        </div>
      </div>
    </main>
  );
}


'use client';

import React from 'react';
import Link from 'next/link';

export default function PendingApprovalPage() {
  return (
    <main className="w-full min-h-screen bg-surface flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-surface-container-lowest p-8 rounded-xl shadow-xl border border-surface-container-high text-center">
        <div className="w-16 h-16 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-[36px]">hourglass_top</span>
        </div>
        <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold block mb-1">
          Enrollment Under Verification
        </span>
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">
          Registration Pending Approval
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant mb-6 leading-relaxed">
          Your hospital registration has been logged successfully. Cryptographic clearance and role allocation are
          currently awaiting verification by the Lead Hospital Administrator or Medical Directorate.
        </p>
        <div className="flex flex-col gap-2">
          <Link
            href="/auth/login"
            className="w-full py-3 rounded-lg bg-primary-container text-on-primary font-semibold hover:bg-tertiary transition-colors shadow"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </main>
  );
}


'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [workEmail, setWorkEmail] = useState('');
  const [staffId, setStaffId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workEmail.trim()) {
      setFeedback({ type: 'error', message: 'Official NHSL work email is required.' });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: workEmail }),
      });
      const data = await res.json();

      setFeedback({
        type: 'success',
        message: data.message || 'Encrypted reset token dispatched to your gateway.',
      });

      setTimeout(() => {
        router.push('/auth/login');
      }, 4000);
    } catch {
      setFeedback({
        type: 'error',
        message: 'Network error connecting to security recovery service.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background font-body-md text-on-background min-h-screen">
      <main className="w-full min-h-screen bg-background flex items-center justify-center p-space-md sm:p-space-xl">
        <div className="relative w-full max-w-xl mx-auto flex flex-col gap-space-lg">
          {/* Top Authority Bar Indicator */}
          <div className="flex items-center justify-between px-space-sm">
            <div className="flex items-center gap-space-xs">
              <span className="inline-flex w-2 h-2 rounded-full bg-on-tertiary-container animate-pulse"></span>
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                Gatekeeper Node • E-204
              </span>
            </div>
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-body-sm text-outline">verified_user</span>
              <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
                ISO-27799 MedSec Certified
              </span>
            </div>
          </div>

          {/* Main Clinical Security Card */}
          <div className="bg-surface-container-lowest rounded-xl shadow-xl overflow-hidden border border-surface-container-high">
            {/* Hospital Branding & Security Header Strip */}
            <div className="bg-primary px-space-lg py-space-md flex items-center justify-between text-on-primary">
              <div className="flex items-center gap-space-md">
                <div className="w-8 h-8 rounded-lg bg-surface-container-lowest/10 flex items-center justify-center text-on-primary">
                  <span
                    className="material-symbols-outlined text-headline-sm"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    local_hospital
                  </span>
                </div>
                <div>
                  <div className="font-label-md text-label-md text-on-primary tracking-wider uppercase">
                    ETU Intelligence Systems
                  </div>
                  <div className="font-body-sm text-body-sm text-surface-container-highest/80">
                    Security &amp; Credential Recovery Console
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-space-sm py-0.5 rounded-full bg-surface-container-lowest/15 text-surface-container-highest">
                <span className="material-symbols-outlined text-body-sm">lock</span>
                <span className="font-label-sm text-label-sm uppercase">256-Bit SSL</span>
              </div>
            </div>

            <div className="p-space-lg sm:p-space-xl flex flex-col gap-space-lg">
              {/* Shield Icon & Title Block */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-space-md">
                <div className="w-14 h-14 rounded-xl bg-surface-container flex items-center justify-center text-secondary shadow-sm shrink-0">
                  <span
                    className="material-symbols-outlined text-[32px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    shield_lock
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">
                    NHSL Access Control Level 4
                  </span>
                  <h1 className="font-headline-lg text-headline-lg text-on-surface">
                    Reset Clinical Terminal Password
                  </h1>
                </div>
              </div>

              {/* Description */}
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Enter your registered NHSL staff email or medical officer identifier. A time-limited, encrypted reset
                authentication token will be dispatched to your hospital gateway.
              </p>

              {feedback && (
                <div
                  className={`p-space-sm rounded-lg text-body-sm font-body-sm flex items-start gap-2 ${
                    feedback.type === 'success'
                      ? 'bg-surface-container-high text-primary'
                      : 'bg-error-container text-on-error-container'
                  }`}
                >
                  <span className="material-symbols-outlined text-body-lg">
                    {feedback.type === 'success' ? 'check_circle' : 'error'}
                  </span>
                  <span>{feedback.message}</span>
                </div>
              )}

              {/* Input Form Section */}
              <form onSubmit={handleDispatch} className="flex flex-col gap-space-md" id="recoveryForm">
                <div className="flex flex-col gap-space-xs">
                  <div className="flex items-center justify-between">
                    <label className="font-label-lg text-label-lg text-on-surface" htmlFor="workEmail">
                      Official NHSL Work Email
                    </label>
                  </div>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-body-lg">
                      mail
                    </span>
                    <input
                      className="w-full h-12 pl-10 pr-4 rounded-lg bg-surface-container-lowest border border-outline-variant text-on-surface font-body-md text-body-md focus:bg-surface-container-low transition-all outline-none shadow-sm focus:border-primary"
                      id="workEmail"
                      placeholder="e.g. name@hospital.org"
                      type="email"
                      value={workEmail}
                      onChange={(e) => setWorkEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-space-xs">
                  <label className="font-label-lg text-label-lg text-on-surface" htmlFor="staffId">
                    SLMC Number or Staff Pin (Optional)
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-body-lg">
                      badge
                    </span>
                    <input
                      className="w-full h-12 pl-10 pr-4 rounded-lg bg-surface-container-lowest border border-outline-variant text-on-surface font-body-md text-body-md focus:bg-surface-container-low transition-all outline-none shadow-sm focus:border-primary"
                      id="staffId"
                      placeholder="e.g. STF-4029"
                      type="text"
                      value={staffId}
                      onChange={(e) => setStaffId(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 rounded-lg bg-primary-container hover:bg-tertiary text-on-primary font-label-lg text-label-lg transition-all shadow-md flex items-center justify-center gap-space-sm disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-body-lg">progress_activity</span>
                      <span>Dispatching Cryptographic Token...</span>
                    </>
                  ) : (
                    <>
                      <span>Dispatch Recovery Token</span>
                      <span className="material-symbols-outlined text-body-lg">send</span>
                    </>
                  )}
                </button>
              </form>

              {/* Navigation Back */}
              <div className="flex items-center justify-between pt-space-xs text-body-sm">
                <Link
                  href="/auth/login"
                  className="text-secondary font-semibold hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                  <span>Return to Clinical Sign In</span>
                </Link>
                <Link href="/" className="text-on-surface-variant hover:text-on-surface">
                  Public Homepage
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


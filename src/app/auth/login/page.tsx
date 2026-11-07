'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<'signin' | 'register'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);

  // Sign In Form States
  const [emailOrStaffId, setEmailOrStaffId] = useState('stf-4029@hospital.org');
  const [password, setPassword] = useState('doctor123');
  const [rememberWorkstation, setRememberWorkstation] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Registration Form States
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regStaffId, setRegStaffId] = useState('');
  const [regRole, setRegRole] = useState('Triage Medical Officer');
  const [regSector, setRegSector] = useState('ETU Red Zone / Resuscitation');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regAgree, setRegAgree] = useState(false);

  // Security Banner State
  const [securityBanner, setSecurityBanner] = useState<{
    show: boolean;
    type: 'pending' | 'timeout' | 'denied' | 'active_session' | 'error';
    message: string;
  }>({
    show: false,
    type: 'error',
    message: '',
  });

  // Forgot Password Modal
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetFeedback, setResetFeedback] = useState<string | null>(null);

  // Check URL params on load
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'register') {
      setActiveTab('register');
    }

    const errParam = searchParams.get('error');
    const msgParam = searchParams.get('message');
    if (errParam) {
      if (errParam === 'google_config_missing') {
        setSecurityBanner({
          show: true,
          type: 'denied',
          message:
            msgParam ||
            'Google Workspace SSO requires NEXT_PUBLIC_GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to be configured in .env.',
        });
      } else if (errParam === 'account_disabled') {
        setSecurityBanner({
          show: true,
          type: 'denied',
          message: 'Account Disabled: Clinical access credentials have been revoked by Hospital Administration.',
        });
      } else if (errParam === 'pending_approval') {
        setSecurityBanner({
          show: true,
          type: 'pending',
          message: 'Access Pending: Cryptographic clearance awaiting signature by ETU Administrator.',
        });
      } else {
        setSecurityBanner({
          show: true,
          type: 'error',
          message: msgParam || 'Authentication failed. Please verify credentials.',
        });
      }
    }
  }, [searchParams]);

  // Handle Login Submit
  const handleLoginSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!emailOrStaffId.trim() || !password.trim()) {
      setSecurityBanner({
        show: true,
        type: 'error',
        message: 'Please provide both Staff Hospital ID/Email and Passcode.',
      });
      return;
    }

    setIsSubmitting(true);
    setSecurityBanner({ show: false, type: 'error', message: '' });

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrStaffId, password, rememberWorkstation }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.status === 'DISABLED') {
          setSecurityBanner({
            show: true,
            type: 'denied',
            message: data.error,
          });
        } else if (data.status === 'PENDING') {
          setSecurityBanner({
            show: true,
            type: 'pending',
            message: data.error,
          });
        } else {
          setSecurityBanner({
            show: true,
            type: 'error',
            message: data.error || 'Invalid credentials. Clinical identity not recognized.',
          });
        }
        setIsSubmitting(false);
        return;
      }

      setSecurityBanner({
        show: true,
        type: 'active_session',
        message: `Session Initialized for ${data.user.name} (${data.user.role}). Redirecting to clinical workspace...`,
      });

      setTimeout(() => {
        router.push(data.redirectPath || '/dashboard');
      }, 700);
    } catch (err: any) {
      setSecurityBanner({
        show: true,
        type: 'error',
        message: 'Network error communicating with authentication mesh.',
      });
      setIsSubmitting(false);
    }
  };

  // Handle Register Submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!regAgree) {
      setSecurityBanner({
        show: true,
        type: 'error',
        message: 'Please review and accept the institutional safeguard guidelines acknowledgment.',
      });
      return;
    }

    if (!regFullName || !regEmail || !regStaffId || !regPassword) {
      setSecurityBanner({
        show: true,
        type: 'error',
        message: 'All fields marked with an asterisk are required.',
      });
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setSecurityBanner({
        show: true,
        type: 'error',
        message: 'Passcode and confirmation passcode do not match.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: regFullName,
          email: regEmail,
          staffId: regStaffId,
          role: regRole,
          designation: regRole,
          preferredWorkArea: regSector,
          password: regPassword,
          confirmPassword: regConfirmPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setSecurityBanner({
          show: true,
          type: 'error',
          message: data.error || 'Failed to complete registration.',
        });
        setIsSubmitting(false);
        return;
      }

      setSecurityBanner({
        show: true,
        type: 'active_session',
        message: `Enrollment submitted successfully for ${data.user.name}. Terminal session authorized.`,
      });

      setTimeout(() => {
        router.push(data.redirectPath || '/patients');
      }, 800);
    } catch {
      setSecurityBanner({
        show: true,
        type: 'error',
        message: 'Network error communicating with clinical registry.',
      });
      setIsSubmitting(false);
    }
  };

  // Quick Persona Select Helper
  const selectPersona = (role: 'physician' | 'nurse' | 'admin' | 'hospital_admin') => {
    setActiveTab('signin');
    if (role === 'physician') {
      setEmailOrStaffId('stf-4029@hospital.org');
      setPassword('doctor123');
    } else if (role === 'nurse') {
      setEmailOrStaffId('nurse@hospital.org');
      setPassword('nurse123');
    } else if (role === 'admin') {
      setEmailOrStaffId('sysadmin@hospital.org');
      setPassword('admin123');
    } else if (role === 'hospital_admin') {
      setEmailOrStaffId('hospadmin@hospital.org');
      setPassword('admin123');
    }
  };

  // Handle Forgot Password Challenge
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      setResetFeedback('Please provide your official work email.');
      return;
    }

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail }),
      });
      const data = await res.json();
      setResetFeedback(data.message || 'Reset token dispatched.');
      setTimeout(() => {
        setForgotModalOpen(false);
        setResetFeedback(null);
      }, 3000);
    } catch {
      setResetFeedback('Error connecting to credential recovery gateway.');
    }
  };

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface min-h-screen">
      <main className="w-full bg-surface min-h-screen flex items-center justify-center p-margin">
        <div className="flex flex-col w-full max-w-7xl mx-auto py-space-xl px-margin">
          <div className="relative w-full rounded-xl bg-surface-container-low shadow-xl p-space-lg lg:p-space-xl overflow-hidden">
            {/* Background Glows */}
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary-fixed/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-secondary-fixed/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col lg:flex-row gap-space-xl items-stretch">
              {/* Primary Column: Authentication Forms */}
              <div className="w-full lg:w-7/12 flex flex-col justify-between bg-surface-container-lowest rounded-lg p-space-lg shadow-sm">
                <div>
                  {/* Institution Header & Prototype Compliance Badge */}
                  <div className="flex flex-wrap items-center justify-between gap-space-sm mb-space-md">
                    <div className="flex items-center gap-space-xs">
                      <span
                        className="material-symbols-outlined text-primary text-headline-sm"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        local_hospital
                      </span>
                      <span className="font-label-lg text-label-lg text-primary tracking-tight">
                        ETU INTELLIGENCE MESH
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-space-sm py-0.5 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse"></span>
                      TRL-4 Prototype Platform
                    </span>
                  </div>

                  {/* Operational Headline */}
                  <div className="mb-space-lg">
                    <h1 className="font-headline-lg text-headline-lg text-on-surface">
                      Clinical Operational Digital Twin
                    </h1>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                      Accident Ward &amp; Emergency Treatment Unit (ETU) Telemetry Portal
                    </p>
                  </div>

                  {/* Navigation Segment Control (Sign In vs Register) */}
                  <div className="flex bg-surface-container-low p-1 rounded-lg mb-space-lg">
                    <button
                      className={`flex-1 py-space-sm px-space-md rounded-DEFAULT font-label-lg text-label-lg transition-all flex items-center justify-center gap-space-xs ${
                        activeTab === 'signin'
                          ? 'bg-primary-container text-on-primary shadow-sm'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                      id="tab-btn-signin"
                      onClick={() => setActiveTab('signin')}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-body-lg">verified_user</span>
                      <span>Institutional Sign In</span>
                    </button>
                    <button
                      className={`flex-1 py-space-sm px-space-md rounded-DEFAULT font-label-lg text-label-lg transition-all flex items-center justify-center gap-space-xs ${
                        activeTab === 'register'
                          ? 'bg-primary-container text-on-primary shadow-sm'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                      id="tab-btn-register"
                      onClick={() => setActiveTab('register')}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-body-lg">person_add</span>
                      <span>Register Account</span>
                    </button>
                  </div>

                  {/* Security State Banner */}
                  {securityBanner.show && (
                    <div
                      className={`mb-space-md p-space-sm rounded-lg font-body-sm text-body-sm flex items-start justify-between gap-space-xs ${
                        securityBanner.type === 'pending'
                          ? 'bg-secondary-fixed text-on-secondary-fixed'
                          : securityBanner.type === 'active_session'
                          ? 'bg-surface-container-high text-primary'
                          : 'bg-error-container text-on-error-container'
                      }`}
                      id="security-state-banner"
                    >
                      <div className="flex items-start gap-space-xs">
                        <span className="material-symbols-outlined text-body-lg" id="security-state-icon">
                          {securityBanner.type === 'pending'
                            ? 'hourglass_top'
                            : securityBanner.type === 'active_session'
                            ? 'verified'
                            : 'error'}
                        </span>
                        <div id="security-state-text">{securityBanner.message}</div>
                      </div>
                      <button
                        onClick={() => setSecurityBanner({ show: false, type: 'error', message: '' })}
                        className="text-on-surface-variant hover:text-on-surface"
                      >
                        <span className="material-symbols-outlined text-body-sm">close</span>
                      </button>
                    </div>
                  )}

                  {/* TAB 1: SIGN IN PANEL */}
                  {activeTab === 'signin' && (
                    <form onSubmit={handleLoginSubmit} className="flex flex-col space-y-space-md" id="panel-signin">
                      {/* Google Workspace Enterprise SSO */}
                      <a
                        href="/api/auth/google"
                        className="w-full py-space-sm px-space-md rounded-lg border border-outline-variant bg-surface-container-lowest hover:bg-surface-container-low transition-colors flex items-center justify-center gap-space-sm shadow-sm"
                        id="btn-google-sso"
                      >
                        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                          <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                          ></path>
                          <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                          ></path>
                          <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                            fill="#FBBC05"
                          ></path>
                          <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                            fill="#EA4335"
                          ></path>
                        </svg>
                        <div className="text-left">
                          <span className="font-label-md text-label-md text-on-surface block leading-tight">
                            Continue with Google Workspace
                          </span>
                          <span className="font-label-sm text-label-sm text-on-surface-variant block leading-tight">
                            Hospital Enterprise Single Sign-On (SSO)
                          </span>
                        </div>
                      </a>

                      {/* Divider */}
                      <div className="relative flex items-center justify-center my-space-sm">
                        <div className="w-full h-px bg-surface-container-high"></div>
                        <span className="absolute px-space-sm bg-surface-container-lowest font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                          or hospital credentials
                        </span>
                      </div>

                      {/* Email / Staff ID Input */}
                      <div>
                        <label className="block font-label-md text-label-md text-on-surface mb-space-xs" htmlFor="signin-email">
                          Staff Hospital ID or Email
                        </label>
                        <div className="relative flex items-center">
                          <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-body-lg">
                            badge
                          </span>
                          <input
                            className="w-full h-11 pl-10 pr-10 rounded-lg bg-surface-container-lowest border border-outline-variant text-on-surface font-body-md text-body-md focus:bg-surface-container-low transition-all outline-none shadow-sm focus:border-primary"
                            id="signin-email"
                            placeholder="e.g. STF-8821 or name@hospital.org"
                            type="text"
                            value={emailOrStaffId}
                            onChange={(e) => setEmailOrStaffId(e.target.value)}
                          />
                          <span
                            className="material-symbols-outlined absolute right-3 text-primary text-body-lg cursor-pointer"
                            title="Identity format verified"
                          >
                            check_circle
                          </span>
                        </div>
                      </div>

                      {/* Password Input */}
                      <div>
                        <div className="flex items-center justify-between mb-space-xs">
                          <label className="block font-label-md text-label-md text-on-surface" htmlFor="signin-password">
                            Digital Twin Passcode
                          </label>
                          <button
                            className="font-label-sm text-label-sm text-secondary hover:underline"
                            onClick={() => setForgotModalOpen(true)}
                            type="button"
                          >
                            Forgot Access Pass?
                          </button>
                        </div>
                        <div className="relative flex items-center">
                          <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-body-lg">
                            lock
                          </span>
                          <input
                            className="w-full h-11 pl-10 pr-10 rounded-lg bg-surface-container-lowest border border-outline-variant text-on-surface font-body-md text-body-md focus:bg-surface-container-low transition-all outline-none shadow-sm focus:border-primary"
                            id="signin-password"
                            placeholder="Clinical authentication token"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                          <button
                            className="absolute right-3 text-on-surface-variant hover:text-on-surface flex items-center justify-center"
                            onClick={() => setShowPassword(!showPassword)}
                            type="button"
                          >
                            <span className="material-symbols-outlined text-body-lg">
                              {showPassword ? 'visibility_off' : 'visibility'}
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* Workstation Checkbox */}
                      <div className="flex items-center gap-space-sm pt-space-xs">
                        <input
                          checked={rememberWorkstation}
                          onChange={(e) => setRememberWorkstation(e.target.checked)}
                          className="w-4 h-4 rounded text-primary focus:ring-0 cursor-pointer accent-primary"
                          id="remember-workstation"
                          type="checkbox"
                        />
                        <label
                          className="font-body-sm text-body-sm text-on-surface select-none cursor-pointer"
                          htmlFor="remember-workstation"
                        >
                          Retain authenticated state on this hardened terminal (12h shift session)
                        </label>
                      </div>

                      {/* Action Button */}
                      <button
                        className="w-full h-12 rounded-lg bg-primary-container hover:bg-tertiary text-on-primary font-label-lg text-label-lg transition-all shadow-md flex items-center justify-center gap-space-sm disabled:opacity-50"
                        id="btn-submit-signin"
                        type="submit"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="material-symbols-outlined animate-spin text-body-lg">progress_activity</span>
                            <span>Negotiating Cryptographic Mesh...</span>
                          </>
                        ) : (
                          <>
                            <span id="signin-btn-text">Sign In to Clinical Twin Mesh</span>
                            <span className="material-symbols-outlined text-body-lg" id="signin-btn-icon">
                              arrow_forward
                            </span>
                          </>
                        )}
                      </button>

                      {/* Persona Quick Testing Switcher */}
                      <div className="pt-space-sm border-t border-surface-container-high">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-outline block mb-1">
                          Academic Prototype Quick Personas:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          <button
                            type="button"
                            onClick={() => selectPersona('physician')}
                            className="px-2 py-1 text-xs rounded bg-surface-container-low hover:bg-surface-container text-on-surface-variant border border-surface-container-high transition-colors"
                          >
                            🩺 Doctor (Dr. Vance)
                          </button>
                          <button
                            type="button"
                            onClick={() => selectPersona('nurse')}
                            className="px-2 py-1 text-xs rounded bg-surface-container-low hover:bg-surface-container text-on-surface-variant border border-surface-container-high transition-colors"
                          >
                            🩹 Charge Nurse (Sr. Elena)
                          </button>
                          <button
                            type="button"
                            onClick={() => selectPersona('hospital_admin')}
                            className="px-2 py-1 text-xs rounded bg-surface-container-low hover:bg-surface-container text-on-surface-variant border border-surface-container-high transition-colors"
                          >
                            🏥 Hospital Admin
                          </button>
                          <button
                            type="button"
                            onClick={() => selectPersona('admin')}
                            className="px-2 py-1 text-xs rounded bg-surface-container-low hover:bg-surface-container text-on-surface-variant border border-surface-container-high transition-colors"
                          >
                            🛡️ System Admin
                          </button>
                        </div>
                      </div>
                    </form>
                  )}

                  {/* TAB 2: REGISTER ACCOUNT FORM PANEL */}
                  {activeTab === 'register' && (
                    <form onSubmit={handleRegisterSubmit} className="flex flex-col space-y-space-md" id="panel-register">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                        <div>
                          <label className="block font-label-md text-label-md text-on-surface mb-space-xs" htmlFor="reg-fullname">
                            Full Name &amp; Credentials
                          </label>
                          <div className="relative flex items-center">
                            <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-body-lg">
                              person
                            </span>
                            <input
                              className="w-full h-11 pl-10 pr-3 rounded-lg bg-surface-container-lowest border border-outline-variant text-on-surface font-body-md text-body-md focus:bg-surface-container-low transition-all outline-none shadow-sm focus:border-primary"
                              id="reg-fullname"
                              placeholder="Dr. Sarah Lin, MD, FACEP"
                              type="text"
                              value={regFullName}
                              onChange={(e) => setRegFullName(e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-label-md text-label-md text-on-surface mb-space-xs" htmlFor="reg-email">
                            Official Hospital Email
                          </label>
                          <div className="relative flex items-center">
                            <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-body-lg">
                              mail
                            </span>
                            <input
                              className="w-full h-11 pl-10 pr-3 rounded-lg bg-surface-container-lowest border border-outline-variant text-on-surface font-body-md text-body-md focus:bg-surface-container-low transition-all outline-none shadow-sm focus:border-primary"
                              id="reg-email"
                              placeholder="name@hospital.org"
                              type="email"
                              value={regEmail}
                              onChange={(e) => setRegEmail(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                        <div>
                          <label className="block font-label-md text-label-md text-on-surface mb-space-xs" htmlFor="reg-staffid">
                            Staff Identifier / SLMC License No
                          </label>
                          <div className="relative flex items-center">
                            <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-body-lg">
                              pin
                            </span>
                            <input
                              className="w-full h-11 pl-10 pr-3 rounded-lg bg-surface-container-lowest border border-outline-variant text-on-surface font-body-md text-body-md focus:bg-surface-container-low transition-all outline-none shadow-sm focus:border-primary"
                              id="reg-staffid"
                              placeholder="STF-9942 or SLMC-48211"
                              type="text"
                              value={regStaffId}
                              onChange={(e) => setRegStaffId(e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-label-md text-label-md text-on-surface mb-space-xs" htmlFor="reg-role">
                            Institutional Clinical Role
                          </label>
                          <div className="relative flex items-center">
                            <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-body-lg">
                              assignment_ind
                            </span>
                            <select
                              className="w-full h-11 pl-10 pr-8 rounded-lg bg-surface-container-lowest border border-outline-variant text-on-surface font-body-md text-body-md focus:bg-surface-container-low transition-all outline-none shadow-sm cursor-pointer focus:border-primary"
                              id="reg-role"
                              value={regRole}
                              onChange={(e) => setRegRole(e.target.value)}
                            >
                              <option value="Consultant Emergency Physician">Consultant Emergency Physician</option>
                              <option value="ETU In-Charge Medical Officer">ETU In-Charge Medical Officer</option>
                              <option value="Triage Medical Officer">Triage Medical Officer</option>
                              <option value="Senior Nursing Sister / Charge Nurse">Senior Nursing Sister / Charge Nurse</option>
                              <option value="Trauma Resus Nurse">Trauma Resus Nurse</option>
                              <option value="Unit Data Analyst / Bio-Engineer">Unit Data Analyst / Bio-Engineer</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block font-label-md text-label-md text-on-surface mb-space-xs" htmlFor="reg-sector">
                          Primary Operational Sector
                        </label>
                        <select
                          className="w-full h-11 px-3 rounded-lg bg-surface-container-lowest border border-outline-variant text-on-surface font-body-md text-body-md focus:bg-surface-container-low transition-all outline-none shadow-sm cursor-pointer focus:border-primary"
                          id="reg-sector"
                          value={regSector}
                          onChange={(e) => setRegSector(e.target.value)}
                        >
                          <option value="ETU Red Zone / Resuscitation">ETU Red Zone / Resuscitation (6 Critical Beds)</option>
                          <option value="ETU Amber Zone / High Dependency">ETU Amber Zone / High Dependency (10 Monitored Beds)</option>
                          <option value="ETU Yellow Zone / Observation">ETU Yellow Zone / Observation (16 Acute Beds)</option>
                          <option value="Accident Ward Acute Trauma">Accident Ward Acute Trauma (18 Beds)</option>
                          <option value="Colombo Regional Ops Command">Colombo Regional Ops Command / Telemetry Desk</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                        <div>
                          <label className="block font-label-md text-label-md text-on-surface mb-space-xs" htmlFor="reg-password">
                            Create Passcode
                          </label>
                          <div className="relative flex items-center">
                            <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-body-lg">
                              lock
                            </span>
                            <input
                              className="w-full h-11 pl-10 pr-10 rounded-lg bg-surface-container-lowest border border-outline-variant text-on-surface font-body-md text-body-md focus:bg-surface-container-low transition-all outline-none shadow-sm focus:border-primary"
                              id="reg-password"
                              placeholder="Minimum 6 characters"
                              type={showRegPassword ? 'text' : 'password'}
                              value={regPassword}
                              onChange={(e) => setRegPassword(e.target.value)}
                              required
                            />
                            <button
                              className="absolute right-3 text-on-surface-variant hover:text-on-surface"
                              onClick={() => setShowRegPassword(!showRegPassword)}
                              type="button"
                            >
                              <span className="material-symbols-outlined text-body-lg">
                                {showRegPassword ? 'visibility_off' : 'visibility'}
                              </span>
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block font-label-md text-label-md text-on-surface mb-space-xs" htmlFor="reg-confirm-password">
                            Confirm Passcode
                          </label>
                          <div className="relative flex items-center">
                            <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-body-lg">
                              lock_reset
                            </span>
                            <input
                              className="w-full h-11 pl-10 pr-10 rounded-lg bg-surface-container-lowest border border-outline-variant text-on-surface font-body-md text-body-md focus:bg-surface-container-low transition-all outline-none shadow-sm focus:border-primary"
                              id="reg-confirm-password"
                              placeholder="Confirm chosen passcode"
                              type={showRegConfirmPassword ? 'text' : 'password'}
                              value={regConfirmPassword}
                              onChange={(e) => setRegConfirmPassword(e.target.value)}
                              required
                            />
                            <button
                              className="absolute right-3 text-on-surface-variant hover:text-on-surface"
                              onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                              type="button"
                            >
                              <span className="material-symbols-outlined text-body-lg">
                                {showRegConfirmPassword ? 'visibility_off' : 'visibility'}
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-space-sm pt-space-xs">
                        <input
                          checked={regAgree}
                          onChange={(e) => setRegAgree(e.target.checked)}
                          className="mt-1 w-4 h-4 rounded text-primary focus:ring-0 cursor-pointer accent-primary"
                          id="reg-agree"
                          type="checkbox"
                          required
                        />
                        <label className="font-body-sm text-body-sm text-on-surface select-none cursor-pointer" htmlFor="reg-agree">
                          I certify that I am a licensed healthcare professional or verified researcher. I acknowledge that this
                          platform operates under clinical human-in-the-loop oversight and will adhere to NHSL patient confidentiality.
                        </label>
                      </div>

                      <button
                        className="w-full h-12 rounded-lg bg-primary-container hover:bg-tertiary text-on-primary font-label-lg text-label-lg transition-all shadow-md flex items-center justify-center gap-space-sm disabled:opacity-50"
                        id="btn-submit-register"
                        type="submit"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="material-symbols-outlined animate-spin text-body-lg">progress_activity</span>
                            <span>Enrolling into Clinical Registry...</span>
                          </>
                        ) : (
                          <>
                            <span>Submit Institutional Enrollment</span>
                            <span className="material-symbols-outlined text-body-lg">app_registration</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>

                {/* Footer Security Badges */}
                <div className="mt-space-lg pt-space-md border-t border-surface-container-high flex flex-wrap items-center justify-between text-outline gap-space-sm">
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-body-sm">shield</span>
                    <span className="font-label-sm text-label-sm uppercase">256-Bit TLS Hardware Bound</span>
                  </div>
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-body-sm">health_and_safety</span>
                    <span className="font-label-sm text-label-sm uppercase">NHSL Colombo Command</span>
                  </div>
                </div>
              </div>

              {/* Secondary Column: Telemetry & Twin Status Overview */}
              <div className="w-full lg:w-5/12 flex flex-col justify-between space-y-space-md">
                <div className="p-space-lg rounded-lg bg-surface-container-lowest shadow-sm flex flex-col gap-space-md">
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md uppercase tracking-wider text-outline">
                      Real-Time Operational Twin Status
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-tertiary-fixed text-on-tertiary font-bold">
                      LIVE
                    </span>
                  </div>

                  {/* Micro-Stats Grid */}
                  <div className="grid grid-cols-2 gap-space-sm">
                    <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col">
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Bed Mesh In-Unit</span>
                      <span className="font-headline-sm text-headline-sm text-primary font-bold">38 / 44 Beds</span>
                      <span className="font-body-sm text-body-sm text-outline mt-0.5">86% Occupancy Rate</span>
                    </div>

                    <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col">
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Telemetry Latency</span>
                      <span className="font-headline-sm text-headline-sm text-secondary font-bold">0.4 sec</span>
                      <span className="font-body-sm text-body-sm text-outline mt-0.5">SimPy Discrete Engine</span>
                    </div>

                    <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col">
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Resus Intake</span>
                      <span className="font-headline-sm text-headline-sm text-primary font-bold">5 / 6 Beds</span>
                      <span className="font-body-sm text-body-sm text-outline mt-0.5">Cat 1 Life Support</span>
                    </div>

                    <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col">
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Duty Staff</span>
                      <span className="font-headline-sm text-headline-sm text-tertiary font-bold">8 MO / 18 RN</span>
                      <span className="font-body-sm text-body-sm text-outline mt-0.5">Afternoon Shift</span>
                    </div>
                  </div>

                  {/* AI Multi-Agent Mesh Telemetry */}
                  <div className="p-space-sm rounded-lg bg-surface-container border border-surface-container-high flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold text-on-surface">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
                        Agent 1 (Demand Forecaster)
                      </span>
                      <span className="font-mono text-primary font-bold">XGBoost + SHAP</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-semibold text-on-surface">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                        Agent 2 (Resource Telemetry)
                      </span>
                      <span className="font-mono text-secondary font-bold">40 Beds Monitored</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-semibold text-on-surface">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
                        Agent 3 (HITL Coordinator)
                      </span>
                      <span className="font-mono text-tertiary font-bold">OR-Tools MILP</span>
                    </div>
                  </div>
                </div>

                {/* Role-Based Access Tiers preview */}
                <div className="p-space-lg rounded-lg bg-surface-container-lowest shadow-sm flex flex-col gap-space-sm">
                  <span className="font-label-md text-label-md uppercase tracking-wider text-outline">
                    Role-Based Access Tiers (RBAC)
                  </span>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2 rounded bg-surface-container-low">
                      <div>
                        <span className="font-bold text-on-surface block">Doctor / ETU In-Charge</span>
                        <span className="text-on-surface-variant">Triage intake, bed assign, clinical discharge</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-primary-fixed text-on-primary-fixed font-bold">
                        TIER 1
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded bg-surface-container-low">
                      <div>
                        <span className="font-bold text-on-surface block">Nurse / Triage Lead</span>
                        <span className="text-on-surface-variant">Arrival registration, vital signs, lounge transfer</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-secondary-fixed text-on-secondary-fixed font-bold">
                        TIER 2
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded bg-surface-container-low">
                      <div>
                        <span className="font-bold text-on-surface block">Hospital / System Admin</span>
                        <span className="text-on-surface-variant">Dataset CSV import, user management, audit trail</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-tertiary-fixed text-on-tertiary-fixed font-bold">
                        ADMIN
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl max-w-md w-full p-6 relative border border-surface-container-high">
            <button
              onClick={() => setForgotModalOpen(false)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-body-lg">close</span>
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-on-primary">
                <span className="material-symbols-outlined">lock_reset</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">Reset Access Pass</h3>
                <p className="text-xs text-outline">Encrypted token recovery protocol</p>
              </div>
            </div>

            <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">
              Enter your registered NHSL hospital email or staff ID. An encrypted authorization token will be dispatched to your hospital gateway.
            </p>

            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">Official Hospital Email</label>
                <input
                  type="email"
                  placeholder="name@hospital.org"
                  className="w-full h-11 px-3 rounded-lg border border-outline-variant bg-surface-container-low focus:bg-surface-container-lowest outline-none text-sm"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                />
              </div>

              {resetFeedback && (
                <div className="p-2 rounded bg-surface-container text-xs text-primary font-medium">
                  {resetFeedback}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-on-surface-variant hover:bg-surface-container-low"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-primary text-on-primary hover:bg-primary-container shadow"
                >
                  Dispatch Token
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface flex items-center justify-center text-outline">Loading Clinical Gateway...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}


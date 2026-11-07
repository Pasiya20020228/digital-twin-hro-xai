'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import Link from 'next/link';

export default function DashboardOverviewPage() {
  const [metrics, setMetrics] = useState<any>({
    totalArrivalsToday: 46,
    activeInUnit: 38,
    awaitingStepdown: 7,
    dischargesToday: 39,
    triageToBedAvgMins: 14,
    etuActive: 22,
    accidentActive: 16,
    capacity: 44,
  });

  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeZone, setActiveZone] = useState('ALL');

  useEffect(() => {
    Promise.all([
      fetch('/api/patients'),
      fetch('/api/recommendations'),
    ])
      .then(async ([patRes, recRes]) => {
        const patData = await patRes.json();
        const recData = await recRes.json();
        if (patData.metrics) setMetrics(patData.metrics);
        if (recData.recommendations) setRecommendations(recData.recommendations);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Handle Recommendation Decision
  const handleRecDecision = async (id: string, decision: 'APPROVED' | 'REJECTED') => {
    try {
      const res = await fetch('/api/recommendations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, decision }),
      });
      const data = await res.json();
      if (data.success) {
        setRecommendations((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: decision } : r))
        );
      }
    } catch {
      alert('Error updating recommendation status');
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col w-full space-y-space-lg">
        {/* Top Operational Command Strip */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm pb-space-sm border-b border-surface-container-high">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary-container animate-pulse"></span>
              <h1 className="font-headline-lg text-headline-lg text-on-surface">ETU Operations Overview</h1>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-surface-container-low text-primary">
                v3.4 LIVE
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-outline mt-0.5">
              National Hospital of Sri Lanka (NHSL), Colombo • 40-Bed Acute Care Discrete Operational Twin
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/patients"
              className="px-4 py-2 rounded-lg bg-primary-container text-on-primary font-semibold text-xs hover:bg-tertiary transition-colors shadow flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">person_add</span>
              <span>Register Patient</span>
            </Link>
            <Link
              href="/discharge"
              className="px-4 py-2 rounded-lg bg-secondary text-on-secondary font-semibold text-xs hover:bg-secondary-container hover:text-on-secondary-container transition-colors shadow flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">output</span>
              <span>Record Discharge</span>
            </Link>
          </div>
        </div>

        {/* Real-time Summary Counters Bento */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-gutter">
          <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm border border-surface-container-high flex flex-col justify-between">
            <div className="flex items-center justify-between text-outline">
              <span className="font-label-sm text-label-sm uppercase tracking-wider">Today's Arrivals</span>
              <span className="material-symbols-outlined text-[18px] text-primary">sensor_door</span>
            </div>
            <div className="mt-space-sm">
              <span className="font-headline-xl text-headline-xl text-on-surface font-bold">
                {metrics.totalArrivalsToday}
              </span>
              <span className="text-xs text-primary font-semibold ml-2">+8 vs yesterday</span>
            </div>
            <span className="text-[11px] text-outline mt-1 block">Rolling 24h inflow</span>
          </div>

          <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm border border-surface-container-high flex flex-col justify-between">
            <div className="flex items-center justify-between text-outline">
              <span className="font-label-sm text-label-sm uppercase tracking-wider">Active Patients</span>
              <span className="material-symbols-outlined text-[18px] text-tertiary">bed</span>
            </div>
            <div className="mt-space-sm">
              <span className="font-headline-xl text-headline-xl text-primary font-bold">
                {metrics.activeInUnit}
              </span>
              <span className="text-xs text-outline ml-2">/ 44 Beds</span>
            </div>
            <span className="text-[11px] text-on-surface-variant mt-1 block">
              {metrics.etuActive} ETU • {metrics.accidentActive} Accident Ward
            </span>
          </div>

          <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm border border-surface-container-high flex flex-col justify-between">
            <div className="flex items-center justify-between text-outline">
              <span className="font-label-sm text-label-sm uppercase tracking-wider">Awaiting Step-down</span>
              <span className="material-symbols-outlined text-[18px] text-secondary">transfer_within_a_station</span>
            </div>
            <div className="mt-space-sm">
              <span className="font-headline-xl text-headline-xl text-secondary font-bold">
                {metrics.awaitingStepdown}
              </span>
              <span className="text-xs text-secondary font-semibold ml-2">Pending Inpatient Beds</span>
            </div>
            <span className="text-[11px] text-outline mt-1 block">Mean allocation lag: ~18m</span>
          </div>

          <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm border border-surface-container-high flex flex-col justify-between">
            <div className="flex items-center justify-between text-outline">
              <span className="font-label-sm text-label-sm uppercase tracking-wider">Discharges Today</span>
              <span className="material-symbols-outlined text-[18px] text-primary-container">output</span>
            </div>
            <div className="mt-space-sm">
              <span className="font-headline-xl text-headline-xl text-on-surface font-bold">
                {metrics.dischargesToday}
              </span>
              <span className="text-xs text-primary font-semibold ml-2">↑ 94% on target</span>
            </div>
            <span className="text-[11px] text-outline mt-1 block">32 Home / 7 Ward Transfers</span>
          </div>

          <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm border border-surface-container-high flex flex-col justify-between">
            <div className="flex items-center justify-between text-outline">
              <span className="font-label-sm text-label-sm uppercase tracking-wider">Triage-to-Bed Avg</span>
              <span className="material-symbols-outlined text-[18px] text-primary">timer</span>
            </div>
            <div className="mt-space-sm">
              <span className="font-headline-xl text-headline-xl text-primary font-bold">
                {metrics.triageToBedAvgMins}
              </span>
              <span className="text-sm text-primary font-semibold ml-1">mins</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-outline mt-1">
              <span>Standard: ≤ 20m</span>
              <span className="text-tertiary font-bold">OPTIMAL</span>
            </div>
          </div>
        </div>

        {/* Main Floorplan & Intelligent Telemetry Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
          {/* Bed Mesh Digital Twin 2D Orthographic Grid (8 cols) */}
          <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container-high p-space-md">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container-high mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">view_in_ar</span>
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    ETU Bed Mesh &amp; Orthographic Floorplan
                  </h3>
                  <span className="text-xs text-outline">Real-time physiological sensor telemetry</span>
                </div>
              </div>

              {/* Zone Filter Buttons */}
              <div className="flex bg-surface-container-low p-0.5 rounded-lg text-xs font-semibold">
                {['ALL', 'RESUS', 'AMBER', 'YELLOW', 'ACCIDENT'].map((z) => (
                  <button
                    key={z}
                    onClick={() => setActiveZone(z)}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      activeZone === z
                        ? 'bg-surface-container-lowest text-primary shadow-sm font-bold'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {z}
                  </button>
                ))}
              </div>
            </div>

            {/* Zone 1: Resuscitation Suite (Red Zone / Cat 1) */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-error flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-error animate-ping"></span>
                  Resuscitation Suite (Cat 1 — Immediate Life Support)
                </span>
                <span className="text-xs font-mono font-semibold text-outline">5/6 Occupied</span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {['RESUS-01', 'RESUS-02', 'RESUS-03', 'RESUS-04', 'RESUS-05', 'RESUS-06'].map((bed, idx) => {
                  const isOccupied = idx < 5;
                  return (
                    <div
                      key={bed}
                      className={`p-2.5 rounded-lg border text-center transition-all ${
                        isOccupied
                          ? 'bg-error-container/40 border-error/40 text-on-error-container'
                          : 'bg-surface-container-low border-surface-container-high text-outline'
                      }`}
                    >
                      <span className="text-[10px] font-mono uppercase block font-bold">{bed}</span>
                      <span className="text-xs font-semibold block mt-1">
                        {isOccupied ? 'VENT ACTIVE' : 'VACANT'}
                      </span>
                      <span className="text-[10px] font-mono text-outline block mt-0.5">
                        {isOccupied ? 'PT-2026-0042' : 'Cleaned'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Zone 2: Amber Critical Care Area (Cat 2) */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  Critical Care Area (Amber Zone / Cat 2 — &lt;10 min)
                </span>
                <span className="text-xs font-mono font-semibold text-outline">8/10 Occupied</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {Array.from({ length: 10 }).map((_, i) => {
                  const isOccupied = i < 8;
                  const code = `ETU-AMB-${(i + 1).toString().padStart(2, '0')}`;
                  return (
                    <div
                      key={code}
                      className={`p-2 rounded-lg border text-center ${
                        isOccupied
                          ? 'bg-amber-50 border-amber-300 text-amber-900'
                          : 'bg-surface-container-low border-surface-container-high text-outline'
                      }`}
                    >
                      <span className="text-[10px] font-mono block font-bold">{code}</span>
                      <span className="text-xs font-semibold block">{isOccupied ? 'OCCUPIED' : 'READY'}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Zone 3: Accident Ward Acute Casualties */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  Accident Ward (Trauma Intake &amp; Observation)
                </span>
                <span className="text-xs font-mono font-semibold text-outline">16/18 Occupied</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                {Array.from({ length: 12 }).map((_, i) => {
                  const isOccupied = i < 10;
                  const code = `ACC-BAY-${(i + 1).toString().padStart(2, '0')}`;
                  return (
                    <div
                      key={code}
                      className={`p-2 rounded-lg border text-center ${
                        isOccupied
                          ? 'bg-surface-container border-primary/30 text-on-surface'
                          : 'bg-surface-container-low border-surface-container-high text-outline'
                      }`}
                    >
                      <span className="text-[10px] font-mono block font-bold">{code}</span>
                      <span className="text-xs font-semibold block">{isOccupied ? 'IN USE' : 'VACANT'}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: AI Recommendations & Operational Alerts (4 cols) */}
          <div className="lg:col-span-4 space-y-space-md">
            {/* AI Agent 3 Recommendation Review Card */}
            <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container-high p-space-md">
              <div className="flex items-center justify-between pb-2 border-b border-surface-container-high mb-3">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-[20px]">psychology</span>
                  <span className="font-label-md text-label-md text-on-surface font-bold">
                    Agent 3 • HITL Advisories
                  </span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-container-low text-primary font-bold">
                  OR-Tools MILP
                </span>
              </div>

              {recommendations.length === 0 ? (
                <div className="py-4 text-center text-outline text-xs">No pending recommendations.</div>
              ) : (
                <div className="space-y-3">
                  {recommendations.slice(0, 2).map((rec) => (
                    <div
                      key={rec.id}
                      className="p-3 rounded-lg bg-surface-container-low border border-surface-container-high flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-primary font-bold">{rec.recommendationCode}</span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            rec.status === 'APPROVED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : rec.status === 'REJECTED'
                              ? 'bg-error-container text-on-error-container'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {rec.status}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-on-surface">{rec.action}</span>
                      <p className="text-[11px] text-on-surface-variant leading-relaxed">{rec.rationale}</p>

                      {rec.status === 'PENDING' && (
                        <div className="flex items-center justify-end gap-2 pt-1 border-t border-surface-container-high">
                          <button
                            onClick={() => handleRecDecision(rec.id, 'REJECTED')}
                            className="px-2.5 py-1 rounded text-xs font-semibold text-error hover:bg-surface-container"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleRecDecision(rec.id, 'APPROVED')}
                            className="px-2.5 py-1 rounded text-xs font-semibold bg-primary-container text-on-primary hover:bg-primary shadow-sm"
                          >
                            Approve Shift
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Operational Alerts Feed */}
            <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container-high p-space-md">
              <div className="flex items-center justify-between pb-2 border-b border-surface-container-high mb-3">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-secondary text-[20px]">crisis_alert</span>
                  <span className="font-label-md text-label-md text-on-surface font-bold">Telemetry Alert Stream</span>
                </div>
                <span className="text-[10px] text-outline font-mono">LIVE FEED</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-error-container/30 border border-error/20 flex items-start gap-2">
                  <span className="material-symbols-outlined text-error text-[18px]">warning</span>
                  <div>
                    <span className="font-bold text-error block">Resus Capacity Alert</span>
                    <span className="text-on-surface-variant text-[11px]">
                      Suite occupancy reached 83% (5/6 acute beds occupied). Step-down protocol recommended.
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-surface-container-low border border-surface-container-high flex items-start gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px]">sync</span>
                  <div>
                    <span className="font-bold text-on-surface block">Digital Twin SimPy Node</span>
                    <span className="text-on-surface-variant text-[11px]">
                      Queue simulation engine synchronized with 40-bed ward matrix (0.4s lag).
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-2">
                  <span className="material-symbols-outlined text-amber-700 text-[18px]">flood</span>
                  <div>
                    <span className="font-bold text-amber-800 block">Surge Analysis Trigger</span>
                    <span className="text-on-surface-variant text-[11px]">
                      Kelani River high-water advisory: Stage 2 surge readiness activated for Colombo catchment.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}


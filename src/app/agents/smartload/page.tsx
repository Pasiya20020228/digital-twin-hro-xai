'use client';

import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';

export default function SmartloadAgentPage() {
  const sectors = [
    { name: 'ETU Resuscitation Suite', nurses: 4, patients: 5, weightedLoad: 20.0, targetLoad: 16.0, status: 'HIGH TENSION' },
    { name: 'ETU Amber Zone (Critical)', nurses: 6, patients: 8, weightedLoad: 20.0, targetLoad: 22.0, status: 'BALANCED' },
    { name: 'ETU Yellow Zone (Urgent)', nurses: 5, patients: 13, weightedLoad: 15.6, targetLoad: 18.0, status: 'BALANCED' },
    { name: 'Accident Ward Acute Casualty', nurses: 3, patients: 16, weightedLoad: 19.2, targetLoad: 14.0, status: 'OVERLOAD' },
  ];

  return (
    <AppLayout>
      <div className="flex flex-col w-full space-y-space-lg">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm pb-space-sm border-b border-surface-container-high">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary">
                <span className="material-symbols-outlined text-[20px]">balance</span>
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-headline-lg text-headline-lg text-on-surface">Agent 5 • SMARTLOAD</h1>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-primary-fixed text-on-primary-fixed font-bold">
                    Acuity Workload Balancing
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-outline">
                  Dynamic nursing and physician workload distribution weighted by patient physiological acuity scores
                </p>
              </div>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded text-xs font-mono bg-surface-container text-primary font-semibold">
            Shift: Afternoon (14:00 - 20:00)
          </span>
        </div>

        {/* Sectors Workload Bento */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {sectors.map((s) => (
            <div
              key={s.name}
              className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container-high p-space-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-label-sm text-label-sm font-bold text-on-surface truncate">{s.name}</span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      s.status === 'OVERLOAD'
                        ? 'bg-error-container text-on-error-container'
                        : s.status === 'HIGH TENSION'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {s.status}
                  </span>
                </div>

                <div className="space-y-1.5 my-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-outline">Assigned Nurses:</span>
                    <span className="font-bold font-mono text-on-surface">{s.nurses} RNs</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-outline">Active Patients:</span>
                    <span className="font-bold font-mono text-on-surface">{s.patients} Pt.</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-outline">Acuity Load Index:</span>
                    <span className="font-bold font-mono text-primary">{s.weightedLoad} pts</span>
                  </div>
                </div>

                <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      s.status === 'OVERLOAD'
                        ? 'bg-error'
                        : s.status === 'HIGH TENSION'
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, (s.weightedLoad / s.targetLoad) * 80)}%` }}
                  ></div>
                </div>
              </div>

              <div className="pt-space-sm border-t border-surface-container-high text-[11px] text-outline mt-3">
                Target Cap: {s.targetLoad} pts
              </div>
            </div>
          ))}
        </div>

        {/* Workload Recommendation Banner */}
        <div className="p-space-md rounded-xl bg-surface-container-lowest border border-surface-container-high flex items-center justify-between shadow-sm text-xs">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-secondary text-[24px]">swap_calls</span>
            <div>
              <span className="font-bold text-on-surface block">SMARTLOAD Rebalancing Opportunity</span>
              <span className="text-on-surface-variant">
                Recommend temporarily floating 1 RN from ETU Yellow Zone to Accident Ward Acute Casualty to normalize 1:5.3
                nurse-to-patient ratio.
              </span>
            </div>
          </div>
          <button
            onClick={() => alert('SMARTLOAD shift recommendation forwarded to Charge Nurse console.')}
            className="px-3 py-1.5 rounded-lg bg-primary-container text-on-primary font-semibold hover:bg-tertiary transition-colors shadow-sm shrink-0"
          >
            Forward to Lead Sister
          </button>
        </div>
      </div>
    </AppLayout>
  );
}


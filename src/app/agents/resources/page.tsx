'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';

export default function ResourceMonitoringAgentPage() {
  const [beds, setBeds] = useState<any[]>([]);
  const [equipment, setEquipment] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Generate simulated bed telemetry for 40 NHSL beds
    const simulatedBeds = [
      ...Array.from({ length: 6 }).map((_, i) => ({
        code: `RESUS-0${i + 1}`,
        zone: 'Red Zone / Cat 1',
        type: 'Resuscitation Bed',
        status: i < 5 ? 'OCCUPIED' : 'AVAILABLE',
        patient: i < 5 ? `PT-2026-004${i + 1}` : null,
        vent: i < 5 ? 'VENT-ACTIVE' : 'READY',
      })),
      ...Array.from({ length: 10 }).map((_, i) => ({
        code: `ETU-AMB-${(i + 1).toString().padStart(2, '0')}`,
        zone: 'Amber Zone / Cat 2',
        type: 'High-Dependency Monitored',
        status: i < 8 ? 'OCCUPIED' : 'AVAILABLE',
        patient: i < 8 ? `PT-2026-003${i}` : null,
        vent: 'MONITOR-SYNC',
      })),
      ...Array.from({ length: 16 }).map((_, i) => ({
        code: `ETU-YEL-${(i + 1).toString().padStart(2, '0')}`,
        zone: 'Yellow Zone / Cat 3',
        type: 'Acute Observation',
        status: i < 13 ? 'OCCUPIED' : 'AVAILABLE',
        patient: i < 13 ? `PT-2026-002${i}` : null,
        vent: 'STANDBY',
      })),
      ...Array.from({ length: 8 }).map((_, i) => ({
        code: `ETU-GRN-${(i + 1).toString().padStart(2, '0')}`,
        zone: 'Green Zone / Cat 4',
        type: 'Ambulatory Couch',
        status: i < 5 ? 'OCCUPIED' : 'AVAILABLE',
        patient: i < 5 ? `PT-2026-001${i}` : null,
        vent: 'NONE',
      })),
    ];
    setBeds(simulatedBeds);
    setLoading(false);
  }, []);

  return (
    <AppLayout>
      <div className="flex flex-col w-full space-y-space-lg">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm pb-space-sm border-b border-surface-container-high">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-secondary text-on-secondary flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">inventory</span>
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-headline-lg text-headline-lg text-on-surface">
                    Agent 2 • ETU Resource &amp; Capacity Telemetry
                  </h1>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-secondary-fixed text-on-secondary-fixed font-bold">
                    40-Bed NHSL Matrix
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-outline">
                  Continuous telemetry tracking bed occupancy, physician-nurse staffing ratios, and ventilator availability
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2 py-1 rounded text-xs font-mono bg-surface-container text-primary font-semibold">
              Telemetry Sync: 250ms
            </span>
          </div>
        </div>

        {/* Headline Resource Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
          <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm border border-surface-container-high flex flex-col justify-between">
            <div className="flex items-center justify-between text-outline text-xs">
              <span className="uppercase font-semibold">Acute Care Beds</span>
              <span className="material-symbols-outlined text-primary text-[18px]">bed</span>
            </div>
            <div className="mt-space-sm">
              <span className="font-headline-xl text-headline-xl text-primary font-bold">31 / 40</span>
              <span className="text-xs text-outline ml-2">77.5% Occupied</span>
            </div>
            <span className="text-[11px] text-on-surface-variant mt-1 block">9 Vacant beds available</span>
          </div>

          <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm border border-surface-container-high flex flex-col justify-between">
            <div className="flex items-center justify-between text-outline text-xs">
              <span className="uppercase font-semibold">Duty Staff On Shift</span>
              <span className="material-symbols-outlined text-secondary text-[18px]">group</span>
            </div>
            <div className="mt-space-sm">
              <span className="font-headline-xl text-headline-xl text-on-surface font-bold">8 MO / 18 RN</span>
            </div>
            <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
              1:2.2 Nurse-to-Patient Ratio (Compliant)
            </span>
          </div>

          <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm border border-surface-container-high flex flex-col justify-between">
            <div className="flex items-center justify-between text-outline text-xs">
              <span className="uppercase font-semibold">Mechanical Ventilators</span>
              <span className="material-symbols-outlined text-tertiary text-[18px]">air</span>
            </div>
            <div className="mt-space-sm">
              <span className="font-headline-xl text-headline-xl text-error font-bold">5 / 6 Active</span>
            </div>
            <span className="text-[11px] text-error font-semibold mt-1 block">1 Reserve Unit Remaining</span>
          </div>

          <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm border border-surface-container-high flex flex-col justify-between">
            <div className="flex items-center justify-between text-outline text-xs">
              <span className="uppercase font-semibold">Defibrillators &amp; Crash Carts</span>
              <span className="material-symbols-outlined text-primary text-[18px]">medical_services</span>
            </div>
            <div className="mt-space-sm">
              <span className="font-headline-xl text-headline-xl text-on-surface font-bold">4 / 4 Units</span>
            </div>
            <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">100% Operational &amp; Tested</span>
          </div>
        </div>

        {/* 40-Bed Grid by Clinical Tiers */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container-high p-space-lg">
          <div className="flex items-center justify-between pb-3 border-b border-surface-container-high mb-4">
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Live 40-Bed Discrete Telemetry Sensor Grid
              </h3>
              <span className="text-xs text-outline">Real-time status per NHSL Colombo clinical care tier</span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-error"></span>
                <span>Cat 1 Resus</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-amber-500"></span>
                <span>Cat 2 Amber</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-primary"></span>
                <span>Cat 3 Yellow</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500"></span>
                <span>Cat 4 Green</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
            {beds.map((b) => {
              const isOccupied = b.status === 'OCCUPIED';
              let badgeColor = 'bg-primary/10 text-primary border-primary/20';
              if (b.zone.includes('Red')) badgeColor = isOccupied ? 'bg-error-container text-on-error-container border-error/40' : 'bg-surface-container-low text-outline';
              else if (b.zone.includes('Amber')) badgeColor = isOccupied ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-surface-container-low text-outline';
              else if (b.zone.includes('Yellow')) badgeColor = isOccupied ? 'bg-blue-50 text-blue-900 border-blue-200' : 'bg-surface-container-low text-outline';
              else badgeColor = isOccupied ? 'bg-emerald-50 text-emerald-900 border-emerald-200' : 'bg-surface-container-low text-outline';

              return (
                <div key={b.code} className={`p-2 rounded-lg border text-center transition-all ${badgeColor}`}>
                  <span className="font-mono text-[11px] font-bold block">{b.code}</span>
                  <span className="text-[10px] font-semibold block mt-0.5">{b.status}</span>
                  <span className="text-[9px] font-mono text-outline block mt-0.5 truncate">
                    {b.patient || b.vent}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}


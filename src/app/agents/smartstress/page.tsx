'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';

export default function SmartstressSurgeAgentPage() {
  const [selectedScenario, setSelectedScenario] = useState('kelani_flood');

  const scenarios: Record<
    string,
    { title: string; type: string; severity: string; multiplier: string; projectedArrivals: number; ventNeed: number; timeToSaturation: string; description: string }
  > = {
    kelani_flood: {
      title: 'Kelani River Basin Monsoon Inundation',
      type: 'Hydrological Surge',
      severity: 'HIGH',
      multiplier: '2.4x Inflow Pulse',
      projectedArrivals: 48,
      ventNeed: 4,
      timeToSaturation: '3.5 Hours',
      description: 'Rapid rising floodwaters in Sedawatta & Kolonnawa catchments resulting in waterborne trauma, hypothermia, and electrocution emergencies.',
    },
    expressway_crash: {
      title: 'Southern Expressway Multi-Vehicle Collision',
      type: 'Mass-Casualty Incident (MCI)',
      severity: 'CRITICAL',
      multiplier: '4.2x Inflow Pulse',
      projectedArrivals: 28,
      ventNeed: 6,
      timeToSaturation: '45 Minutes',
      description: 'High-velocity pileup near Kadawatha interchange involving passenger bus and heavy lorries. Polytrauma, acute traumatic brain injury, and chest crush injuries.',
    },
    cyclone_surge: {
      title: 'Coastal Cyclone & Structural Collapse',
      type: 'Meteorological Surge',
      severity: 'HIGH',
      multiplier: '2.8x Inflow Pulse',
      projectedArrivals: 56,
      ventNeed: 5,
      timeToSaturation: '2.8 Hours',
      description: 'Severe coastal gusts causing roof and building collapses in Colombo North. Blunt orthopedic trauma, deep lacerations, and crush syndromes.',
    },
    dengue_spike: {
      title: 'Colombo Monsoon Dengue Hemorrhagic Spike',
      type: 'Epidemic Surge',
      severity: 'MEDIUM',
      multiplier: '1.8x Inflow Pulse',
      projectedArrivals: 36,
      ventNeed: 2,
      timeToSaturation: '12 Hours',
      description: 'Severe plasma leakage, dengue shock syndrome (DSS), and acute thrombocytopenia presentations across Colombo urban municipal council wards.',
    },
  };

  const current = scenarios[selectedScenario];

  return (
    <AppLayout>
      <div className="flex flex-col w-full space-y-space-lg">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm pb-space-sm border-b border-surface-container-high">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-error text-on-error flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">bolt</span>
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-headline-lg text-headline-lg text-on-surface">
                    Agent 4 &amp; 6 • SMARTSTRESS Disaster Surge
                  </h1>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-error-container text-on-error-container font-bold">
                    Colombo Hazard Envelope
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-outline">
                  Synthesizes high-impact mass-casualty hazard projections and simulates ETU capacity saturation limits
                </p>
              </div>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded text-xs font-mono bg-surface-container text-primary font-semibold">
            Calibrated Colombo Models
          </span>
        </div>

        {/* Hazard Scenario Selector Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-sm">
          {Object.entries(scenarios).map(([key, sc]) => {
            const isSelected = selectedScenario === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedScenario(key)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-primary-container text-on-primary border-primary shadow-md'
                    : 'bg-surface-container-lowest border-surface-container-high text-on-surface hover:bg-surface-container-low'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono uppercase font-bold tracking-wider opacity-80">{sc.type}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      sc.severity === 'CRITICAL'
                        ? 'bg-error text-white'
                        : isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {sc.severity}
                  </span>
                </div>
                <span className="font-bold text-xs block leading-tight">{sc.title}</span>
              </button>
            );
          })}
        </div>

        {/* Main Surge Stress Card */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container-high p-space-lg">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-space-md pb-space-sm border-b border-surface-container-high mb-space-md">
            <div>
              <span className="text-xs font-mono text-outline uppercase font-semibold">Active Hazard Model</span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">{current.title}</h3>
              <p className="text-xs text-on-surface-variant mt-1 leading-relaxed max-w-2xl">{current.description}</p>
            </div>
            <div className="p-space-sm rounded-lg bg-surface-container-low text-center min-w-[140px] shrink-0">
              <span className="text-[10px] font-semibold text-outline uppercase block">Surge Velocity</span>
              <span className="font-mono text-xl font-bold text-error">{current.multiplier}</span>
            </div>
          </div>

          {/* Surge Impact Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md my-space-md text-xs">
            <div className="p-space-md rounded-lg bg-surface-container-low flex flex-col justify-between">
              <span className="text-outline uppercase text-[10px]">Projected Emergency Inflow</span>
              <span className="font-mono text-2xl font-bold text-primary my-1">+{current.projectedArrivals} Pt.</span>
              <span className="text-[10px] text-outline">Within initial 3h triage window</span>
            </div>

            <div className="p-space-md rounded-lg bg-surface-container-low flex flex-col justify-between">
              <span className="text-outline uppercase text-[10px]">Ventilator Requirement Spike</span>
              <span className="font-mono text-2xl font-bold text-error my-1">+{current.ventNeed} Ventilators</span>
              <span className="text-[10px] text-error font-semibold">Exceeds active ETU reserve</span>
            </div>

            <div className="p-space-md rounded-lg bg-surface-container-low flex flex-col justify-between">
              <span className="text-outline uppercase text-[10px]">Bed Saturation Cliff</span>
              <span className="font-mono text-2xl font-bold text-secondary my-1">{current.timeToSaturation}</span>
              <span className="text-[10px] text-outline">Without proactive decanting</span>
            </div>
          </div>

          {/* Preparedness Directive Action */}
          <div className="pt-space-sm border-t border-surface-container-high flex flex-col sm:flex-row items-center justify-between gap-space-sm text-xs">
            <div className="flex items-center gap-2 text-on-surface-variant">
              <span className="material-symbols-outlined text-secondary text-[20px]">notifications_active</span>
              <span>SMARTSTRESS protocol recommendation: Trigger Stage 2 Trauma Surge readiness and clear Step-down Lounge buffer.</span>
            </div>
            <button
              onClick={() => alert(`Activated Stage 2 Surge protocol envelope for ${current.title}. Digital Twin telemetry streaming counterfactuals.`)}
              className="px-4 py-2 rounded-lg bg-error text-white font-semibold hover:bg-error/90 transition-colors shadow shrink-0"
            >
              Simulate Surge Decanting
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}


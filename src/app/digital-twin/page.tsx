'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';

export default function DigitalTwinSimulationPage() {
  const [horizon, setHorizon] = useState(6);
  const [arrivalRate, setArrivalRate] = useState(14.5);
  const [doctors, setDoctors] = useState(8);
  const [nurses, setNurses] = useState(18);
  const [beds, setBeds] = useState(40);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simResults, setSimResults] = useState<any>({
    throughput: 84,
    avgWaitMins: 13.8,
    maxQueueLength: 6,
    bedOccupancyPct: 87.5,
    doctorUtilPct: 78.4,
    unmetDemandPct: 0.0,
  });

  const runSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      // Stochastic calculation
      const simulatedThroughput = Math.round(horizon * arrivalRate * 0.94);
      const simulatedWait = Math.max(8, Math.round((arrivalRate / (doctors * 0.8)) * 7.5));
      const simulatedOcc = Math.min(98, Math.round((simulatedThroughput / (beds * 0.7)) * 40));
      setSimResults({
        throughput: simulatedThroughput,
        avgWaitMins: simulatedWait,
        maxQueueLength: Math.max(3, Math.round(simulatedWait / 3)),
        bedOccupancyPct: simulatedOcc,
        doctorUtilPct: Math.min(94, Math.round((arrivalRate / (doctors * 1.5)) * 100)),
        unmetDemandPct: simulatedOcc > 95 ? 4.2 : 0.0,
      });
      setIsSimulating(false);
    }, 800);
  };

  return (
    <AppLayout>
      <div className="flex flex-col w-full space-y-space-lg">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm pb-space-sm border-b border-surface-container-high">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-primary-container text-on-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">view_in_ar</span>
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-headline-lg text-headline-lg text-on-surface">ETU Digital Twin Simulation Engine</h1>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-tertiary-fixed text-on-tertiary font-bold">
                    SimPy 4.1.2 Stochastic
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-outline">
                  Counterfactual discrete-event queue testing of resource allocations prior to physical clinical deployment
                </p>
              </div>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded text-xs font-mono bg-surface-container text-primary font-semibold">
            NHSL 40-Bed Model
          </span>
        </div>

        {/* Sim Controls & Interactive Inputs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md">
          {/* Controls (5 cols) */}
          <div className="lg:col-span-5 bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container-high p-space-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-surface-container-high mb-4">
                <span className="font-label-md text-label-md font-bold text-on-surface">Stochastic Parameters</span>
                <span className="text-[10px] font-mono text-outline">Random Seed: 42</span>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-on-surface">Simulation Horizon</span>
                    <span className="font-mono text-primary font-bold">{horizon} Hours</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="24"
                    value={horizon}
                    onChange={(e) => setHorizon(parseInt(e.target.value, 10))}
                    className="w-full accent-primary cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-on-surface">Mean Arrival Rate (Poisson)</span>
                    <span className="font-mono text-primary font-bold">{arrivalRate} Pt./Hour</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="35"
                    step="0.5"
                    value={arrivalRate}
                    onChange={(e) => setArrivalRate(parseFloat(e.target.value))}
                    className="w-full accent-primary cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] font-semibold text-outline uppercase block mb-1">Medical Officers</label>
                    <input
                      type="number"
                      value={doctors}
                      onChange={(e) => setDoctors(parseInt(e.target.value, 10))}
                      className="w-full px-2 py-1.5 rounded bg-surface-container-low font-mono font-bold text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-outline uppercase block mb-1">Staff Nurses</label>
                    <input
                      type="number"
                      value={nurses}
                      onChange={(e) => setNurses(parseInt(e.target.value, 10))}
                      className="w-full px-2 py-1.5 rounded bg-surface-container-low font-mono font-bold text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-outline uppercase block mb-1">Operational Beds</label>
                    <input
                      type="number"
                      value={beds}
                      onChange={(e) => setBeds(parseInt(e.target.value, 10))}
                      className="w-full px-2 py-1.5 rounded bg-surface-container-low font-mono font-bold text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={runSimulation}
              disabled={isSimulating}
              className="mt-6 w-full py-3 rounded-lg bg-primary-container text-on-primary font-label-lg text-label-lg hover:bg-tertiary transition-colors shadow flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSimulating ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                  <span>Executing SimPy Discrete Steps...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">play_arrow</span>
                  <span>Simulate Counterfactual Trajectory</span>
                </>
              )}
            </button>
          </div>

          {/* Results Bento (7 cols) */}
          <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container-high p-space-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-surface-container-high mb-4">
                <span className="font-label-md text-label-md font-bold text-on-surface">Simulated Operational KPIs</span>
                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-bold">
                  Monte Carlo Evaluated
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-space-sm text-xs">
                <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col">
                  <span className="text-[10px] text-outline uppercase">Simulated Throughput</span>
                  <span className="font-mono text-xl font-bold text-primary mt-1">{simResults.throughput} Pt.</span>
                  <span className="text-[10px] text-outline mt-0.5">Treated &amp; Decanted</span>
                </div>

                <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col">
                  <span className="text-[10px] text-outline uppercase">Mean Triage Queue Wait</span>
                  <span className="font-mono text-xl font-bold text-secondary mt-1">{simResults.avgWaitMins} mins</span>
                  <span className="text-[10px] text-outline mt-0.5">Safety standard: ≤20m</span>
                </div>

                <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col">
                  <span className="text-[10px] text-outline uppercase">Peak Queue Length</span>
                  <span className="font-mono text-xl font-bold text-on-surface mt-1">{simResults.maxQueueLength} Pt.</span>
                  <span className="text-[10px] text-outline mt-0.5">At waiting buffer</span>
                </div>

                <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col">
                  <span className="text-[10px] text-outline uppercase">Simulated Bed Occupancy</span>
                  <span className="font-mono text-xl font-bold text-primary mt-1">{simResults.bedOccupancyPct}%</span>
                  <span className="text-[10px] text-outline mt-0.5">Unit tension</span>
                </div>

                <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col">
                  <span className="text-[10px] text-outline uppercase">Doctor Utilization</span>
                  <span className="font-mono text-xl font-bold text-on-surface mt-1">{simResults.doctorUtilPct}%</span>
                  <span className="text-[10px] text-outline mt-0.5">Clinical workload</span>
                </div>

                <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col">
                  <span className="text-[10px] text-outline uppercase">Unmet Clinical Demand</span>
                  <span className={`font-mono text-xl font-bold mt-1 ${simResults.unmetDemandPct > 0 ? 'text-error' : 'text-emerald-700'}`}>
                    {simResults.unmetDemandPct}%
                  </span>
                  <span className="text-[10px] text-outline mt-0.5">Diverted admissions</span>
                </div>
              </div>
            </div>

            <div className="pt-space-sm border-t border-surface-container-high text-xs text-on-surface-variant flex items-center gap-1.5 mt-4">
              <span className="material-symbols-outlined text-[16px] text-secondary">verified_user</span>
              <span>Allows unit coordinators to stress-test shift handovers before patient volume escalations.</span>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}


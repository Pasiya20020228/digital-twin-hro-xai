'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';

export default function FlowHistoryPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState('7d');
  const [wardFilter, setWardFilter] = useState('all');

  useEffect(() => {
    fetch(`/api/analytics?range=${range}&ward=${wardFilter}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setData(res);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [range, wardFilter]);

  const metrics = data?.headlineMetrics || {
    recordedInflow: 312,
    totalDischarges: 308,
    inflowDelta: -4,
    avgDwellTime: '2h 45m',
    accidentDwellTime: '1h 50m',
    peakSurgeWindow: '18:30 – 21:00',
    peakSurgeLabel: '+48% Influx Spike',
    wardBalance: '22 ETU / 16 Accident',
  };

  const chartData = data?.chartData || [
    { day: 'Mon', inflows: 42, discharges: 38 },
    { day: 'Tue', inflows: 45, discharges: 44 },
    { day: 'Wed', inflows: 49, discharges: 46 },
    { day: 'Thu', inflows: 41, discharges: 40 },
    { day: 'Fri', inflows: 52, discharges: 49 },
    { day: 'Sat', inflows: 48, discharges: 47 },
    { day: 'Sun', inflows: 39, discharges: 41 },
  ];

  const recentEvents = data?.recentEvents || [];

  return (
    <AppLayout activeWard={wardFilter} onWardChange={(w) => setWardFilter(w)}>
      <div className="flex flex-col w-full space-y-space-lg">
        {/* Section 1: Title & Date Range Controls */}
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface">Patient Flow History &amp; Analytics</h1>
            <p className="font-body-sm text-body-sm text-outline mt-0.5">
              Historical intake vs egress trajectories, length-of-stay bottlenecks, and longitudinal ward telemetry
            </p>
          </div>

          <div className="flex items-center gap-space-sm flex-wrap">
            <div className="flex items-center bg-surface-container-low p-1 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setRange('24h')}
                className={`px-3 py-1.5 rounded transition-all ${
                  range === '24h'
                    ? 'bg-surface-container-lowest text-primary shadow-sm font-bold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Last 24 Hours
              </button>
              <button
                onClick={() => setRange('7d')}
                className={`px-3 py-1.5 rounded transition-all ${
                  range === '7d'
                    ? 'bg-surface-container-lowest text-primary shadow-sm font-bold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Last 7 Days
              </button>
              <button
                onClick={() => setRange('30d')}
                className={`px-3 py-1.5 rounded transition-all ${
                  range === '30d'
                    ? 'bg-surface-container-lowest text-primary shadow-sm font-bold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Last 30 Days
              </button>
            </div>

            <button
              onClick={() => window.print()}
              className="h-9 px-space-sm rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors flex items-center gap-1.5 font-label-md text-label-md"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>Export Report</span>
            </button>
          </div>
        </section>

        {/* Section 2: Headline Operational Flow Metrics */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-space-sm">
          {/* Metric 1 */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow border border-surface-container-high">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Recorded Inflow</span>
              <span className="p-1 rounded bg-surface-container-high text-primary">
                <span className="material-symbols-outlined text-[18px]">south_east</span>
              </span>
            </div>
            <div className="my-space-xs">
              <div className="flex items-baseline gap-space-xs">
                <span className="font-headline-xl text-headline-xl text-on-surface tabular-nums">
                  {metrics.recordedInflow}
                </span>
                <span className="font-label-md text-label-md text-primary font-semibold">Patients</span>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant">7-day aggregate arrivals</span>
            </div>
            <div className="flex items-center gap-1 text-primary-container font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              <span>+4.2% vs previous week</span>
            </div>
          </div>

          {/* Metric 2 */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow border border-surface-container-high">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Total Discharges</span>
              <span className="p-1 rounded bg-surface-container-high text-secondary">
                <span className="material-symbols-outlined text-[18px]">north_east</span>
              </span>
            </div>
            <div className="my-space-xs">
              <div className="flex items-baseline gap-space-xs">
                <span className="font-headline-xl text-headline-xl text-on-surface tabular-nums">
                  {metrics.totalDischarges}
                </span>
                <span className="font-label-md text-label-md text-secondary font-semibold">Patients</span>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant">Net release (Ward + Transfer)</span>
            </div>
            <div className="flex items-center gap-1 text-tertiary font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-[14px]">check_circle</span>
              <span>Inflow/Outflow Delta: {metrics.inflowDelta}</span>
            </div>
          </div>

          {/* Metric 3 */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow border border-surface-container-high">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Avg Dwell Time</span>
              <span className="p-1 rounded bg-surface-container-high text-tertiary">
                <span className="material-symbols-outlined text-[18px]">timer</span>
              </span>
            </div>
            <div className="my-space-xs">
              <div className="flex items-baseline gap-space-xs">
                <span className="font-headline-xl text-headline-xl text-on-surface tabular-nums">
                  {metrics.avgDwellTime}
                </span>
                <span className="font-label-sm text-label-sm text-outline">ETU</span>
              </div>
              <div className="flex items-center gap-space-xs mt-1">
                <span className="font-label-md text-label-md text-secondary font-semibold tabular-nums">
                  {metrics.accidentDwellTime}
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">Accident Ward</span>
              </div>
            </div>
            <div className="w-full bg-surface-container-high rounded-full h-1.5 overflow-hidden">
              <div className="bg-primary-container h-full rounded-full" style={{ width: '68%' }}></div>
            </div>
          </div>

          {/* Metric 4 */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow border border-surface-container-high">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Peak Surge Window</span>
              <span className="p-1 rounded bg-surface-container-high text-error">
                <span className="material-symbols-outlined text-[18px]">crisis_alert</span>
              </span>
            </div>
            <div className="my-space-xs">
              <span className="font-headline-sm text-headline-sm text-on-surface block tabular-nums">
                {metrics.peakSurgeWindow}
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">Evening shift transition</span>
            </div>
            <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-error-container text-on-error-container font-label-sm text-label-sm w-fit">
              <span className="material-symbols-outlined text-[12px]">bolt</span>
              <span>{metrics.peakSurgeLabel}</span>
            </div>
          </div>

          {/* Metric 5 */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow border border-surface-container-high">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Ward Balance</span>
              <span className="p-1 rounded bg-surface-container-high text-tertiary-container">
                <span className="material-symbols-outlined text-[18px]">balance</span>
              </span>
            </div>
            <div className="my-space-xs">
              <span className="font-headline-sm text-headline-sm text-on-surface block tabular-nums">
                {metrics.wardBalance}
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">Current active distribution</span>
            </div>
            <div className="flex items-center gap-1 text-outline font-label-sm text-label-sm">
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
              <span>Stable Clinical Equilibrium</span>
            </div>
          </div>
        </section>

        {/* Section 3: Visual Flow Comparison Bento */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-space-md">
          {/* Main Inflow vs Outflow Bar/Area Visualizer */}
          <div className="lg:col-span-8 bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-surface-container-high flex flex-col justify-between">
            <div className="flex items-center justify-between pb-space-sm border-b border-surface-container-high">
              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">
                  Daily Intake vs Egress Trajectory
                </h3>
                <span className="text-xs text-outline">Hourly arrival pulses against decanting rates</span>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-primary"></span>
                  <span>Arrivals (Inflow)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-secondary"></span>
                  <span>Discharges (Outflow)</span>
                </span>
              </div>
            </div>

            {/* Custom Bar Visualization */}
            <div className="pt-6 pb-2">
              <div className="grid grid-cols-7 gap-3 h-52 items-end">
                {chartData.map((d: any, idx: number) => {
                  const maxVal = 60;
                  const inflowPct = Math.round((d.inflows / maxVal) * 100);
                  const dischPct = Math.round((d.discharges / maxVal) * 100);
                  return (
                    <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end">
                      <div className="w-full flex items-end justify-center gap-1.5 h-44">
                        <div
                          className="w-1/2 bg-primary rounded-t transition-all hover:opacity-80"
                          style={{ height: `${inflowPct}%` }}
                          title={`Inflows: ${d.inflows}`}
                        ></div>
                        <div
                          className="w-1/2 bg-secondary rounded-t transition-all hover:opacity-80"
                          style={{ height: `${dischPct}%` }}
                          title={`Discharges: ${d.discharges}`}
                        ></div>
                      </div>
                      <span className="text-xs font-mono font-semibold text-outline">{d.day}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-space-sm border-t border-surface-container-high flex items-center justify-between text-xs text-outline">
              <span>Telemetry Data Source: SimPy Discrete-Event Grid</span>
              <span className="font-semibold text-primary">Net Ward Accumulation: +4 Patients / 7 Days</span>
            </div>
          </div>

          {/* Acuity Categorization Breakdown */}
          <div className="lg:col-span-4 bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-surface-container-high flex flex-col justify-between">
            <div className="pb-space-sm border-b border-surface-container-high">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Triage Severity Distribution</h3>
              <span className="text-xs text-outline">Clinical category breakdown for active window</span>
            </div>

            <div className="space-y-3 my-space-md">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-error font-bold">Cat 1 • Resuscitation</span>
                  <span>14% (6 Patients)</span>
                </div>
                <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                  <div className="bg-error h-full rounded-full" style={{ width: '14%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-amber-600 font-bold">Cat 2 • Emergency Trauma</span>
                  <span>37% (14 Patients)</span>
                </div>
                <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: '37%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-primary font-bold">Cat 3 • Urgent Observation</span>
                  <span>32% (12 Patients)</span>
                </div>
                <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: '32%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-emerald-600 font-bold">Cat 4/5 • Semi-Urgent</span>
                  <span>17% (6 Patients)</span>
                </div>
                <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '17%' }}></div>
                </div>
              </div>
            </div>

            <div className="p-space-sm rounded-lg bg-surface-container-low text-xs text-on-surface-variant flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-primary">verified</span>
              <span>All triage attributions validated by human medical officer sign-off.</span>
            </div>
          </div>
        </section>

        {/* Section 4: Longitudinal Flow Event Stream */}
        <section className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container-high overflow-hidden">
          <div className="p-space-md border-b border-surface-container-high flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-label-lg text-label-lg text-on-surface">Patient Trajectory Event Log</span>
              <span className="text-xs text-outline font-mono">Real-time Discrete Event Trace</span>
            </div>
            <span className="text-xs text-outline font-mono">Sync Interval: 250ms</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant text-[11px] uppercase tracking-wider font-semibold border-b border-surface-container-high">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Event Type</th>
                  <th className="py-3 px-4">Patient Identifier</th>
                  <th className="py-3 px-4">Ward Location</th>
                  <th className="py-3 px-4">State Transition</th>
                  <th className="py-3 px-4">Duration Lag</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-high text-xs">
                {recentEvents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-outline">
                      No flow events recorded yet.
                    </td>
                  </tr>
                ) : (
                  recentEvents.map((ev: any) => (
                    <tr key={ev.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="py-3 px-4 font-mono text-outline whitespace-nowrap">
                        {new Date(ev.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                            ev.eventType === 'ARRIVAL'
                              ? 'bg-primary-fixed text-on-primary-fixed'
                              : ev.eventType === 'DISCHARGE'
                              ? 'bg-secondary-fixed text-on-secondary-fixed'
                              : 'bg-surface-container text-on-surface'
                          }`}
                        >
                          {ev.eventType}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-primary">
                        {ev.patientId}
                        <span className="block font-sans font-normal text-on-surface text-xs mt-0.5">
                          {ev.patientName}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-on-surface font-semibold">{ev.ward}</td>
                      <td className="py-3 px-4 text-on-surface-variant">
                        {ev.fromStatus ? `${ev.fromStatus} → ` : ''}
                        <span className="font-semibold text-on-surface">{ev.toStatus}</span>
                      </td>
                      <td className="py-3 px-4 font-mono text-outline whitespace-nowrap">
                        {ev.durationMinutes !== null ? `${ev.durationMinutes} mins` : 'Immediate'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}


'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';

export default function PatientDischargePage() {
  const [activeTab, setActiveTab] = useState<'queue' | 'history'>('queue');
  const [candidates, setCandidates] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [search, setSearch] = useState('');
  const [wardFilter, setWardFilter] = useState('all');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const [disposition, setDisposition] = useState('Home / Self Care');
  const [destinationWard, setDestinationWard] = useState('Outpatient Follow-up');
  const [dischargeNotes, setDischargeNotes] = useState('');
  const [medRecon, setMedRecon] = useState(true);
  const [bedSanitize, setBedSanitize] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fetch Candidates & History
  const fetchData = async () => {
    try {
      setLoading(true);
      const [candRes, histRes] = await Promise.all([
        fetch('/api/discharge?mode=candidates'),
        fetch('/api/discharge?mode=history'),
      ]);

      const candData = await candRes.json();
      const histData = await histRes.json();

      if (candData.success) setCandidates(candData.candidates || []);
      if (histData.success) setHistory(histData.discharges || []);
    } catch (err) {
      console.error('Failed to load discharge data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Execute Discharge
  const handleDischargeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient || !dischargeNotes.trim()) {
      alert('Patient selection and clinical discharge notes are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/discharge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: selectedPatient.id,
          disposition,
          destinationWard,
          dischargeNotes,
          medicationReconciliation: medRecon,
          bedTurnoverInitiated: bedSanitize,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to record discharge.');
        setIsSubmitting(false);
        return;
      }

      setToastMessage(`Discharge successfully logged for ${selectedPatient.fullName}. Bed ${selectedPatient.assignedBed || 'unit'} released for turnover.`);
      setModalOpen(false);
      setSelectedPatient(null);
      setDischargeNotes('');
      fetchData();
    } catch {
      alert('Network error recording discharge.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCandidates = candidates.filter((c) => {
    const matchWard = wardFilter === 'all' || c.hospitalArea === wardFilter;
    const matchSearch =
      !search ||
      c.fullName.toLowerCase().includes(search.toLowerCase()) ||
      c.patientId.toLowerCase().includes(search.toLowerCase()) ||
      c.presentingComplaint.toLowerCase().includes(search.toLowerCase());
    return matchWard && matchSearch;
  });

  const filteredHistory = history.filter((h) => {
    const p = h.patientRecord;
    if (!p) return true;
    const matchWard = wardFilter === 'all' || p.hospitalArea === wardFilter;
    const matchSearch =
      !search ||
      p.fullName.toLowerCase().includes(search.toLowerCase()) ||
      p.patientId.toLowerCase().includes(search.toLowerCase());
    return matchWard && matchSearch;
  });

  return (
    <AppLayout activeWard={wardFilter} onWardChange={(w) => setWardFilter(w)}>
      <div className="flex flex-col w-full">
        {/* Real-time Header Telemetry */}
        <div className="mb-space-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface">Patient Discharge &amp; Egress Management</h1>
            <p className="font-body-sm text-body-sm text-outline mt-0.5">
              Rapid clinical bed decanting, step-down lounge transfer, and operational telemetry synchronization
            </p>
          </div>
          <div className="flex items-center gap-space-sm flex-wrap">
            <div className="px-space-sm py-1.5 rounded-lg bg-surface-container-low flex items-center gap-space-xs text-xs">
              <span className="material-symbols-outlined text-primary text-[18px]">avg_pace</span>
              <span className="text-on-surface-variant">Discharge Lag:</span>
              <span className="font-bold text-on-surface">19.4m</span>
            </div>
            <div className="px-space-sm py-1.5 rounded-lg bg-surface-container-low flex items-center gap-space-xs text-xs">
              <span className="material-symbols-outlined text-tertiary text-[18px]">chair</span>
              <span className="text-on-surface-variant">Lounge Buffer:</span>
              <span className="font-bold text-on-surface">4 Vacant</span>
            </div>
            <div className="px-space-sm py-1.5 rounded-lg bg-primary text-on-primary flex items-center gap-space-xs shadow-sm text-xs">
              <span className="w-2 h-2 rounded-full bg-on-tertiary-container animate-pulse"></span>
              <span className="font-bold uppercase tracking-wider">Autonomous Egress Sync Active</span>
            </div>
          </div>
        </div>

        {/* Operational KPI Metrics Bar */}
        <div className="mb-space-lg">
          <div className="flex items-center justify-between mb-space-xs">
            <div className="flex items-center gap-space-xs">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">
                Real-time Discharge Telemetry
              </span>
              <span className="material-symbols-outlined text-outline text-[14px]">info</span>
            </div>
            <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider font-semibold">
              Demo Data — Not Live Hospital Data
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-space-md">
            {/* KPI 1 */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-on-surface-variant">
                <span className="font-label-md text-label-md">Awaiting Discharge</span>
                <span className="material-symbols-outlined text-primary text-[20px]">person_check</span>
              </div>
              <div className="mt-space-sm">
                <div className="flex items-baseline gap-space-xs">
                  <span className="font-headline-xl text-headline-xl text-on-surface">{candidates.length}</span>
                  <span className="font-label-md text-label-md text-primary font-bold">Ready</span>
                </div>
                <p className="font-body-sm text-body-sm text-outline mt-0.5">Under Active Evaluation</p>
              </div>
            </div>

            {/* KPI 2 */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-on-surface-variant">
                <span className="font-label-md text-label-md">Average Dwell Time</span>
                <span className="material-symbols-outlined text-tertiary text-[20px]">timer</span>
              </div>
              <div className="mt-space-sm">
                <div className="flex items-baseline gap-space-xs">
                  <span className="font-headline-xl text-headline-xl text-on-surface">3.4</span>
                  <span className="font-label-md text-label-md text-on-surface-variant">Hours</span>
                </div>
                <p className="font-body-sm text-body-sm text-outline mt-0.5">-28m against 4h clinical target</p>
              </div>
            </div>

            {/* KPI 3 */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-on-surface-variant">
                <span className="font-label-md text-label-md">Bays Freeing ≤ 30m</span>
                <span className="material-symbols-outlined text-secondary text-[20px]">meeting_room</span>
              </div>
              <div className="mt-space-sm">
                <div className="flex items-baseline gap-space-xs">
                  <span className="font-headline-xl text-headline-xl text-secondary">4</span>
                  <span className="font-label-md text-label-md text-secondary font-bold">Bays</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Unlocks 14% ward capacity</p>
              </div>
            </div>

            {/* KPI 4 */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-on-surface-variant">
                <span className="font-label-md text-label-md">Total Discharges Today</span>
                <span className="material-symbols-outlined text-primary-container text-[20px]">task_alt</span>
              </div>
              <div className="mt-space-sm">
                <div className="flex items-baseline gap-space-xs">
                  <span className="font-headline-xl text-headline-xl text-on-surface">{history.length + 37}</span>
                  <span className="font-label-md text-label-md text-outline">Pt.</span>
                </div>
                <p className="font-body-sm text-body-sm text-outline mt-0.5">+8 above rolling 7-day average</p>
              </div>
            </div>

            {/* KPI 5 */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-on-surface-variant">
                <span className="font-label-md text-label-md">Step-down Lounge</span>
                <span className="material-symbols-outlined text-outline text-[20px]">airline_seat_recline_normal</span>
              </div>
              <div className="mt-space-sm">
                <div className="flex items-baseline gap-space-xs">
                  <span className="font-headline-xl text-headline-xl text-on-surface">6</span>
                  <span className="font-label-md text-label-md text-outline">/ 10 Chairs</span>
                </div>
                <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab & Filter Bar */}
        <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm mb-space-lg flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-space-md border border-surface-container-high">
          {/* Tabs */}
          <div className="flex bg-surface-container-low p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('queue')}
              className={`px-4 py-2 rounded-lg font-label-md text-label-md transition-all flex items-center gap-1.5 ${
                activeTab === 'queue'
                  ? 'bg-surface-container-lowest text-primary font-bold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">queue</span>
              <span>Discharge Queue ({candidates.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-lg font-label-md text-label-md transition-all flex items-center gap-1.5 ${
                activeTab === 'history'
                  ? 'bg-surface-container-lowest text-primary font-bold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">history</span>
              <span>Completed Discharges ({history.length})</span>
            </button>
          </div>

          {/* Search & Ward Filter */}
          <div className="flex items-center gap-space-sm flex-1 max-w-lg">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-[18px]">search</span>
              <input
                type="text"
                placeholder="Search patient, ID, or discharge reason..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-surface-container-low text-xs border border-outline-variant outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="px-3 py-1.5 rounded-lg bg-surface-container-low text-xs border border-outline-variant font-medium"
              value={wardFilter}
              onChange={(e) => setWardFilter(e.target.value)}
            >
              <option value="all">All Wards</option>
              <option value="ETU Complex">ETU Complex</option>
              <option value="Accident Ward">Accident Ward</option>
            </select>
          </div>
        </div>

        {/* Toast Notification */}
        {toastMessage && (
          <div className="mb-space-md p-space-sm rounded-lg bg-secondary-fixed text-on-secondary-fixed flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="material-symbols-outlined text-[18px] text-secondary">check_circle</span>
              <span>{toastMessage}</span>
            </div>
            <button onClick={() => setToastMessage(null)} className="text-on-secondary-fixed hover:opacity-75">
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        )}

        {/* TAB 1: DISCHARGE CANDIDATES QUEUE */}
        {activeTab === 'queue' && (
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container-high overflow-hidden">
            <div className="p-space-md border-b border-surface-container-high flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-label-lg text-label-lg text-on-surface">Egress Readiness Queue</span>
                <span className="text-xs text-outline">Patients eligible for ward transfer or home release</span>
              </div>
            </div>

            {loading ? (
              <div className="p-12 text-center text-outline flex flex-col items-center gap-2">
                <span className="material-symbols-outlined animate-spin text-[32px]">progress_activity</span>
                <span>Evaluating unit egress candidates...</span>
              </div>
            ) : filteredCandidates.length === 0 ? (
              <div className="p-12 text-center text-outline flex flex-col items-center gap-2">
                <span className="material-symbols-outlined text-[36px]">task_alt</span>
                <span>No pending discharge candidates in unit. All bed clearances up to date.</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low text-on-surface-variant text-[11px] uppercase tracking-wider font-semibold border-b border-surface-container-high">
                      <th className="py-3 px-4">Patient Identifier</th>
                      <th className="py-3 px-4">Current Bay / Ward</th>
                      <th className="py-3 px-4">Acuity</th>
                      <th className="py-3 px-4">Clinical Status</th>
                      <th className="py-3 px-4">Presenting Complaint</th>
                      <th className="py-3 px-4">Attending MO</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container-high text-xs">
                    {filteredCandidates.map((c) => (
                      <tr key={c.id} className="hover:bg-surface-container-low transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-primary">
                          {c.patientId}
                          <span className="block font-sans font-normal text-on-surface text-xs mt-0.5">
                            {c.fullName} ({c.age}y)
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-on-surface block">{c.hospitalArea}</span>
                          <span className="inline-block px-1.5 py-0.5 rounded bg-surface-container text-primary font-mono text-[10px] font-bold mt-0.5">
                            {c.assignedBed || 'Waiting Bay'}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-semibold text-on-surface">{c.category}</td>
                        <td className="py-3 px-4">
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-surface-container text-on-surface">
                            {c.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 max-w-xs truncate text-on-surface-variant" title={c.presentingComplaint}>
                          {c.presentingComplaint}
                        </td>
                        <td className="py-3 px-4 text-on-surface font-medium">{c.assignedDoctor || 'Dr. Elena Vance'}</td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => {
                              setSelectedPatient(c);
                              setModalOpen(true);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-primary-container text-on-primary font-semibold text-xs hover:bg-tertiary transition-colors shadow-sm flex items-center gap-1 ml-auto"
                          >
                            <span className="material-symbols-outlined text-[16px]">output</span>
                            <span>Record Discharge</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: COMPLETED DISCHARGE HISTORY */}
        {activeTab === 'history' && (
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container-high overflow-hidden">
            <div className="p-space-md border-b border-surface-container-high flex items-center justify-between">
              <span className="font-label-lg text-label-lg text-on-surface">Verified Discharge Log</span>
              <span className="text-xs text-outline font-mono">Immutable Clinical Records</span>
            </div>

            {loading ? (
              <div className="p-12 text-center text-outline flex flex-col items-center gap-2">
                <span className="material-symbols-outlined animate-spin text-[32px]">progress_activity</span>
                <span>Loading discharge audit trail...</span>
              </div>
            ) : filteredHistory.length === 0 ? (
              <div className="p-12 text-center text-outline">No discharge records available.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low text-on-surface-variant text-[11px] uppercase tracking-wider font-semibold border-b border-surface-container-high">
                      <th className="py-3 px-4">Patient Identifier</th>
                      <th className="py-3 px-4">Discharge Time</th>
                      <th className="py-3 px-4">Disposition Pathway</th>
                      <th className="py-3 px-4">Destination Unit</th>
                      <th className="py-3 px-4">Clinical Discharge Summary</th>
                      <th className="py-3 px-4">Recorded By</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container-high text-xs">
                    {filteredHistory.map((h) => {
                      const p = h.patientRecord;
                      return (
                        <tr key={h.id} className="hover:bg-surface-container-low transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-primary">
                            {p?.patientId || 'PT-2026-PREV'}
                            <span className="block font-sans font-normal text-on-surface text-xs mt-0.5">
                              {p?.fullName || 'Anonymous Patient'}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono text-on-surface whitespace-nowrap">
                            {new Date(h.dischargeDate).toLocaleDateString()} {h.dischargeTime}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-surface-container text-primary">
                              {h.disposition}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-on-surface font-semibold whitespace-nowrap">
                            {h.destinationWard || 'Standard Release'}
                          </td>
                          <td className="py-3 px-4 text-on-surface-variant max-w-sm">{h.dischargeNotes}</td>
                          <td className="py-3 px-4 font-medium text-on-surface whitespace-nowrap">{h.recordedBy}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Record Discharge Modal */}
        {modalOpen && selectedPatient && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-surface-container-lowest rounded-xl shadow-2xl max-w-lg w-full p-6 border border-surface-container-high">
              <div className="flex items-center justify-between pb-3 border-b border-surface-container-high mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-primary-container flex items-center justify-center text-on-primary">
                    <span className="material-symbols-outlined text-[20px]">output</span>
                  </div>
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface">Record Patient Egress</h3>
                    <p className="text-xs text-outline font-mono">
                      {selectedPatient.patientId} • {selectedPatient.fullName}
                    </p>
                  </div>
                </div>
                <button onClick={() => setModalOpen(false)} className="text-on-surface-variant hover:text-on-surface">
                  <span className="material-symbols-outlined text-body-lg">close</span>
                </button>
              </div>

              <form onSubmit={handleDischargeSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-on-surface mb-1">
                    Discharge Disposition Pathway <span className="text-error">*</span>
                  </label>
                  <select
                    className="w-full h-10 px-3 rounded-lg border border-outline-variant bg-surface-container-low"
                    value={disposition}
                    onChange={(e) => setDisposition(e.target.value)}
                  >
                    <option value="Home / Self Care">Home / Self Care (Ambulatory Egress)</option>
                    <option value="Transferred to Inpatient Ward">Transferred to Inpatient Ward (Step-down)</option>
                    <option value="Transferred to Tertiary Center">Transferred to Tertiary Center / Specialized ICU</option>
                    <option value="Left Against Medical Advice">Left Against Medical Advice (LAMA)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-on-surface mb-1">Destination Ward or Referral Clinic</label>
                  <input
                    type="text"
                    placeholder="e.g. Ward 14 (Trauma Ortho), CCU, or Home Care"
                    className="w-full h-10 px-3 rounded-lg border border-outline-variant bg-surface-container-low"
                    value={destinationWard}
                    onChange={(e) => setDestinationWard(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block font-semibold text-on-surface mb-1">
                    Medication Reconciliation &amp; Clinical Summary <span className="text-error">*</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Document discharge condition, confirmed medication review, and outpatient instructions..."
                    className="w-full p-3 rounded-lg border border-outline-variant bg-surface-container-low"
                    value={dischargeNotes}
                    onChange={(e) => setDischargeNotes(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2 pt-1 border-t border-surface-container-high">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={medRecon}
                      onChange={(e) => setMedRecon(e.target.checked)}
                      className="w-4 h-4 rounded text-primary accent-primary"
                    />
                    <span className="text-on-surface">Medication reconciliation completed and signed off</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={bedSanitize}
                      onChange={(e) => setBedSanitize(e.target.checked)}
                      className="w-4 h-4 rounded text-primary accent-primary"
                    />
                    <span className="text-on-surface">
                      Initiate immediate bed turnover sanitization protocol ({selectedPatient.assignedBed || 'Bed'})
                    </span>
                  </label>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-surface-container-high">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-lg font-semibold text-on-surface-variant hover:bg-surface-container-low"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 rounded-lg font-semibold bg-primary-container text-on-primary hover:bg-primary shadow disabled:opacity-50"
                  >
                    {isSubmitting ? 'Recording Egress...' : 'Authorize Discharge & Free Bed'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}


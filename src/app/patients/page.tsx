'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import Link from 'next/link';

export default function PatientArrivalsPage() {
  const [patients, setPatients] = useState<any[]>([]);
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
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [wardFilter, setWardFilter] = useState('all');
  const [acuityFilter, setAcuityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Register Drawer Open/Close
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form Fields
  const [formFullName, setFormFullName] = useState('');
  const [formAge, setFormAge] = useState('');
  const [formGender, setFormGender] = useState('Male');
  const [formContact, setFormContact] = useState('');
  const [formArea, setFormArea] = useState('ETU Complex');
  const [formAcuity, setFormAcuity] = useState('Cat 2 - Trauma');
  const [formArrivalMode, setFormArrivalMode] = useState('Ambulance 1990');
  const [formComplaint, setFormComplaint] = useState('');
  const [formHistory, setFormHistory] = useState('');
  const [formBay, setFormBay] = useState('ETU-BAY-04');
  const [formDoctor, setFormDoctor] = useState('Dr. Elena Vance, MD');
  const [formNurse, setFormNurse] = useState('Sr. Elena Vance, RN');
  const [formHR, setFormHR] = useState('98');
  const [formBP, setFormBP] = useState('120/80');
  const [formSpO2, setFormSpO2] = useState('97');
  const [formGCS, setFormGCS] = useState('15');
  const [formNotes, setFormNotes] = useState('');

  // Selected Patient for Inspection Card
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);

  // Discharge Quick Modal from Details
  const [dischargeModalOpen, setDischargeModalOpen] = useState(false);
  const [dischargeDisposition, setDischargeDisposition] = useState('Home / Self Care');
  const [dischargeDestWard, setDischargeDestWard] = useState('Outpatient Follow-up');
  const [dischargeNotes, setDischargeNotes] = useState('');

  // Fetch Patients
  const fetchPatients = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (wardFilter !== 'all') params.set('ward', wardFilter);
      if (acuityFilter !== 'all') params.set('acuity', acuityFilter);
      if (statusFilter !== 'all') params.set('status', statusFilter);

      const res = await fetch(`/api/patients?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setPatients(data.patients);
        if (data.metrics) setMetrics(data.metrics);
        if (!selectedPatient && data.patients.length > 0) {
          setSelectedPatient(data.patients[0]);
        } else if (selectedPatient) {
          const updated = data.patients.find((p: any) => p.id === selectedPatient.id);
          if (updated) setSelectedPatient(updated);
        }
      }
    } catch (err) {
      console.error('Error fetching patients:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [search, wardFilter, acuityFilter, statusFilter]);

  // Handle Form Registration
  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFullName.trim() || !formComplaint.trim()) {
      alert('Patient full name and presenting complaint are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formFullName,
          age: formAge,
          gender: formGender,
          contactNumber: formContact,
          hospitalArea: formArea,
          category: formAcuity,
          arrivalMode: formArrivalMode,
          presentingComplaint: formComplaint,
          patientHistory: formHistory,
          assignedBed: formBay,
          assignedDoctor: formDoctor,
          assignedNurse: formNurse,
          heartRate: formHR,
          bloodPressure: formBP,
          spo2: formSpO2,
          gcs: formGCS,
          notes: formNotes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to register patient');
        setIsSubmitting(false);
        return;
      }

      setToastMessage(`Patient ${formFullName} (${data.patient.patientId}) successfully registered and assigned to ${formBay}.`);
      setIsRegisterOpen(false);
      // Reset form
      setFormFullName('');
      setFormAge('');
      setFormComplaint('');
      setFormHistory('');
      setFormNotes('');
      fetchPatients();
    } catch {
      alert('Network error registering patient.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick Discharge Action
  const handleQuickDischarge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    try {
      const res = await fetch('/api/discharge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: selectedPatient.id,
          disposition: dischargeDisposition,
          destinationWard: dischargeDestWard,
          dischargeNotes: dischargeNotes || 'Discharge confirmed by medical officer on duty.',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to discharge patient');
        return;
      }

      setToastMessage(`Patient ${selectedPatient.fullName} successfully discharged.`);
      setDischargeModalOpen(false);
      setDischargeNotes('');
      fetchPatients();
    } catch {
      alert('Network error executing discharge.');
    }
  };

  // Helper for Acuity Badge Styling matching Stitch
  const renderAcuityBadge = (cat: string) => {
    if (cat.includes('Cat 1')) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-error-container text-on-error-container border border-error/30">
          <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping"></span>
          Cat 1 • Resus
        </span>
      );
    }
    if (cat.includes('Cat 2')) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
          Cat 2 • Trauma
        </span>
      );
    }
    if (cat.includes('Cat 3')) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-surface-container-high text-primary border border-primary/20">
          Cat 3 • Urgent
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300">
        Cat 4/5 • Semi-Urgent
      </span>
    );
  };

  return (
    <AppLayout activeWard={wardFilter} onWardChange={(w) => setWardFilter(w)}>
      <div className="flex flex-col w-full">
        {/* Operational Disclaimer Banner */}
        <div className="mb-space-md p-space-sm rounded-lg bg-surface-container-high flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-secondary text-[20px]">science</span>
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
              Prototype Demo Telemetry — Synthetic Digital Twin Simulator • Live Hospital Records Gateway
            </span>
          </div>
          <div className="flex items-center gap-space-md text-on-surface-variant font-label-sm text-label-sm">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-primary-container animate-ping"></span>
              Sync Cycle: 250ms
            </span>
            <span className="bg-surface-container px-2 py-0.5 rounded text-on-surface font-semibold">
              Bay Node: ETU-TRAUMA-GW1
            </span>
          </div>
        </div>

        {/* Operational Summary Counters Bento */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-gutter mb-space-lg">
          {/* Card 1 */}
          <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-outline">
              <span className="font-label-sm text-label-sm uppercase tracking-wider">Total Arrivals Today</span>
              <span className="material-symbols-outlined text-[18px] text-primary">sensor_door</span>
            </div>
            <div className="mt-space-sm flex items-baseline gap-space-xs">
              <span className="font-headline-xl text-headline-xl text-on-surface tracking-tight">
                {metrics.totalArrivalsToday}
              </span>
              <span className="font-label-sm text-label-sm text-secondary font-bold">+8 vs yesterday</span>
            </div>
            <div className="mt-space-xs text-outline font-body-sm text-body-sm flex items-center gap-1">
              <span>Rolling 24h intake</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-outline">
              <span className="font-label-sm text-label-sm uppercase tracking-wider">Currently In Unit</span>
              <span className="material-symbols-outlined text-[18px] text-tertiary">bed</span>
            </div>
            <div className="mt-space-sm flex items-baseline gap-space-xs">
              <span className="font-headline-xl text-headline-xl text-primary tracking-tight">
                {metrics.activeInUnit}
              </span>
              <span className="font-label-sm text-label-sm text-outline">Capacity: {metrics.capacity}</span>
            </div>
            <div className="mt-space-xs text-on-surface-variant font-label-sm text-label-sm flex items-center justify-between">
              <span className="text-tertiary font-semibold">{metrics.etuActive} ETU Complex</span>
              <span className="text-outline">•</span>
              <span className="text-secondary font-semibold">{metrics.accidentActive} Accident Ward</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-outline">
              <span className="font-label-sm text-label-sm uppercase tracking-wider">Awaiting Step-down</span>
              <span className="material-symbols-outlined text-[18px] text-secondary">transfer_within_a_station</span>
            </div>
            <div className="mt-space-sm flex items-baseline gap-space-xs">
              <span className="font-headline-xl text-headline-xl text-secondary tracking-tight">
                {metrics.awaitingStepdown}
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Patients pending beds</span>
            </div>
            <div className="mt-space-xs text-outline font-body-sm text-body-sm">
              <span>Ward bed allocation lag: ~18m</span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-outline">
              <span className="font-label-sm text-label-sm uppercase tracking-wider">Discharges Today</span>
              <span className="material-symbols-outlined text-[18px] text-primary-container">output</span>
            </div>
            <div className="mt-space-sm flex items-baseline gap-space-xs">
              <span className="font-headline-xl text-headline-xl text-on-surface tracking-tight">
                {metrics.dischargesToday}
              </span>
              <span className="font-label-sm text-label-sm text-primary font-bold">↑ 94% on target</span>
            </div>
            <div className="mt-space-xs text-outline font-body-sm text-body-sm">
              <span>32 Home / 7 Specialised Transfer</span>
            </div>
          </div>

          {/* Card 5 */}
          <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-outline">
              <span className="font-label-sm text-label-sm uppercase tracking-wider">Triage-To-Bed Avg</span>
              <span className="material-symbols-outlined text-[18px] text-primary">timer</span>
            </div>
            <div className="mt-space-sm flex items-baseline gap-space-xs">
              <span className="font-headline-xl text-headline-xl text-primary tracking-tight">
                {metrics.triageToBedAvgMins}
              </span>
              <span className="font-label-lg text-label-lg text-primary font-semibold">mins</span>
            </div>
            <div className="mt-space-xs text-outline font-body-sm text-body-sm flex items-center justify-between">
              <span>Benchmark: ≤ 20m</span>
              <span className="text-tertiary font-bold">OPTIMAL</span>
            </div>
          </div>
        </div>

        {/* Operational Action & Filtering Bar */}
        <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm mb-space-lg flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-space-md">
          <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-space-sm">
            {/* Search Input */}
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-[20px]">search</span>
              <input
                className="w-full pl-10 pr-space-md py-2 text-on-surface bg-surface-container-low rounded-lg font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary-container"
                id="patientSearchInput"
                placeholder="Filter by Patient ID (e.g. PT-2026-0042), Name, or Symptom..."
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-space-xs flex-wrap sm:flex-nowrap">
              <select
                className="px-space-sm py-2 rounded-lg bg-surface-container-low text-on-surface font-label-md text-label-md focus:outline-none focus:ring-2 focus:ring-primary-container"
                value={wardFilter}
                onChange={(e) => setWardFilter(e.target.value)}
              >
                <option value="all">All Wards (ETU + Accident)</option>
                <option value="ETU Complex">ETU Complex (22 Active)</option>
                <option value="Accident Ward">Accident Ward (16 Active)</option>
              </select>

              <select
                className="px-space-sm py-2 rounded-lg bg-surface-container-low text-on-surface font-label-md text-label-md focus:outline-none focus:ring-2 focus:ring-primary-container"
                value={acuityFilter}
                onChange={(e) => setAcuityFilter(e.target.value)}
              >
                <option value="all">All Acuity Levels</option>
                <option value="Cat 1">Cat 1 • Resus (Immediate)</option>
                <option value="Cat 2">Cat 2 • Trauma (STAT 10m)</option>
                <option value="Cat 3">Cat 3 • Urgent (30m)</option>
                <option value="Cat 4">Cat 4/5 • Semi-Urgent</option>
              </select>

              <select
                className="px-space-sm py-2 rounded-lg bg-surface-container-low text-on-surface font-label-md text-label-md focus:outline-none focus:ring-2 focus:ring-primary-container"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="Under Treatment">Under Treatment</option>
                <option value="Active Intake">Active Intake</option>
                <option value="Awaiting Transfer">Awaiting Transfer</option>
              </select>
            </div>
          </div>

          {/* Toggle Register Panel Primary Action Button */}
          <div className="flex items-center gap-space-sm">
            <button
              className="h-10 px-space-md rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-all flex items-center justify-center gap-space-xs font-label-lg text-label-lg shadow-sm"
              onClick={() => setIsRegisterOpen(!isRegisterOpen)}
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">
                {isRegisterOpen ? 'close' : 'person_add'}
              </span>
              <span>{isRegisterOpen ? 'Close Intake Drawer' : 'Register New Arrival'}</span>
            </button>

            <Link
              href="/data-import"
              className="h-10 px-space-sm rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors flex items-center justify-center gap-space-xs font-label-md text-label-md"
              title="Import Historical Intake Datasets"
            >
              <span className="material-symbols-outlined text-[18px]">upload_file</span>
              <span className="hidden sm:inline">Import CSV</span>
            </Link>
          </div>
        </div>

        {/* Collapsible Register New Patient Form Drawer */}
        {isRegisterOpen && (
          <div className="mb-space-lg transition-all duration-300">
            <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-md flex flex-col gap-space-md border border-primary-container/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-space-sm gap-space-xs border-b border-surface-container-high">
                <div className="flex items-center gap-space-sm">
                  <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary">
                    <span className="material-symbols-outlined text-[20px]">add_task</span>
                  </div>
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface">
                      Direct Emergency Patient Intake Registration
                    </h3>
                    <p className="font-body-sm text-body-sm text-outline">
                      Instantly registers patient in database and generates verified sequence identifier.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-xs font-mono bg-primary-fixed text-on-primary-fixed font-bold">
                    Auto-ID Assigned on Submit
                  </span>
                </div>
              </div>

              <form onSubmit={handleRegistrationSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
                {/* Full Name */}
                <div className="flex flex-col gap-1">
                  <label className="font-label-md text-label-md text-on-surface">
                    Patient Full Name <span className="text-error">*</span>
                  </label>
                  <input
                    className="px-space-sm py-2 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary-container border border-outline-variant"
                    placeholder="e.g. Jonathan R. Miller"
                    type="text"
                    value={formFullName}
                    onChange={(e) => setFormFullName(e.target.value)}
                    required
                  />
                </div>

                {/* Age & Sex */}
                <div className="flex flex-col gap-1">
                  <label className="font-label-md text-label-md text-on-surface">
                    Age &amp; Biological Sex <span className="text-error">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      className="px-space-sm py-2 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary-container border border-outline-variant"
                      placeholder="Age"
                      type="number"
                      value={formAge}
                      onChange={(e) => setFormAge(e.target.value)}
                      required
                    />
                    <select
                      className="px-space-sm py-2 rounded-lg bg-surface-container-low text-on-surface font-label-md text-label-md border border-outline-variant"
                      value={formGender}
                      onChange={(e) => setFormGender(e.target.value)}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Contact Number */}
                <div className="flex flex-col gap-1">
                  <label className="font-label-md text-label-md text-on-surface">Contact Phone</label>
                  <input
                    className="px-space-sm py-2 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md border border-outline-variant"
                    placeholder="+94 77 123 4567"
                    type="text"
                    value={formContact}
                    onChange={(e) => setFormContact(e.target.value)}
                  />
                </div>

                {/* Hospital Area */}
                <div className="flex flex-col gap-1">
                  <label className="font-label-md text-label-md text-on-surface">
                    Intake Unit / Hospital Area <span className="text-error">*</span>
                  </label>
                  <select
                    className="px-space-sm py-2 rounded-lg bg-surface-container-low text-on-surface font-label-md text-label-md border border-outline-variant"
                    value={formArea}
                    onChange={(e) => setFormArea(e.target.value)}
                  >
                    <option value="ETU Complex">ETU Complex (Trauma &amp; Resus)</option>
                    <option value="Accident Ward">Accident Ward (Acute Casualties)</option>
                  </select>
                </div>

                {/* Acuity Level */}
                <div className="flex flex-col gap-1">
                  <label className="font-label-md text-label-md text-on-surface">
                    Triage Acuity Category <span className="text-error">*</span>
                  </label>
                  <select
                    className="px-space-sm py-2 rounded-lg bg-surface-container-low text-on-surface font-label-md text-label-md border border-outline-variant"
                    value={formAcuity}
                    onChange={(e) => setFormAcuity(e.target.value)}
                  >
                    <option value="Cat 1 - Resus">Cat 1 • Resuscitation (Immediate 0m)</option>
                    <option value="Cat 2 - Trauma">Cat 2 • Emergency / Trauma (&lt;10m)</option>
                    <option value="Cat 3 - Urgent">Cat 3 • Urgent Medical (&lt;30m)</option>
                    <option value="Cat 4 - Semi-Urgent">Cat 4 • Semi-Urgent (&lt;60m)</option>
                  </select>
                </div>

                {/* Arrival Mode */}
                <div className="flex flex-col gap-1">
                  <label className="font-label-md text-label-md text-on-surface">Arrival Transport Mode</label>
                  <select
                    className="px-space-sm py-2 rounded-lg bg-surface-container-low text-on-surface font-label-md text-label-md border border-outline-variant"
                    value={formArrivalMode}
                    onChange={(e) => setFormArrivalMode(e.target.value)}
                  >
                    <option value="Ambulance 1990">Ambulance 1990 (Suwa Seriya)</option>
                    <option value="Walk-in">Walk-in / Private Vehicle</option>
                    <option value="Hospital Transfer">Hospital Transfer / Provincial</option>
                    <option value="Police Vehicle">Police Vehicle / First Responder</option>
                  </select>
                </div>

                {/* Presenting Complaint */}
                <div className="flex flex-col gap-1 lg:col-span-2">
                  <label className="font-label-md text-label-md text-on-surface">
                    Presenting Complaint &amp; Acute Symptoms <span className="text-error">*</span>
                  </label>
                  <input
                    className="px-space-sm py-2 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md border border-outline-variant"
                    placeholder="e.g. Sudden severe retrosternal chest pain radiating to left jaw, diaphoresis"
                    type="text"
                    value={formComplaint}
                    onChange={(e) => setFormComplaint(e.target.value)}
                    required
                  />
                </div>

                {/* Assigned Bay */}
                <div className="flex flex-col gap-1">
                  <label className="font-label-md text-label-md text-on-surface">Assign Initial Bay</label>
                  <select
                    className="px-space-sm py-2 rounded-lg bg-surface-container-low text-on-surface font-label-md text-label-md border border-outline-variant"
                    value={formBay}
                    onChange={(e) => setFormBay(e.target.value)}
                  >
                    <option value="RESUS-01">RESUS-01 (Ventilator 1)</option>
                    <option value="RESUS-02">RESUS-02 (Ventilator 2)</option>
                    <option value="ETU-BAY-01">ETU-BAY-01 (Acute Monitored)</option>
                    <option value="ETU-BAY-04">ETU-BAY-04 (Observation)</option>
                    <option value="ACC-BAY-02">ACC-BAY-02 (Accident Ward)</option>
                    <option value="ACC-BAY-07">ACC-BAY-07 (Accident Ward)</option>
                  </select>
                </div>

                {/* Vitals Quadrant */}
                <div className="flex flex-col gap-1 lg:col-span-3 bg-surface-container-low p-space-sm rounded-lg border border-outline-variant/60">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline mb-1">
                    Baseline Physiological Vitals:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div>
                      <label className="text-[11px] font-semibold text-outline">Heart Rate (BPM)</label>
                      <input
                        className="w-full px-2 py-1.5 rounded bg-surface-container-lowest text-sm font-mono"
                        value={formHR}
                        onChange={(e) => setFormHR(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-outline">BP (Systolic/Dia)</label>
                      <input
                        className="w-full px-2 py-1.5 rounded bg-surface-container-lowest text-sm font-mono"
                        value={formBP}
                        onChange={(e) => setFormBP(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-outline">SpO2 (%)</label>
                      <input
                        className="w-full px-2 py-1.5 rounded bg-surface-container-lowest text-sm font-mono"
                        value={formSpO2}
                        onChange={(e) => setFormSpO2(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-outline">GCS (/15)</label>
                      <input
                        className="w-full px-2 py-1.5 rounded bg-surface-container-lowest text-sm font-mono"
                        value={formGCS}
                        onChange={(e) => setFormGCS(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* History & Notes */}
                <div className="flex flex-col gap-1 lg:col-span-3">
                  <label className="font-label-md text-label-md text-on-surface">
                    Past Medical History &amp; Clinical Comorbidities
                  </label>
                  <input
                    className="px-space-sm py-2 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md border border-outline-variant"
                    placeholder="e.g. Hypertension, Diabetes Mellitus, Previous CABG"
                    type="text"
                    value={formHistory}
                    onChange={(e) => setFormHistory(e.target.value)}
                  />
                </div>

                <div className="lg:col-span-3 flex items-center justify-end gap-space-sm pt-space-xs border-t border-surface-container-high">
                  <button
                    type="button"
                    onClick={() => setIsRegisterOpen(false)}
                    className="px-space-md py-2 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-space-lg py-2 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md hover:bg-primary transition-colors flex items-center gap-space-xs shadow-sm disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    <span>{isSubmitting ? 'Recording Arrival...' : 'Create Patient Record & Sync Twin'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Toast Success Notification */}
        {toastMessage && (
          <div className="mb-space-md p-space-sm rounded-lg bg-secondary-fixed text-on-secondary-fixed flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-space-sm">
              <span className="material-symbols-outlined text-[20px] text-secondary">check_circle</span>
              <span className="font-label-md text-label-md font-semibold">{toastMessage}</span>
            </div>
            <button onClick={() => setToastMessage(null)} className="text-on-secondary-fixed hover:opacity-75">
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        )}

        {/* Master Content Split: Main Table & Slide-out Inspection Card */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
          {/* Active Patients Table */}
          <div className={`${selectedPatient ? 'xl:col-span-8' : 'xl:col-span-12'} transition-all`}>
            <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-surface-container-high">
              <div className="p-space-md border-b border-surface-container-high flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-label-lg text-label-lg text-on-surface">Active Patient Roster</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-surface-container-low text-primary font-bold">
                    {patients.length} Live Records
                  </span>
                </div>
                <span className="text-xs text-outline font-mono">Updated: Just now</span>
              </div>

              {loading ? (
                <div className="p-12 text-center text-outline flex flex-col items-center gap-2">
                  <span className="material-symbols-outlined animate-spin text-[32px]">progress_activity</span>
                  <span>Streaming records from hospital registry...</span>
                </div>
              ) : patients.length === 0 ? (
                <div className="p-12 text-center text-outline flex flex-col items-center gap-2">
                  <span className="material-symbols-outlined text-[36px]">inbox</span>
                  <span>No patients match current filters. Click "Register New Arrival" to record a presentation.</span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-surface-container-low text-on-surface-variant text-[11px] uppercase tracking-wider font-semibold border-b border-surface-container-high">
                        <th className="py-3 px-4">Patient Identifier</th>
                        <th className="py-3 px-4">Acuity</th>
                        <th className="py-3 px-4">Demographics</th>
                        <th className="py-3 px-4">Ward / Bay</th>
                        <th className="py-3 px-4">Vitals</th>
                        <th className="py-3 px-4">Chief Complaint</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-container-high">
                      {patients.map((p) => {
                        const isSelected = selectedPatient?.id === p.id;
                        return (
                          <tr
                            key={p.id}
                            onClick={() => setSelectedPatient(p)}
                            className={`cursor-pointer transition-colors hover:bg-surface-container-low ${
                              isSelected ? 'bg-surface-container-low/80 font-medium' : ''
                            }`}
                          >
                            <td className="py-3 px-4 font-mono text-xs font-bold text-primary">
                              {p.patientId}
                              <span className="block text-[11px] font-sans font-normal text-on-surface mt-0.5">
                                {p.fullName}
                              </span>
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap">{renderAcuityBadge(p.category)}</td>
                            <td className="py-3 px-4 text-xs text-on-surface-variant whitespace-nowrap">
                              {p.age}y • {p.gender}
                              <span className="block text-[10px] text-outline mt-0.5">{p.arrivalMode}</span>
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap">
                              <span className="font-semibold text-xs text-on-surface block">{p.hospitalArea}</span>
                              <span className="inline-block px-1.5 py-0.5 text-[10px] font-mono rounded bg-surface-container text-primary font-bold mt-0.5">
                                {p.assignedBed || 'Waiting Bay'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-xs font-mono text-on-surface whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <span>HR {p.heartRate || 95}</span>
                                <span className="text-outline">|</span>
                                <span>BP {p.bloodPressure || '120/80'}</span>
                                <span className="text-outline">|</span>
                                <span className="text-secondary font-bold">SpO2 {p.spo2 || 98}%</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-xs text-on-surface-variant max-w-xs truncate" title={p.presentingComplaint}>
                              {p.presentingComplaint}
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap">
                              <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-surface-container text-on-surface">
                                {p.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => setSelectedPatient(p)}
                                className="px-2 py-1 rounded text-xs font-semibold text-primary hover:bg-surface-container transition-colors"
                              >
                                View
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedPatient(p);
                                  setDischargeModalOpen(true);
                                }}
                                className="ml-1 px-2 py-1 rounded text-xs font-semibold text-secondary hover:bg-surface-container transition-colors"
                              >
                                Discharge
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Slide-out Inspection Card */}
          {selectedPatient && (
            <div className="xl:col-span-4 transition-all">
              <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-md flex flex-col gap-space-md border border-surface-container-high sticky top-20">
                <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-high">
                  <div className="flex items-center gap-space-xs">
                    <span className="font-label-md text-label-md uppercase tracking-wider text-outline">
                      Patient Clinical Inspection
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedPatient(null)}
                    className="p-1 rounded text-on-surface-variant hover:text-on-surface"
                  >
                    <span className="material-symbols-outlined text-body-sm">close</span>
                  </button>
                </div>

                {/* Patient Summary Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                      {selectedPatient.fullName}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-mono text-xs text-primary font-bold">{selectedPatient.patientId}</span>
                      <span className="text-outline">•</span>
                      <span className="text-xs text-on-surface-variant">
                        {selectedPatient.age} yrs • {selectedPatient.gender}
                      </span>
                    </div>
                  </div>
                  {renderAcuityBadge(selectedPatient.category)}
                </div>

                {/* Bed & Transport Tag */}
                <div className="p-space-sm rounded-lg bg-surface-container-low flex items-center justify-between text-xs">
                  <div>
                    <span className="text-outline uppercase block text-[10px]">Location &amp; Bed</span>
                    <span className="font-bold text-on-surface">
                      {selectedPatient.hospitalArea} • {selectedPatient.assignedBed || 'Triage Holding'}
                    </span>
                  </div>
                  <div>
                    <span className="text-outline uppercase block text-[10px]">Arrival Transport</span>
                    <span className="font-semibold text-secondary">{selectedPatient.arrivalMode}</span>
                  </div>
                </div>

                {/* Live Physiological Vitals Panel */}
                <div>
                  <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider block mb-1">
                    Verified Physiological Vitals
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded bg-surface-container-low flex flex-col">
                      <span className="text-[10px] text-outline">Heart Rate</span>
                      <span className="text-base font-bold font-mono text-primary">
                        {selectedPatient.heartRate || 98} <span className="text-xs font-normal">BPM</span>
                      </span>
                    </div>
                    <div className="p-2 rounded bg-surface-container-low flex flex-col">
                      <span className="text-[10px] text-outline">Blood Pressure</span>
                      <span className="text-base font-bold font-mono text-on-surface">
                        {selectedPatient.bloodPressure || '120/80'}
                      </span>
                    </div>
                    <div className="p-2 rounded bg-surface-container-low flex flex-col">
                      <span className="text-[10px] text-outline">SpO2 Oxygen</span>
                      <span className="text-base font-bold font-mono text-secondary">
                        {selectedPatient.spo2 || 97}%
                      </span>
                    </div>
                    <div className="p-2 rounded bg-surface-container-low flex flex-col">
                      <span className="text-[10px] text-outline">GCS Score</span>
                      <span className="text-base font-bold font-mono text-tertiary">
                        {selectedPatient.gcs || 15} / 15
                      </span>
                    </div>
                  </div>
                </div>

                {/* Complaint & History */}
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-outline uppercase font-semibold block text-[10px]">
                      Presenting Complaint
                    </span>
                    <p className="text-on-surface mt-0.5 leading-relaxed">{selectedPatient.presentingComplaint}</p>
                  </div>
                  {selectedPatient.patientHistory && (
                    <div>
                      <span className="text-outline uppercase font-semibold block text-[10px]">
                        Medical History / Comorbidities
                      </span>
                      <p className="text-on-surface-variant mt-0.5">{selectedPatient.patientHistory}</p>
                    </div>
                  )}
                  {selectedPatient.notes && (
                    <div>
                      <span className="text-outline uppercase font-semibold block text-[10px]">Clinical Notes</span>
                      <p className="text-on-surface-variant mt-0.5 bg-surface-container-low p-2 rounded">
                        {selectedPatient.notes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Clinicians on Record */}
                <div className="p-2 rounded bg-surface-container text-xs flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-outline uppercase">Attending MO</span>
                    <span className="font-semibold text-on-surface">{selectedPatient.assignedDoctor || 'Dr. Elena Vance'}</span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-[10px] text-outline uppercase">Registered By</span>
                    <span className="font-semibold text-on-surface">{selectedPatient.registeredBy}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 pt-space-xs border-t border-surface-container-high">
                  <button
                    onClick={() => setDischargeModalOpen(true)}
                    className="w-full py-2.5 rounded-lg bg-primary-container text-on-primary text-xs font-semibold hover:bg-tertiary transition-colors shadow flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">output</span>
                    <span>Initiate Patient Discharge / Transfer</span>
                  </button>
                  <Link
                    href="/flow-history"
                    className="w-full py-2 rounded-lg bg-surface-container text-on-surface text-xs font-semibold hover:bg-surface-container-high text-center transition-colors"
                  >
                    View Flow Trajectory History
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Direct Discharge Modal */}
      {dischargeModalOpen && selectedPatient && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl max-w-lg w-full p-6 border border-surface-container-high">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container-high mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[24px]">output</span>
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">Confirm Patient Discharge</h3>
                  <span className="text-xs text-outline font-mono">
                    {selectedPatient.patientId} • {selectedPatient.fullName}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setDischargeModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-body-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleQuickDischarge} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-on-surface mb-1">Discharge Disposition</label>
                <select
                  className="w-full h-10 px-3 rounded-lg border border-outline-variant bg-surface-container-low"
                  value={dischargeDisposition}
                  onChange={(e) => setDischargeDisposition(e.target.value)}
                >
                  <option value="Home / Self Care">Home / Self Care</option>
                  <option value="Transferred to Inpatient Ward">Transferred to Inpatient Ward</option>
                  <option value="Transferred to Tertiary Center">Transferred to Tertiary Center / ICU</option>
                  <option value="Left Against Medical Advice">Left Against Medical Advice (LAMA)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-on-surface mb-1">Destination Ward / Unit</label>
                <input
                  type="text"
                  placeholder="e.g. Ward 14 (Trauma Ortho) or Home Follow-up"
                  className="w-full h-10 px-3 rounded-lg border border-outline-variant bg-surface-container-low"
                  value={dischargeDestWard}
                  onChange={(e) => setDischargeDestWard(e.target.value)}
                />
              </div>

              <div>
                <label className="block font-semibold text-on-surface mb-1">Clinical Discharge Summary &amp; Notes</label>
                <textarea
                  rows={3}
                  placeholder="Clinical disposition rationale, medication reconciliation, follow-up instructions..."
                  className="w-full p-3 rounded-lg border border-outline-variant bg-surface-container-low"
                  value={dischargeNotes}
                  onChange={(e) => setDischargeNotes(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container-high">
                <button
                  type="button"
                  onClick={() => setDischargeModalOpen(false)}
                  className="px-4 py-2 rounded-lg font-semibold text-on-surface-variant hover:bg-surface-container-low"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg font-semibold bg-primary-container text-on-primary hover:bg-primary shadow"
                >
                  Confirm Discharge &amp; Release Bed
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}


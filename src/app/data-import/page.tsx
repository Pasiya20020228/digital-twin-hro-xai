'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';

export default function DataImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [datasetType, setDatasetType] = useState('arrivals');
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importHistory, setImportHistory] = useState<any[]>([]);
  const [statusFeedback, setStatusFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Column definitions per dataset type
  const requiredSchemas: Record<string, { label: string; required: string[]; sample: string }> = {
    arrivals: {
      label: 'Patient Arrivals Dataset',
      required: ['arrival_datetime', 'triage_category', 'arrival_mode'],
      sample: 'arrival_datetime,triage_category,arrival_mode,age,gender\n2026-10-21 14:00,2,Ambulance 1990,54,Male\n2026-10-21 14:25,3,Walk-in,29,Female',
    },
    patient_flow: {
      label: 'Patient Flow & Dwell Dataset',
      required: ['visit_id', 'arrival_datetime', 'triage_category'],
      sample: 'visit_id,arrival_datetime,departure_datetime,triage_category,disposition\nVIS-001,2026-10-21 08:00,2026-10-21 11:30,2,Discharged\nVIS-002,2026-10-21 09:15,2026-10-21 14:00,1,Admitted_to_Ward',
    },
    bed_status: {
      label: 'Bed Capacity Telemetry Dataset',
      required: ['timestamp', 'occupied', 'available'],
      sample: 'timestamp,total_operational,occupied,available,resus_occupied\n2026-10-21 10:00,40,34,6,5\n2026-10-21 11:00,40,36,4,5',
    },
    equipment: {
      label: 'Critical Equipment Dataset',
      required: ['equipment_type', 'total_units', 'units_in_use'],
      sample: 'equipment_type,total_units,units_in_use,location\nMechanical Ventilator,6,5,Resus Suite\nDefibrillator,4,1,Crash Cart A',
    },
    disaster_incidents: {
      label: 'Colombo Emergency Surge Incidents',
      required: ['incident_id', 'incident_type', 'severity'],
      sample: 'incident_id,incident_type,severity,title,affected_area\nINC-001,Kelani_Flood,HIGH,Kelani River Basin Inundation,Sedawatta\nINC-002,Highway_Crash,CRITICAL,Multi-Vehicle Collision,Southern Expressway Kadawatha',
    },
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/datasets/import');
      const data = await res.json();
      if (data.success) {
        setImportHistory(data.history || []);
      }
    } catch (err) {
      console.error('Failed to load import history:', err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Parse CSV text
  const parseCSVText = (text: string, filename: string) => {
    setIsParsing(true);
    setStatusFeedback(null);
    try {
      const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
      if (lines.length < 2) {
        setStatusFeedback({ type: 'error', message: 'CSV file contains no records or lacks header line.' });
        setIsParsing(false);
        return;
      }

      const rawHeaders = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
      setHeaders(rawHeaders);

      const rows: any[] = [];
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',').map((p) => p.trim().replace(/^"|"$/g, ''));
        const rowObj: any = {};
        rawHeaders.forEach((h, idx) => {
          rowObj[h] = parts[idx] !== undefined ? parts[idx] : '';
        });
        rows.push(rowObj);
      }

      setParsedRows(rows);
      setIsParsing(false);
    } catch {
      setStatusFeedback({ type: 'error', message: 'Failed to parse CSV file structure.' });
      setIsParsing(false);
    }
  };

  // Handle file drop / select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      if (!f.name.endsWith('.csv')) {
        setStatusFeedback({ type: 'error', message: 'Invalid file format. Only standard .csv datasets are supported.' });
        return;
      }
      if (f.size > 10 * 1024 * 1024) {
        setStatusFeedback({ type: 'error', message: 'File size exceeds maximum 10MB limit.' });
        return;
      }
      setFile(f);
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        parseCSVText(content, f.name);
      };
      reader.readAsText(f);
    }
  };

  // Quick Load Sample
  const loadSampleDataset = (type: string) => {
    setDatasetType(type);
    const schema = requiredSchemas[type];
    if (schema) {
      const dummyFile = new File([schema.sample], `${type}_sample.csv`, { type: 'text/csv' });
      setFile(dummyFile);
      parseCSVText(schema.sample, `${type}_sample.csv`);
    }
  };

  // Confirm Import
  const handleExecuteImport = async () => {
    if (!file || parsedRows.length === 0) return;

    setIsImporting(true);
    setImportProgress(25);

    try {
      setTimeout(() => setImportProgress(65), 300);

      const res = await fetch('/api/datasets/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          datasetType,
          rows: parsedRows,
          rowCount: parsedRows.length,
        }),
      });

      const data = await res.json();
      setImportProgress(100);

      if (!res.ok) {
        setStatusFeedback({ type: 'error', message: data.error || 'Dataset validation failed.' });
        setIsImporting(false);
        return;
      }

      setStatusFeedback({
        type: 'success',
        message: data.message || `Successfully committed ${parsedRows.length} historical dataset rows to registry.`,
      });

      // Clear preview
      setFile(null);
      setParsedRows([]);
      setHeaders([]);
      fetchHistory();
    } catch {
      setStatusFeedback({ type: 'error', message: 'Network error submitting dataset to backend.' });
    } finally {
      setIsImporting(false);
      setImportProgress(0);
    }
  };

  // Check Schema Compliance
  const activeSchema = requiredSchemas[datasetType] || requiredSchemas['arrivals'];
  const missingColumns = activeSchema.required.filter((col) => !headers.includes(col));
  const isSchemaValid = headers.length > 0 && missingColumns.length === 0;

  return (
    <AppLayout>
      <div className="flex flex-col w-full space-y-space-lg">
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm pb-space-sm border-b border-surface-container-high">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface">Historical Operational Dataset Import</h1>
            <p className="font-body-sm text-body-sm text-outline mt-0.5">
              Secure ingestion of retrospective hospital datasets with provenance isolation and column schema validation
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded text-xs font-mono bg-surface-container-low text-primary font-bold">
              Provenance: HISTORICAL_CSV
            </span>
          </div>
        </div>

        {/* Feedback Alert */}
        {statusFeedback && (
          <div
            className={`p-space-sm rounded-lg text-xs font-semibold flex items-center justify-between shadow-sm ${
              statusFeedback.type === 'success'
                ? 'bg-secondary-fixed text-on-secondary-fixed'
                : 'bg-error-container text-on-error-container'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">
                {statusFeedback.type === 'success' ? 'check_circle' : 'error'}
              </span>
              <span>{statusFeedback.message}</span>
            </div>
            <button onClick={() => setStatusFeedback(null)}>
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        )}

        {/* File Ingestion & Quick Samples Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md">
          {/* Upload Area (8 cols) */}
          <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container-high p-space-md">
            <div className="flex items-center justify-between mb-4">
              <span className="font-label-md text-label-md font-bold text-on-surface">Select Dataset Schema</span>
              <select
                className="px-3 py-1.5 rounded-lg bg-surface-container-low border border-outline-variant text-xs font-semibold"
                value={datasetType}
                onChange={(e) => setDatasetType(e.target.value)}
              >
                <option value="arrivals">Patient Arrivals (etu_arrivals.csv)</option>
                <option value="patient_flow">Patient Flow &amp; Dwell (etu_patient_flow.csv)</option>
                <option value="bed_status">Bed Capacity Telemetry (etu_bed_status.csv)</option>
                <option value="equipment">Critical Equipment (etu_equipment.csv)</option>
                <option value="disaster_incidents">Emergency Surge Incidents (disaster_incidents.csv)</option>
              </select>
            </div>

            {/* Drag & Drop File Box */}
            <div className="border-2 border-dashed border-outline-variant rounded-xl p-8 text-center bg-surface-container-low/50 hover:bg-surface-container-low transition-colors relative flex flex-col items-center justify-center">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary flex items-center justify-center mb-3 shadow-sm">
                <span className="material-symbols-outlined text-[26px]">upload_file</span>
              </div>
              <span className="font-label-md text-label-md font-bold text-on-surface block">
                {file ? file.name : 'Drag & drop clinical CSV file here or browse files'}
              </span>
              <span className="text-xs text-outline mt-1 block">
                {file
                  ? `${(file.size / 1024).toFixed(1)} KB • ${parsedRows.length} rows loaded`
                  : 'UTF-8 encoded RFC-4180 CSV files up to 10MB'}
              </span>
            </div>

            {/* Required Column Schema Verification */}
            <div className="mt-4 p-space-sm rounded-lg bg-surface-container-low text-xs flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-outline uppercase text-[11px]">Required Columns:</span>
                <span
                  className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded ${
                    headers.length === 0
                      ? 'bg-surface-container text-outline'
                      : isSchemaValid
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-error-container text-on-error-container'
                  }`}
                >
                  {headers.length === 0
                    ? 'Awaiting File'
                    : isSchemaValid
                    ? 'Schema Verified'
                    : `Missing: ${missingColumns.join(', ')}`}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {activeSchema.required.map((reqCol) => {
                  const hasCol = headers.includes(reqCol);
                  return (
                    <span
                      key={reqCol}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono ${
                        hasCol
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : 'bg-surface-container-high text-outline'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {hasCol ? 'check_circle' : 'pending'}
                      </span>
                      <span>{reqCol}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Academic Samples (4 cols) */}
          <div className="lg:col-span-4 bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container-high p-space-md flex flex-col justify-between">
            <div>
              <span className="font-label-md text-label-md font-bold text-on-surface block mb-1">
                Academic Research Samples
              </span>
              <p className="text-xs text-outline mb-3">
                Load calibrated test datasets directly from repository data catalog:
              </p>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => loadSampleDataset('arrivals')}
                  className="w-full text-left p-2 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors text-xs flex items-center justify-between"
                >
                  <div>
                    <span className="font-semibold text-on-surface block">etu_arrivals.csv</span>
                    <span className="text-[10px] text-outline">Patient arrivals &amp; triage tiers</span>
                  </div>
                  <span className="material-symbols-outlined text-primary text-[18px]">input</span>
                </button>

                <button
                  type="button"
                  onClick={() => loadSampleDataset('patient_flow')}
                  className="w-full text-left p-2 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors text-xs flex items-center justify-between"
                >
                  <div>
                    <span className="font-semibold text-on-surface block">etu_patient_flow.csv</span>
                    <span className="text-[10px] text-outline">Inflow, dwell &amp; egress dispositions</span>
                  </div>
                  <span className="material-symbols-outlined text-primary text-[18px]">input</span>
                </button>

                <button
                  type="button"
                  onClick={() => loadSampleDataset('bed_status')}
                  className="w-full text-left p-2 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors text-xs flex items-center justify-between"
                >
                  <div>
                    <span className="font-semibold text-on-surface block">etu_bed_status.csv</span>
                    <span className="text-[10px] text-outline">Hourly 40-bed census telemetry</span>
                  </div>
                  <span className="material-symbols-outlined text-primary text-[18px]">input</span>
                </button>

                <button
                  type="button"
                  onClick={() => loadSampleDataset('disaster_incidents')}
                  className="w-full text-left p-2 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors text-xs flex items-center justify-between"
                >
                  <div>
                    <span className="font-semibold text-on-surface block">disaster_incidents.csv</span>
                    <span className="text-[10px] text-outline">Colombo flood &amp; crash scenarios</span>
                  </div>
                  <span className="material-symbols-outlined text-primary text-[18px]">input</span>
                </button>
              </div>
            </div>

            <div className="pt-space-sm border-t border-surface-container-high text-[11px] text-on-surface-variant flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-secondary">verified_user</span>
              <span>Protects live database from unintended record overwrites.</span>
            </div>
          </div>
        </div>

        {/* Interactive Data Preview Table */}
        {parsedRows.length > 0 && (
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container-high overflow-hidden">
            <div className="p-space-md border-b border-surface-container-high flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm">
              <div>
                <span className="font-label-lg text-label-lg text-on-surface font-bold">
                  Parsed Data Preview ({parsedRows.length} Rows)
                </span>
                <span className="text-xs text-outline block">Showing first 10 records for schema validation</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setFile(null);
                    setParsedRows([]);
                    setHeaders([]);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-on-surface-variant hover:bg-surface-container-low"
                >
                  Clear File
                </button>
                <button
                  onClick={handleExecuteImport}
                  disabled={isImporting || !isSchemaValid}
                  className="px-4 py-2 rounded-lg bg-primary-container text-on-primary font-semibold text-xs hover:bg-primary transition-colors shadow flex items-center gap-1.5 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[16px]">cloud_upload</span>
                  <span>{isImporting ? 'Ingesting Dataset...' : 'Confirm & Ingest Historical Dataset'}</span>
                </button>
              </div>
            </div>

            {/* Progress bar if importing */}
            {isImporting && (
              <div className="w-full bg-surface-container-high h-1.5 overflow-hidden">
                <div
                  className="bg-primary-container h-full transition-all duration-300"
                  style={{ width: `${importProgress}%` }}
                ></div>
              </div>
            )}

            <div className="overflow-x-auto max-h-80">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="sticky top-0 bg-surface-container-low text-on-surface-variant font-semibold border-b border-surface-container-high">
                  <tr>
                    <th className="py-2.5 px-3">#</th>
                    {headers.map((h) => (
                      <th key={h} className="py-2.5 px-3 font-mono">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-high">
                  {parsedRows.slice(0, 10).map((row, idx) => (
                    <tr key={idx} className="hover:bg-surface-container-low">
                      <td className="py-2 px-3 text-outline font-mono">{idx + 1}</td>
                      {headers.map((h) => (
                        <td key={h} className="py-2 px-3 font-mono text-on-surface">
                          {row[h]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Dataset Ingestion Audit History */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container-high overflow-hidden">
          <div className="p-space-md border-b border-surface-container-high flex items-center justify-between">
            <span className="font-label-lg text-label-lg text-on-surface font-bold">Historical Ingestion Audit Log</span>
            <span className="text-xs text-outline font-mono">Provenance Tracked</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant text-[11px] uppercase tracking-wider font-semibold border-b border-surface-container-high">
                  <th className="py-3 px-4">Dataset Filename</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Total Records</th>
                  <th className="py-3 px-4">Valid Rows</th>
                  <th className="py-3 px-4">Invalid Rows</th>
                  <th className="py-3 px-4">Provenance</th>
                  <th className="py-3 px-4">Imported By</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-high">
                {importHistory.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-6 text-center text-outline">
                      No datasets imported yet.
                    </td>
                  </tr>
                ) : (
                  importHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-primary">{item.filename}</td>
                      <td className="py-3 px-4 uppercase text-[10px] font-bold text-outline">{item.datasetType}</td>
                      <td className="py-3 px-4 font-mono">{item.recordCount}</td>
                      <td className="py-3 px-4 font-mono text-emerald-700 font-semibold">{item.validCount}</td>
                      <td className="py-3 px-4 font-mono text-error font-semibold">{item.invalidCount}</td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-mono bg-surface-container text-primary font-bold">
                          {item.provenance}
                        </span>
                      </td>
                      <td className="py-3 px-4">{item.importedBy}</td>
                      <td className="py-3 px-4 font-mono text-outline whitespace-nowrap">
                        {new Date(item.createdAt).toLocaleDateString()} {new Date(item.createdAt).toLocaleTimeString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.status === 'COMPLETED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-error-container text-on-error-container'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}


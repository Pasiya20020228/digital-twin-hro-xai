'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useRouter } from 'next/navigation';

export default function AdminGovernancePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'matrix' | 'audits'>('users');
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Check user authorization
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (!data.authenticated || !['SYSTEM_ADMIN', 'HOSPITAL_ADMIN'].includes(data.user?.role)) {
          router.push('/auth/access-denied');
          return;
        }
        setCurrentUser(data.user);
        loadAdminData();
      })
      .catch(() => router.push('/auth/access-denied'));
  }, [router]);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [uRes, aRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/audit-logs'),
      ]);
      const uData = await uRes.json();
      const aData = await aRes.json();
      if (uData.success) setUsers(uData.users || []);
      if (aData.success) setAuditLogs(aData.logs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Update user status
  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to update user status');
        return;
      }
      setFeedback(`User account status updated to ${newStatus}.`);
      loadAdminData();
    } catch {
      alert('Error updating user status');
    }
  };

  // Update user role
  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to update user role');
        return;
      }
      setFeedback(`User authorized role elevated to ${newRole}.`);
      loadAdminData();
    } catch {
      alert('Error updating user role');
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col w-full space-y-space-lg">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm pb-space-sm border-b border-surface-container-high">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">shield</span>
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-headline-lg text-headline-lg text-on-surface">Administrative Governance Portal</h1>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-primary-fixed text-on-primary-fixed font-bold">
                    Tier 4 Security
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-outline">
                  Institutional user authorization, role-based access control (RBAC), and immutable regulatory audit trail
                </p>
              </div>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded text-xs font-mono bg-surface-container text-primary font-semibold">
            Admin: {currentUser?.name} ({currentUser?.role})
          </span>
        </div>

        {feedback && (
          <div className="p-space-sm rounded-lg bg-secondary-fixed text-on-secondary-fixed text-xs font-semibold flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              <span>{feedback}</span>
            </div>
            <button onClick={() => setFeedback(null)}>
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        )}

        {/* Tab Controls */}
        <div className="flex bg-surface-container-low p-1 rounded-lg w-fit text-xs font-semibold">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'users'
                ? 'bg-surface-container-lowest text-primary font-bold shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">manage_accounts</span>
            <span>Clinical User Roster ({users.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'matrix'
                ? 'bg-surface-container-lowest text-primary font-bold shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">lock_person</span>
            <span>RBAC Permission Matrix</span>
          </button>
          <button
            onClick={() => setActiveTab('audits')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'audits'
                ? 'bg-surface-container-lowest text-primary font-bold shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">fact_check</span>
            <span>Regulatory Audit Trail ({auditLogs.length})</span>
          </button>
        </div>

        {/* TAB 1: USERS ROSTER */}
        {activeTab === 'users' && (
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container-high overflow-hidden">
            <div className="p-space-md border-b border-surface-container-high flex items-center justify-between">
              <span className="font-label-lg text-label-lg text-on-surface font-bold">Authorized Personnel Registry</span>
              <span className="text-xs text-outline font-mono">Enforced with Server-side Authentication Guards</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant text-[11px] uppercase tracking-wider font-semibold border-b border-surface-container-high">
                    <th className="py-3 px-4">Staff Member</th>
                    <th className="py-3 px-4">Identifier / Email</th>
                    <th className="py-3 px-4">Department &amp; Designation</th>
                    <th className="py-3 px-4">System Role</th>
                    <th className="py-3 px-4">Access Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-high">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="py-3 px-4 font-bold text-on-surface">
                        {u.name}
                        <span className="block text-[10px] text-outline font-mono font-normal">{u.preferredWorkArea}</span>
                      </td>
                      <td className="py-3 px-4 font-mono">
                        <span className="font-bold text-primary block">{u.staffId}</span>
                        <span className="text-on-surface-variant">{u.email}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold block">{u.designation}</span>
                        <span className="text-outline text-[10px]">{u.department}</span>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          className="px-2 py-1 rounded bg-surface-container-low border border-outline-variant font-mono text-[11px] font-bold"
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        >
                          <option value="DOCTOR">DOCTOR</option>
                          <option value="NURSE">NURSE</option>
                          <option value="HOSPITAL_ADMIN">HOSPITAL_ADMIN</option>
                          <option value="SYSTEM_ADMIN">SYSTEM_ADMIN</option>
                          <option value="STAFF">STAFF</option>
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            u.status === 'APPROVED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : u.status === 'PENDING'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-error-container text-on-error-container'
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        {u.status === 'PENDING' ? (
                          <button
                            onClick={() => handleStatusChange(u.id, 'APPROVED')}
                            className="px-2.5 py-1 rounded bg-emerald-700 text-white font-semibold text-[11px] hover:bg-emerald-800 shadow-sm"
                          >
                            Approve
                          </button>
                        ) : u.status === 'APPROVED' ? (
                          <button
                            onClick={() => handleStatusChange(u.id, 'DISABLED')}
                            className="px-2.5 py-1 rounded bg-error-container text-on-error-container font-semibold text-[11px] hover:bg-error/20"
                          >
                            Disable
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStatusChange(u.id, 'APPROVED')}
                            className="px-2.5 py-1 rounded bg-surface-container text-primary font-semibold text-[11px] hover:bg-surface-container-high"
                          >
                            Reactivate
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: RBAC MATRIX */}
        {activeTab === 'matrix' && (
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container-high p-space-md">
            <span className="font-label-lg text-label-lg text-on-surface font-bold block mb-2">
              Role &amp; Permission Access Matrix
            </span>
            <p className="text-xs text-outline mb-4">
              Cryptographically enforced capability sets across clinical, operational, and system tiers
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant font-semibold border-b border-surface-container-high">
                    <th className="py-2.5 px-3">System Permission</th>
                    <th className="py-2.5 px-3 text-center">DOCTOR</th>
                    <th className="py-2.5 px-3 text-center">NURSE</th>
                    <th className="py-2.5 px-3 text-center">HOSPITAL_ADMIN</th>
                    <th className="py-2.5 px-3 text-center">SYSTEM_ADMIN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-high">
                  {[
                    { name: 'Register Patient Arrival & Bed Intake', doc: true, nurse: true, hosp: true, sys: true },
                    { name: 'Authorize Clinical Patient Discharge', doc: true, nurse: false, hosp: true, sys: true },
                    { name: 'Review & Override AI Recommendations (HITL)', doc: true, nurse: false, hosp: true, sys: true },
                    { name: 'Import Retrospective CSV Datasets', doc: false, nurse: false, hosp: true, sys: true },
                    { name: 'Approve & Disable User Accounts', doc: false, nurse: false, hosp: true, sys: true },
                    { name: 'Elevate System Administrator Credentials', doc: false, nurse: false, hosp: false, sys: true },
                    { name: 'View Regulatory Security Audit Trail', doc: false, nurse: false, hosp: true, sys: true },
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-surface-container-low">
                      <td className="py-2.5 px-3 font-medium text-on-surface">{row.name}</td>
                      <td className="py-2.5 px-3 text-center">{row.doc ? '✅' : '—'}</td>
                      <td className="py-2.5 px-3 text-center">{row.nurse ? '✅' : '—'}</td>
                      <td className="py-2.5 px-3 text-center">{row.hosp ? '✅' : '—'}</td>
                      <td className="py-2.5 px-3 text-center">{row.sys ? '✅' : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: AUDIT LOGS */}
        {activeTab === 'audits' && (
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container-high overflow-hidden">
            <div className="p-space-md border-b border-surface-container-high flex items-center justify-between">
              <span className="font-label-lg text-label-lg text-on-surface font-bold">Immutable Audit Trail</span>
              <span className="text-xs text-outline font-mono">SHA-256 Event Signatures</span>
            </div>

            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="sticky top-0 bg-surface-container-low text-on-surface-variant font-semibold border-b border-surface-container-high">
                  <tr>
                    <th className="py-2.5 px-3">Timestamp</th>
                    <th className="py-2.5 px-3">Action</th>
                    <th className="py-2.5 px-3">Entity</th>
                    <th className="py-2.5 px-3">Performed By</th>
                    <th className="py-2.5 px-3">Details / Metadata</th>
                    <th className="py-2.5 px-3">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-high">
                  {auditLogs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-outline">
                        No audit events logged.
                      </td>
                    </tr>
                  ) : (
                    auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-surface-container-low">
                        <td className="py-2.5 px-3 font-mono text-outline whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold text-primary">{log.action}</td>
                        <td className="py-2.5 px-3 text-on-surface font-semibold">{log.entityType}</td>
                        <td className="py-2.5 px-3 font-mono">{log.performedBy}</td>
                        <td className="py-2.5 px-3 font-mono text-on-surface-variant max-w-xs truncate" title={log.details}>
                          {log.details || '—'}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-outline">{log.ipAddress}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}


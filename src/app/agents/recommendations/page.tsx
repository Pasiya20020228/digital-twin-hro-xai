'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';

export default function RecommendationsAgentPage() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [overrideModal, setOverrideModal] = useState<any | null>(null);
  const [overrideNotes, setOverrideNotes] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchRecs = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/recommendations');
      const data = await res.json();
      if (data.success) {
        setRecommendations(data.recommendations || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecs();
  }, []);

  const handleDecision = async (id: string, decision: 'APPROVED' | 'REJECTED' | 'OVERRIDDEN', notes?: string) => {
    try {
      const res = await fetch('/api/recommendations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, decision, overrideNotes: notes }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedback(`Recommendation ${decision.toLowerCase()} successfully with clinical audit log.`);
        setOverrideModal(null);
        setOverrideNotes('');
        fetchRecs();
      }
    } catch {
      alert('Error updating recommendation.');
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col w-full space-y-space-lg">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm pb-space-sm border-b border-surface-container-high">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-tertiary text-on-tertiary flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">psychology</span>
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-headline-lg text-headline-lg text-on-surface">
                    Agent 3 • Explainable Recommendation Coordination
                  </h1>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-tertiary-fixed text-on-tertiary font-bold">
                    Google OR-Tools MILP
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-outline">
                  Constrained mathematical optimization with guaranteed Human-in-the-Loop (HITL) review gates
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded text-xs font-mono bg-surface-container-low text-primary font-bold">
              Autonomous Physical Actuation Disabled
            </span>
          </div>
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

        {/* Human-in-the-Loop Protocol Disclaimer */}
        <div className="p-space-sm rounded-lg bg-surface-container-high border border-surface-container-highest flex items-center justify-between text-xs text-on-surface-variant">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[20px]">verified_user</span>
            <span className="font-medium">
              Every optimization action requires verified human clinical sign-off and generates an immutable audit signature.
            </span>
          </div>
          <span className="text-outline font-mono text-[11px]">ISO-27799 Compliant</span>
        </div>

        {/* Recommendations List */}
        <div className="space-y-space-md">
          {loading ? (
            <div className="p-12 text-center text-outline">Evaluating optimization proposals...</div>
          ) : recommendations.length === 0 ? (
            <div className="p-12 text-center text-outline">No active recommendation advisories generated.</div>
          ) : (
            recommendations.map((rec) => (
              <div
                key={rec.id}
                className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container-high p-space-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-primary">{rec.recommendationCode}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-surface-container text-on-surface">
                      {rec.category}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        rec.status === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : rec.status === 'REJECTED'
                          ? 'bg-error-container text-on-error-container'
                          : rec.status === 'OVERRIDDEN'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {rec.status}
                    </span>
                  </div>

                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">{rec.action}</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed max-w-3xl">{rec.rationale}</p>

                  {rec.reviewedBy && (
                    <div className="text-[11px] text-outline font-mono pt-1">
                      Reviewed by {rec.reviewedBy} at {new Date(rec.reviewedAt).toLocaleTimeString()}
                      {rec.overrideNotes && ` • Override Note: "${rec.overrideNotes}"`}
                    </div>
                  )}
                </div>

                {/* Impact Score & Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-space-md shrink-0 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 border-surface-container-high">
                  <div className="p-2 rounded-lg bg-surface-container-low text-center min-w-[90px]">
                    <span className="text-[10px] font-semibold text-outline uppercase block">Impact Score</span>
                    <span className="font-mono text-lg font-bold text-primary">{rec.impactScore} / 10</span>
                  </div>

                  {rec.status === 'PENDING' ? (
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => handleDecision(rec.id, 'REJECTED')}
                        className="px-3 py-2 rounded-lg text-xs font-semibold text-error hover:bg-surface-container transition-colors"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => setOverrideModal(rec)}
                        className="px-3 py-2 rounded-lg text-xs font-semibold bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors"
                      >
                        Override...
                      </button>
                      <button
                        onClick={() => handleDecision(rec.id, 'APPROVED')}
                        className="px-4 py-2 rounded-lg text-xs font-semibold bg-primary-container text-on-primary hover:bg-primary shadow transition-colors"
                      >
                        Approve Allocation
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs font-semibold text-outline">Action Finalized</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Override Modal */}
        {overrideModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-surface-container-lowest rounded-xl shadow-2xl max-w-md w-full p-6 border border-surface-container-high text-xs">
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2 font-bold">
                Clinical Override Justification
              </h3>
              <p className="text-on-surface-variant mb-4">
                You are overriding algorithm recommendation <strong>{overrideModal.recommendationCode}</strong>.
                State the clinical rationale for the immutable safety audit log:
              </p>
              <textarea
                rows={4}
                className="w-full p-3 rounded-lg border border-outline-variant bg-surface-container-low mb-4"
                placeholder="Document clinical override reason..."
                value={overrideNotes}
                onChange={(e) => setOverrideNotes(e.target.value)}
                required
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => setOverrideModal(null)}
                  className="px-4 py-2 rounded-lg font-semibold text-on-surface-variant hover:bg-surface-container-low"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDecision(overrideModal.id, 'OVERRIDDEN', overrideNotes)}
                  disabled={!overrideNotes.trim()}
                  className="px-4 py-2 rounded-lg font-semibold bg-primary-container text-on-primary hover:bg-primary shadow disabled:opacity-50"
                >
                  Submit Clinical Override
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}


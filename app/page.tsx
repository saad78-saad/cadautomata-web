"use client";

import React, { useState } from "react";

export default function Home() {
  const [form, setForm] = useState({
    component_id: "BRACKET-001",
    name: "Mounting Bracket",
    target_length_mm: 105.0,
    target_width_mm: 52.0,
    target_height_mm: 25.0,
    material: "Steel",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    // Point to your backend (update this later with your Render or Railway URL)
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://cadautomata-production.up.railway.app";

    try {
      const res = await fetch(`${apiUrl}/api/process-component`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          target_length_mm: parseFloat(String(form.target_length_mm)),
          target_width_mm: parseFloat(String(form.target_width_mm)),
          target_height_mm: parseFloat(String(form.target_height_mm)),
        }),
      });

      if (!res.ok) throw new Error("Failed to process component on backend.");
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8 flex flex-col items-center">
      <div className="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl">
        <h1 className="text-2xl font-bold mb-2 text-indigo-400">CADAutomata Cloud Dashboard</h1>
        <p className="text-slate-400 text-sm mb-6">BOM-Driven RAG & CAD Adaptation Pipeline</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Component ID</label>
              <input name="component_id" value={form.component_id} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-sm" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Component Name</label>
              <input name="name" value={form.name} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-sm" required />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Length (mm)</label>
              <input type="number" step="any" name="target_length_mm" value={form.target_length_mm} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-sm" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Width (mm)</label>
              <input type="number" step="any" name="target_width_mm" value={form.target_width_mm} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-sm" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Height (mm)</label>
              <input type="number" step="any" name="target_height_mm" value={form.target_height_mm} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-sm" required />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Material</label>
            <input name="material" value={form.material} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-sm" required />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-500 transition font-semibold p-2.5 rounded text-sm mt-2 disabled:opacity-50">
            {loading ? "Processing via Cloud RAG..." : "Run Adaptation Pipeline"}
          </button>
        </form>

        {error && <div className="mt-4 p-3 bg-red-950 border border-red-800 rounded text-red-200 text-sm">{error}</div>}

        {result && (
          <div className="mt-6 p-4 bg-slate-800 border border-slate-700 rounded">
            <h2 className="text-sm font-bold text-emerald-400 mb-2">Pipeline Execution Success</h2>
            <pre className="text-xs text-slate-300 overflow-x-auto bg-slate-950 p-3 rounded">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}
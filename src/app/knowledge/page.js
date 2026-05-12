'use client';

import { useState, useEffect } from 'react';

const SECTIONS = [
  {
    id: 'general',
    label: 'General Company Knowledge',
    description:
      'Company overview, CEO bio, product, links (Calendly, deck, website). This is included in every reply.',
  },
  {
    id: 'linkedin_investors',
    label: 'LinkedIn → Investors',
    description: 'Tone, what to push for, how to handle objections, investor-specific talking points.',
  },
  {
    id: 'linkedin_colleges',
    label: 'LinkedIn → D1 Colleges',
    description: 'Tone, how to approach coaches/ADs, what value to highlight, next steps.',
  },
  {
    id: 'linkedin_agencies',
    label: 'LinkedIn → Sports Agencies',
    description: 'Tone, partnership framing, what to offer, how to progress the conversation.',
  },
  {
    id: 'email_investors',
    label: 'Email → Investors',
    description: 'Email tone, subject angle tips, what links to include, follow-up behavior.',
  },
  {
    id: 'email_athletes',
    label: 'Email → Athletes',
    description: 'Tone for athletes, what to say to those who applied vs. those in the network.',
  },
];

function KbSection({ section, initialContent }) {
  const [content, setContent] = useState(initialContent || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  async function save() {
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: section.id, content }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-3">
      <div>
        <h2 className="font-medium text-white">{section.label}</h2>
        <p className="text-xs text-gray-500 mt-0.5">{section.description}</p>
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={7}
        placeholder="Write instructions, context, links, tone guidance..."
        className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-gray-500 resize-y"
      />
      {error && <p className="text-red-400 text-xs">{error}</p>}
      <div className="flex items-center gap-3">
        <button
          onClick={save}
          disabled={saving}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
        {saved && <span className="text-green-400 text-sm">✓ Saved</span>}
      </div>
    </div>
  );
}

export default function KnowledgePage() {
  const [kbMap, setKbMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    fetch('/api/knowledge')
      .then((r) => r.json())
      .then((rows) => {
        const map = {};
        rows.forEach((r) => (map[r.id] = r.content));
        setKbMap(map);
      })
      .catch((e) => setFetchError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-gray-500 text-sm">Loading knowledge base...</p>;
  }

  if (fetchError) {
    return <p className="text-red-400 text-sm">Error: {fetchError}</p>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-white">Knowledge Base</h1>
        <p className="text-sm text-gray-500 mt-1">
          Edit the context and instructions the AI uses when drafting replies. Each section is
          independent — save them one at a time.
        </p>
      </div>

      <div className="space-y-5">
        {SECTIONS.map((section) => (
          <KbSection
            key={section.id}
            section={section}
            initialContent={kbMap[section.id] || ''}
          />
        ))}
      </div>
    </div>
  );
}

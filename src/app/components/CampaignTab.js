'use client';

import { useState, useRef } from 'react';

export default function CampaignTab({ campaign }) {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState('');
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const fileRef = useRef(null);

  async function generate() {
    if (!text.trim() && !image) {
      setError('Paste a conversation or upload a screenshot.');
      return;
    }
    setError('');
    setDraft('');
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('campaign', campaign.id);
      fd.append('text', text);
      if (image) fd.append('image', image);

      const res = await fetch('/api/generate', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate');
      setDraft(data.draft);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setImageName(file.name);
  }

  function removeImage() {
    setImage(null);
    setImageName('');
    if (fileRef.current) fileRef.current.value = '';
  }

  async function copy() {
    await navigator.clipboard.writeText(draft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-5">
      {/* Conversation input */}
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Paste the conversation
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          placeholder="Paste the full message thread here..."
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-gray-500 resize-y"
        />
      </div>

      {/* Screenshot upload */}
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Or upload a screenshot
        </label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="px-4 py-2 text-sm bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg transition-colors"
          >
            Choose file
          </button>
          {imageName ? (
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <span>{imageName}</span>
              <button
                type="button"
                onClick={removeImage}
                className="text-gray-500 hover:text-red-400 transition-colors text-xs"
              >
                ✕ remove
              </button>
            </div>
          ) : (
            <span className="text-sm text-gray-600">No file chosen</span>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="hidden"
        />
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        onClick={generate}
        disabled={loading}
        className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors"
      >
        {loading ? 'Generating draft...' : 'Generate Draft'}
      </button>

      {/* Draft output */}
      {draft && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-400">Draft Reply</label>
            <button
              onClick={copy}
              className="text-xs px-3 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-md transition-colors"
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
          <div className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-4 text-sm text-gray-100 whitespace-pre-wrap leading-relaxed">
            {draft}
          </div>
        </div>
      )}
    </div>
  );
}

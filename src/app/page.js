'use client';

import { useState } from 'react';
import CampaignTab from './components/CampaignTab';

const CAMPAIGNS = [
  { id: 'linkedin_investors', label: 'LinkedIn → Investors', icon: '💼' },
  { id: 'linkedin_colleges', label: 'LinkedIn → D1 Colleges', icon: '🎓' },
  { id: 'linkedin_agencies', label: 'LinkedIn → Sports Agencies', icon: '🏆' },
  { id: 'email_investors', label: 'Email → Investors', icon: '📧' },
  { id: 'email_athletes', label: 'Email → Athletes', icon: '🏃' },
];

export default function Home() {
  const [active, setActive] = useState(CAMPAIGNS[0].id);
  const activeCampaign = CAMPAIGNS.find((c) => c.id === active);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-white">Draft a Reply</h1>
        <p className="text-sm text-gray-500 mt-1">
          Select the campaign, paste the conversation or upload a screenshot, and get a draft.
        </p>
      </div>

      {/* Campaign tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CAMPAIGNS.map((c) => (
          <button
            key={c.id}
            onClick={() => setActive(c.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              active === c.id
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
            }`}
          >
            {c.icon} {c.label}
          </button>
        ))}
      </div>

      {/* Active tab content — remount on tab change to reset state */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <CampaignTab key={active} campaign={activeCampaign} />
      </div>
    </div>
  );
}

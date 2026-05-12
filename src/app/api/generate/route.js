import Anthropic from '@anthropic-ai/sdk';
import { getSupabaseClient } from '../../../../lib/supabase';
import { NextResponse } from 'next/server';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const CAMPAIGN_LABELS = {
  linkedin_investors: 'LinkedIn outreach to a potential investor',
  linkedin_colleges: 'LinkedIn outreach to a D1 college (athletic department or coach)',
  linkedin_agencies: 'LinkedIn outreach to a sports agency',
  email_investors: 'email campaign to a potential investor',
  email_athletes: 'email campaign to an athlete (either applied or already in the network)',
};

export async function POST(request) {
  const formData = await request.formData();
  const campaign = formData.get('campaign');
  const text = formData.get('text') || '';
  const imageFile = formData.get('image');

  const { data: kbRows, error } = await getSupabaseClient()
    .from('knowledge_base')
    .select('id, content')
    .in('id', ['general', campaign]);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const general = kbRows.find((r) => r.id === 'general')?.content || '';
  const campaignKb = kbRows.find((r) => r.id === campaign)?.content || '';

  const systemPrompt = `You are the CEO responding personally to a ${CAMPAIGN_LABELS[campaign] || 'message'}.

COMPANY KNOWLEDGE:
${general || '(No general knowledge set yet — add it in the Knowledge Base tab.)'}

CAMPAIGN-SPECIFIC INSTRUCTIONS (tone, what to push for, links to use, etc.):
${campaignKb || '(No campaign-specific instructions set yet — add them in the Knowledge Base tab.)'}

Rules:
- Write as the CEO, in first person, warm but professional
- Keep it concise — no fluff
- Use any relevant links (Calendly, deck, etc.) from the knowledge base when appropriate
- Do NOT add a subject line — just the message body
- Do NOT explain what you are doing, just write the reply`;

  const userContent = [];

  if (imageFile && imageFile.size > 0) {
    const buffer = await imageFile.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const mediaType = imageFile.type || 'image/png';
    userContent.push({
      type: 'image',
      source: { type: 'base64', media_type: mediaType, data: base64 },
    });
  }

  if (text.trim()) {
    userContent.push({ type: 'text', text: `Here is the conversation:\n\n${text.trim()}` });
  }

  if (userContent.length === 0) {
    return NextResponse.json({ error: 'Provide a message or screenshot.' }, { status: 400 });
  }

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: systemPrompt,
    messages: [{ role: 'user', content: userContent }],
  });

  const draft = message.content[0]?.text || '';
  return NextResponse.json({ draft });
}

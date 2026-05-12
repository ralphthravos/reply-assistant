import { getSupabaseClient } from '../../../../lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  const { data, error } = await getSupabaseClient()
    .from('knowledge_base')
    .select('*')
    .order('id');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request) {
  const { id, title, content } = await request.json();

  const { error } = await getSupabaseClient()
    .from('knowledge_base')
    .upsert({ id, title, content, updated_at: new Date().toISOString() });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

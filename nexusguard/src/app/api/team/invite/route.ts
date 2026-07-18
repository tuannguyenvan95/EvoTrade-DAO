import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const { teamId, email, role } = await request.json();
    
    if (!teamId || !email) {
      return NextResponse.json({ error: 'Missing teamId or email' }, { status: 400 });
    }

    const supabase = await createClient();
    
    // Create member record (invite)
    const { data: member, error } = await supabase
      .from('team_members')
      .insert({
        team_id: teamId,
        email,
        role: role || 'member'
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(member);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

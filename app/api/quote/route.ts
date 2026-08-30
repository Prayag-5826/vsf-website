import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = await createClient();

    const { error } = await supabase.from('inquiries').insert([
      {
        full_name: body.fullName,
        phone: body.phone,
        company_name: body.companyName || null,
        city: body.city,
        service_type: body.serviceType,
        headcount_notes: body.notes || null,
        status: 'new',
      },
    ]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

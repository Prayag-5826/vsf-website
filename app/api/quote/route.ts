import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      full_name,
      phone,
      company_name,
      city,
      service_type,
      headcount_notes,
    } = body;

    // Validate required fields
    if (!full_name || !phone || !city || !service_type) {
      return NextResponse.json(
        { error: 'Missing required inquiry details (Name, Phone, City, Service).' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { error } = await supabase.from('inquiries').insert([
      {
        full_name: full_name.trim(),
        phone: phone.trim(),
        company_name: company_name ? company_name.trim() : null,
        city: city.trim(),
        service_type: service_type.trim(),
        headcount_notes: headcount_notes ? headcount_notes.trim() : null,
        status: 'new',
      },
    ]);

    if (error) {
      console.error('Supabase Inquiries Insert Error:', error);
      return NextResponse.json(
        { error: 'Failed to record inquiry in the operations desk.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Deployment inquiry logged successfully.' },
      { status: 201 }
    );
  } catch (err) {
    console.error('API Quote Route Error:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

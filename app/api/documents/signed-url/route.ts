import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const ALLOWED_DOCS = new Set([
  'psara-license-current-p1.webp',
  'psara-license-heritage-p1.webp',
  'proprietor-training-p1.webp',
  'epf-certificate-p1.webp',
  'epf-certificate-p2.webp',
  'esic-certificate-p1.webp',
  'esic-certificate-p2.webp',
  'gst-certificate-p1.webp',
  'gst-certificate-p2.webp',
  'gst-certificate-p3.webp',
  'labour-welfare-license-p1.webp',
  'professional-tax-certificate-p1.webp',
  'gumasta-license-p1.webp',
]);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawFile = searchParams.get('file');

    if (!rawFile) {
      return new NextResponse('Missing file parameter', { status: 400 });
    }

    const fileName = path.basename(rawFile);

    if (!ALLOWED_DOCS.has(fileName)) {
      return new NextResponse('Unauthorized document request', { status: 403 });
    }

    // Check private_assets first, then fallback to public folder
    let filePath = path.join(process.cwd(), 'private_assets', 'certificates', fileName);
    if (!fs.existsSync(filePath)) {
      filePath = path.join(process.cwd(), 'public', 'assets', 'img', 'certificates', fileName);
    }

    if (!fs.existsSync(filePath)) {
      return new NextResponse(`Document not found on server: ${fileName}`, { status: 404 });
    }

    // Native Node file buffer streaming (Fast, zero C++ binding dependency)
    const fileBuffer = fs.readFileSync(filePath);

    return new NextResponse(new Uint8Array(fileBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'image/webp',
        'Content-Length': fileBuffer.length.toString(),
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=43200',
        'Content-Disposition': 'inline',
      },
    });
  } catch (error: any) {
    console.error('[Doc Stream Error]:', error?.message);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

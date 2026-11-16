import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const expectedSecret = process.env.REVALIDATION_SECRET;

  if (expectedSecret && secret !== expectedSecret) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  const tag = searchParams.get('tag') || 'website-config';
  const path = searchParams.get('path');

  try {
    if (tag) {
      revalidateTag(tag, { expire: 0 });
    }
    if (path) {
      revalidatePath(path, 'layout');
    } else {
      revalidatePath('/', 'layout');
    }

    return NextResponse.json({
      revalidated: true,
      tag,
      path: path || '/',
      timestamp: Date.now(),
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        revalidated: false,
        message: error instanceof Error ? error.message : 'Revalidation error',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return POST(request);
}

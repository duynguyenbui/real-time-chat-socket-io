import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function DELETE(
  request: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const server = await db.server.delete({
      where: {
        id: params.serverId,
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log('[SERVER_ID_DELETE]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();
    const { imageUrl, name } = await request.json();

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const server = await db.server.update({
      where: {
        id: params.serverId,
      },
      data: {
        imageUrl: imageUrl,
        name: name,
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log('[SERVER_ID_PACTH]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

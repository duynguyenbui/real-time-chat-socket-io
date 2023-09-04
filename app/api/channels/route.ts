import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { MemberRole } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { name, type } = await request.json();
    const { searchParams } = new URL(request.url);

    if (name === 'general') {
      return new NextResponse("Name cannot be contain 'general'", {
        status: 400,
      });
    }

    const serverId = searchParams.get('serverId');

    if (!serverId) {
      return new NextResponse('Server ID is required', { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          create: {
            profileId: profile.id,
            name: name,
            type: type,
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log('[CHANNELS_POST]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

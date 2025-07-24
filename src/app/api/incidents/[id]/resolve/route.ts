import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid incident ID' }, { status: 400 });
    }

    // Get current incident
    const currentIncident = await prisma.incident.findUnique({
      where: { id },
      include: { camera: true },
    });

    if (!currentIncident) {
      return NextResponse.json({ error: 'Incident not found' }, { status: 404 });
    }

    // Toggle resolved status
    const updatedIncident = await prisma.incident.update({
      where: { id },
      data: { resolved: !currentIncident.resolved },
      include: { camera: true },
    });

    return NextResponse.json(updatedIncident);
  } catch (error) {
    console.error('Error updating incident:', error);
    return NextResponse.json({ error: 'Failed to update incident' }, { status: 500 });
  }
}

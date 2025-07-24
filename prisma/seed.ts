import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  
  await prisma.incident.deleteMany();
  await prisma.camera.deleteMany();

  console.log('Existing data cleared...');

  // Create cameras first
  const camera1 = await prisma.camera.create({
    data: { name: 'Shop Floor Camera A', location: 'Ground Floor' }
  });

  const camera2 = await prisma.camera.create({
    data: { name: 'Vault Camera', location: 'Basement' }
  });

  const camera3 = await prisma.camera.create({
    data: { name: 'Entrance Camera', location: 'Main Gate' }
  });

  console.log('Cameras created successfully...');

  const now = new Date();
  const threatTypes = ['Gun Threat', 'Unauthorized Access', 'Face Recognised', 'Traffic congestion'];
  
  const incidents = [];
  
  // Generate 15 incidents with  timestamps over 24 hours
  for (let i = 0; i < 15; i++) {
    const hoursAgo = Math.random() * 24; // Random time in last 24 hours
    const startTime = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
    const endTime = new Date(startTime.getTime() + (Math.random() * 30 + 10) * 60 * 1000); // 10-40 minutes duration
    const threatType = threatTypes[i % threatTypes.length];
    
    // Assign appropriate thumbnail and video based on threat type and camera
    let thumbnailUrl = `/thumbs/thumb${((i % 3) + 1)}.svg`;
    
    // Use specific thumbnails for specific threat types
    if (threatType === 'Gun Threat') {
      thumbnailUrl = `/thumbs/thumb2.svg`; // Vault camera
    } else if (threatType === 'Face Recognised') {
      thumbnailUrl = `/thumbs/thumb3.svg`; // Entrance camera
    } else {
      thumbnailUrl = `/thumbs/thumb1.svg`; // Shop floor camera
    }
    
    
    const resolved = i >= 10; // First 10 are unresolved (indices 0-9), last 5 are resolved
    
    incidents.push({
      cameraId: [camera1.id, camera2.id, camera3.id][i % 3], // Use actual camera IDs
      type: threatType,
      tsStart: startTime,
      tsEnd: endTime,
      thumbnailUrl: thumbnailUrl,
      resolved: resolved,
    });
  }

  await prisma.incident.createMany({
    data: incidents,
  });

  // Add some additional recent high-priority unresolved incidents
  const recentIncidents = [
    {
      cameraId: camera1.id,
      type: 'Gun Threat',
      tsStart: new Date(now.getTime() - 30 * 60 * 1000), // 30 minutes ago
      tsEnd: new Date(now.getTime() - 25 * 60 * 1000),   // 25 minutes ago
      thumbnailUrl: `/thumbs/thumb2.svg`,
      resolved: false,
    },
    {
      cameraId: camera3.id,
      type: 'Unauthorized Access',
      tsStart: new Date(now.getTime() - 15 * 60 * 1000), // 15 minutes ago
      tsEnd: new Date(now.getTime() - 10 * 60 * 1000),   // 10 minutes ago
      thumbnailUrl: `/thumbs/thumb1.svg`,
      resolved: false,
    },
    {
      cameraId: camera2.id,
      type: 'Gun Threat',
      tsStart: new Date(now.getTime() - 45 * 60 * 1000), // 45 minutes ago
      tsEnd: new Date(now.getTime() - 40 * 60 * 1000),   // 40 minutes ago
      thumbnailUrl: `/thumbs/thumb2.svg`,
      resolved: false,
    },
    {
      cameraId: camera1.id,
      type: 'Traffic congestion',
      tsStart: new Date(now.getTime() - 5 * 60 * 1000),  // 5 minutes ago
      tsEnd: new Date(now.getTime() - 2 * 60 * 1000),    // 2 minutes ago
      thumbnailUrl: `/thumbs/thumb1.svg`,
      resolved: false,
    }
  ];

  await prisma.incident.createMany({
    data: recentIncidents,
  });

  console.log('Database seeded successfully!');
  console.log(`Created 3 cameras and ${incidents.length + 4} incidents`);
  console.log(`Unresolved incidents: ${incidents.filter(i => !i.resolved).length + 4}`);
  console.log(`Resolved incidents: ${incidents.filter(i => i.resolved).length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

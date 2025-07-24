# SecureSight Dashboard

A comprehensive CCTV monitoring dashboard built with Next.js 15, TypeScript, Tailwind CSS, and Prisma.

##  Project Overview

SecureSight is a fictional CCTV monitoring software that can connect up to 3 CCTV feeds. Computer vision models help detect certain activities on the feeds (unauthorized access, gun threats, etc.).

This technical assessment creates the frontend and basic backend for the dashboard with:

###  Mandatory Features Completed:
1. **Navbar** - Navigation with user info and incident counts
2. **Incident Player (left-side)** - Large video frame with controls and camera thumbnails
3. **Incident List (right-side)** - Scrollable list of incidents with resolve functionality

###  Optional Features Completed:
1. **Interactive Timeline (bottom)** - 24-hour SVG timeline with incident markers, draggable scrubber, and snap-to-incident functionality

##  Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: Prisma with SQLite
- **UI Components**: Custom React components
- **Icons**: Unicode emojis and symbols

##  Data Model

### Camera
- `id` - Primary key
- `name` - Camera identifier (e.g., "Shop Floor Camera A")  
- `location` - Physical location (e.g., "Ground Floor")

### Incident
- `id` - Primary key
- `cameraId` - Foreign key to Camera
- `type` - Incident type ("Gun Threat", "Unauthorized Access", "Face Recognised", "Traffic congestion")
- `tsStart` - Incident start timestamp
- `tsEnd` - Incident end timestamp  
- `thumbnailUrl` - Path to thumbnail image
- `resolved` - Boolean status

##  Setup Instructions

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone and install dependencies:**
   ```bash
   cd securesight-dashboard
   npm install
   ```

2. **Set up the database:**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run migrations (creates SQLite database)
   npx prisma migrate dev --name init
   
   # Seed with sample data (15 incidents across 3 cameras)
   npx prisma db seed
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   ```
   http://localhost:3000
   ```

##  Project Structure

```
securesight-dashboard/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed.ts               # Sample data generation
│   └── dev.db               # SQLite database
├── src/
│   ├── app/
│   │   ├── api/incidents/    # REST API endpoints
│   │   │   ├── route.ts     # GET /api/incidents
│   │   │   └── [id]/resolve/route.ts  # PATCH /api/incidents/:id/resolve
│   │   ├── globals.css      # Tailwind imports
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Main dashboard page
│   ├── components/
│   │   ├── Navbar.tsx       # Top navigation bar
│   │   ├── IncidentPlayer.tsx  # Video player component
│   │   ├── IncidentList.tsx    # Incident sidebar
│   │   └── Timeline.tsx        # 24h interactive timeline
│   ├── hooks/
│   │   └── useIncidents.ts     # Custom hook for incident management
│   └── types/
│       └── index.ts            # TypeScript type definitions
└── public/thumbs/             # Placeholder thumbnail images
```

##  API Endpoints

### GET /api/incidents
Returns all incidents with camera information, ordered by newest first.

**Query Parameters:**
- `resolved` (optional): Filter by resolved status (`true`/`false`)

**Response:**
```json
[
  {
    "id": 1,
    "cameraId": 1,
    "type": "Gun Threat",
    "tsStart": "2025-07-22T10:30:00.000Z",
    "tsEnd": "2025-07-22T10:35:00.000Z", 
    "thumbnailUrl": "/thumbs/thumb1.svg",
    "resolved": false,
    "camera": {
      "id": 1,
      "name": "Shop Floor Camera A",
      "location": "Ground Floor"
    }
  }
]
```

### PATCH /api/incidents/:id/resolve
Toggles the resolved status of an incident.

**Response:**
```json
{
  "id": 1,
  "resolved": true,
  // ... other incident fields
}
```

##  Features Overview

### Dashboard Interface
- **Dark theme** matching the provided design mockup
- **Responsive layout** with sidebar and main content area
- **Real-time data** with optimistic UI updates

### Incident Management
- **Visual incident types** with color-coded icons
- **One-click resolution** with optimistic updates
- **Resolved incident history** with visual feedback
- **Incident selection** for video playback

### Interactive Timeline (Optional)
- **24-hour timeline** with hour markers
- **Incident markers** positioned by timestamp
- **Draggable scrubber** for time navigation
- **Click-to-seek** functionality
- **Snap-to-incident** when clicking markers
- **Color-coded legend** for incident types

### Video Player
- **Mock video controls** (play/pause, seek, time display)
- **Camera feed thumbnails** with mini timeline indicators
- **Incident overlay information**
- **Responsive video area**

##  Development Notes

- **Database**: Uses SQLite for simplicity (can be changed to PostgreSQL/MySQL)
- **Styling**: Tailwind CSS v4 with custom theme variables
- **State Management**: React hooks with custom incident management hook
- **Error Handling**: Graceful error states and loading indicators
- **Accessibility**: Keyboard navigation and semantic HTML

##  Sample Data

The seed script creates:
- **3 cameras** (Shop Floor, Vault, Entrance)
- **15 incidents** with random timestamps over 24 hours
- **4 incident types** with realistic distribution
- **Mixed resolved/unresolved status** (40% resolved, 60% unresolved)

##  Future Enhancements

- Real video streaming integration
- Real-time WebSocket updates
- Advanced filtering and search
- Incident analytics dashboard
- Multi-user authentication
- Camera configuration management
- Export functionality for incidents

##  Notes

- Thumbnails are SVG placeholders (can be replaced with actual camera snapshots)
- Video player uses static images (can be replaced with actual video streams)
- Timeline uses mock time data (can be connected to real video timestamps)
- All components are fully typed with TypeScript
- Follows Next.js 15 App Router conventions

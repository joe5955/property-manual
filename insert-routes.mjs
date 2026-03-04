import { createConnection } from 'mysql2/promise';

// Use the DATABASE_URL from the environment or hardcode for this script
// The connection string is from the TiDB Cloud project
const DB_URL = process.env.DATABASE_URL;

if (!DB_URL) {
  console.error('DATABASE_URL not set');
  process.exit(1);
}

const conn = await createConnection(DB_URL);

// ── OPALCO Power Line Route ──────────────────────────────────────────────────
// Sheet 1 (A-1.0 Property Overview)
// Yellow color for electrical/power
// Tracing the underground power service along Bear Cove Rd from entrance to main house
// Based on visual inspection of the A-1.0 map:
// - Bear Cove Rd enters from bottom-left corner
// - Curves up the left side of the property
// - Power line follows the road to the main building cluster

const opalcoPoints = JSON.stringify([
  { x: 8.5,  y: 89.0 },  // Property entrance on Bear Cove Rd (bottom-left)
  { x: 8.0,  y: 82.0 },  // Along Bear Cove Rd heading north
  { x: 8.5,  y: 74.0 },  // Continuing north along road
  { x: 10.0, y: 65.0 },  // Road curves slightly right
  { x: 12.0, y: 57.0 },  // Near new well area
  { x: 16.0, y: 50.0 },  // Approaching driveway junction
  { x: 22.0, y: 47.0 },  // Driveway heading east
  { x: 30.0, y: 44.0 },  // Continuing along driveway
  { x: 40.0, y: 43.0 },  // Mid-property
  { x: 50.0, y: 44.0 },  // Approaching main building cluster
  { x: 57.0, y: 46.0 },  // Main building area - electrical panel location
]);

const opalcoNotes = `Underground power service from OPALCO (Orcas Power & Light Co).

**Circuit:** 2241317FO
**Source:** Deer Harbor Substation
**Service:** Underground from Bear Cove Rd to main electrical panel

**OPALCO Power Map:** [View PDF](https://private-us-east-1.manuscdn.com/propmanual-5wh7ynui/OPALCOpowermap.pdf)

**CAUTION:** Do not excavate along Bear Cove Rd or driveway without calling 811 (Dig Safe) first.

Contact OPALCO: (360) 376-3500 | opalco.com`;

const opalcoPhotos = JSON.stringify([
  "https://private-us-east-1.manuscdn.com/propmanual-5wh7ynui/OPALCOpowermap.pdf"
]);

console.log('Inserting OPALCO power line route...');
const [opalcoResult] = await conn.execute(
  `INSERT INTO map_routes (sheetId, title, notes, category, color, points, photos) 
   VALUES (?, ?, ?, ?, ?, ?, ?)`,
  [1, 'OPALCO Underground Power Line', opalcoNotes, 'electrical', '#eab308', opalcoPoints, opalcoPhotos]
);
console.log('OPALCO route inserted, id:', opalcoResult.insertId);

// ── Fiber Optic Endpoint Pins ────────────────────────────────────────────────
// The fiber optic route already exists (id=1, orange, Sheet 1)
// Route goes from (15, 85) entrance to (78, 18) main house
// Add endpoint pins at key locations

const fiberPins = [
  {
    sheetId: 1,
    title: 'Fiber Optic — Property Entrance Splice Point',
    notes: `Underground fiber optic conduit entry point at Bear Cove Rd property entrance.

**Installed:** 2024
**Contractor:** Orcas Online / local fiber crew
**Type:** Single-mode fiber in conduit

This is where the fiber transitions from the public road right-of-way into the property's private conduit system. The conduit runs underground from here to the caretaker's house and continues to the main house cluster.

See the orange "Fiber Optic Conduit" route line for the full path.`,
    positionX: 15.0,
    positionY: 85.0,
    category: 'electrical',
    photos: JSON.stringify([
      "https://private-us-east-1.manuscdn.com/propmanual-5wh7ynui/fiber-optic-1_a1b2c3d4.jpg",
    ])
  },
  {
    sheetId: 1,
    title: 'Fiber Optic — Main House Termination',
    notes: `Fiber optic conduit termination point at the main house / main building cluster.

**Installed:** 2024
**Service:** High-speed internet via fiber to the premises (FTTP)

The fiber conduit arrives here from the entrance splice point (see orange route line). Connection equipment and patch panel located inside the main house.

See the orange "Fiber Optic Conduit" route line for the full path.`,
    positionX: 78.0,
    positionY: 18.0,
    category: 'electrical',
    photos: JSON.stringify([])
  }
];

for (const pin of fiberPins) {
  console.log(`Inserting pin: ${pin.title}...`);
  const [pinResult] = await conn.execute(
    `INSERT INTO map_pins (sheetId, title, notes, positionX, positionY, category, photos)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [pin.sheetId, pin.title, pin.notes, pin.positionX, pin.positionY, pin.category, pin.photos]
  );
  console.log('  Pin inserted, id:', pinResult.insertId);
}

// ── Verify ────────────────────────────────────────────────────────────────────
console.log('\n=== Verification ===');
const [routes] = await conn.query('SELECT id, sheetId, title, color FROM map_routes WHERE sheetId = 1 ORDER BY id');
console.log('Sheet 1 routes:');
for (const r of routes) {
  console.log(`  id=${r.id} | color=${r.color} | ${r.title}`);
}

const [pins] = await conn.query('SELECT id, sheetId, title, positionX, positionY FROM map_pins WHERE sheetId = 1 ORDER BY id');
console.log('Sheet 1 pins:');
for (const p of pins) {
  console.log(`  id=${p.id} | pos=(${p.positionX?.toFixed(1)}, ${p.positionY?.toFixed(1)}) | ${p.title}`);
}

await conn.end();
console.log('\nDone!');

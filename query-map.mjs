import { createConnection } from 'mysql2/promise';

const DB_URL = 'mysql://WBfVgvvEUxL2ZXR.root:LQ65VCeT51TP87XPCnni@gateway04.us-east-1.prod.aws.tidbcloud.com:4000/5Wh7ynUieoKvKRb4ttPNaL?ssl={"rejectUnauthorized":true}';

const conn = await createConnection(DB_URL);

console.log('=== ALL PINS ===');
const [pins] = await conn.query('SELECT id, sheetId, title, positionX, positionY, category FROM map_pins ORDER BY sheetId, id');
for (const p of pins) {
  console.log(`  Sheet ${p.sheetId} | id=${p.id} | pos=(${p.positionX?.toFixed(2)}, ${p.positionY?.toFixed(2)}) | [${p.category}] ${p.title}`);
}

console.log('\n=== ALL ROUTES ===');
const [routes] = await conn.query('SELECT id, sheetId, title, color, points FROM map_routes ORDER BY sheetId, id');
for (const r of routes) {
  const pts = JSON.parse(r.points || '[]');
  console.log(`  Sheet ${r.sheetId} | id=${r.id} | color=${r.color} | ${pts.length} points | ${r.title}`);
  if (pts.length > 0) {
    console.log(`    First point: (${pts[0].x?.toFixed(2)}, ${pts[0].y?.toFixed(2)})`);
    console.log(`    Last point:  (${pts[pts.length-1].x?.toFixed(2)}, ${pts[pts.length-1].y?.toFixed(2)})`);
  }
}

await conn.end();

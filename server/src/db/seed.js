import { db } from './database.js';

console.log('Seeding DhanKhoj database from demo records...');
db.seedFromDemo();
const stats = db.getStats();
console.log('Database successfully seeded!');
console.log(`Total Records: ${stats.totalRecords}`);
console.log('Source Breakdown:', stats.sources);
console.log('Asset Types:', stats.assetTypes);

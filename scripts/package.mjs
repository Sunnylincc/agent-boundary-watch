/**
 * Dependency-free ZIP writer (ZIP store method, deterministic metadata).
 * Pack only audited runtime files. No source maps, tests, secrets or remote code.
 */
import { readFile, mkdir, writeFile } from 'node:fs/promises';

const paths = [
  'manifest.json', 'popup.html', 'styles.css',
  'src/risk.mjs', 'src/report.mjs', 'src/popup.mjs',
  'icons/icon-16.png', 'icons/icon-48.png', 'icons/icon-128.png'
];
const version = JSON.parse(await readFile('manifest.json', 'utf8')).version;
const destination = 'dist/agent-boundary-watch-' + version + '.zip';

const table = Array.from({ length: 256 }, (_, i) => {
  let value = i;
  for (let j = 0; j < 8; j++) value = value & 1 ? 0xEDB88320 ^ (value >>> 1) : value >>> 1;
  return value >>> 0;
});
function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) crc = table[(crc ^ byte) & 255] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}
function zipEntry(path, data, offset) {
  const name = Buffer.from(path);
  const checksum = crc32(data);
  const local = Buffer.alloc(30);
  local.writeUInt32LE(0x04034b50, 0);
  local.writeUInt16LE(20, 4);
  local.writeUInt32LE(checksum, 14);
  local.writeUInt32LE(data.length, 18);
  local.writeUInt32LE(data.length, 22);
  local.writeUInt16LE(name.length, 26);
  const central = Buffer.alloc(46);
  central.writeUInt32LE(0x02014b50, 0);
  central.writeUInt16LE(20, 4);
  central.writeUInt16LE(20, 6);
  central.writeUInt32LE(checksum, 16);
  central.writeUInt32LE(data.length, 20);
  central.writeUInt32LE(data.length, 24);
  central.writeUInt16LE(name.length, 28);
  central.writeUInt32LE(offset, 42);
  return { local: Buffer.concat([local, name, data]), central: Buffer.concat([central, name]) };
}
const locals = [], centrals = [];
let offset = 0;
for (const path of paths) {
  const bytes = await readFile(path);
  const entry = zipEntry(path, bytes, offset);
  locals.push(entry.local);
  centrals.push(entry.central);
  offset += entry.local.length;
}
const centerOffset = offset;
const center = Buffer.concat(centrals);
const end = Buffer.alloc(22);
end.writeUInt32LE(0x06054b50, 0);
end.writeUInt16LE(paths.length, 8);
end.writeUInt16LE(paths.length, 10);
end.writeUInt32LE(center.length, 12);
end.writeUInt32LE(centerOffset, 16);
await mkdir('dist', { recursive: true });
await writeFile(destination, Buffer.concat([...locals, center, end]));
console.log('Created ' + destination + ' (' + paths.length + ' runtime files)');

import { db } from '../src/lib/server/db';
import * as fs from 'fs';

async function main() {
  await db.worstPassword.deleteMany();
  const text = fs.readFileSync('./prisma/seed/10-million-password-list-top-100000.txt', 'utf-8');
  const items = text.split(/\n\r?|\r/);
  const commands = new Array(1000);
  for (let i = 0; i < items.length - 1; i += 1000) {
    for (let j = 0; j < 1000; j++) {
      commands[j] = db.worstPassword.upsert({
        where: { value: items[i + j].toLocaleLowerCase() },
        update: {},
        create: {
          value: items[i + j].toLocaleLowerCase(),
          rank: i + j + 1,
        },
      });
    }
    await db.$transaction(commands);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });

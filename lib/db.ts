import { PrismaClient } from "./generated/prisma";

const db = new PrismaClient();

async function test() {
  const user = await db.user.create({
    data: {
      username: 'a;a;a;',
    }
  })

  const user2 = await db.user.findMany({
    where: {
      username: {
        contains: 'est',
      }
    }
  })

  console.log(user);
  console.log(user2);
}

test();

export default db;

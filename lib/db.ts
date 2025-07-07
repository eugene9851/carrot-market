import { PrismaClient } from "./generated/prisma";

const db = new PrismaClient();

async function test() {
  // const user = await db.user.create({
  //   data: {
  //     username: 'number2',
  //   }
  // })
  // console.log(user)

  // const user2 = await db.user.findMany({
  //   where: {
  //     username: {
  //       contains: 'est',
  //     }
  //   }
  // })

  // const token = await db.sMSToken.create({
  //   data: {
  //     token: '222222',
  //     user: {
  //       connect: {
  //         id: 3,
  //       }
  //     }
  //   }
  // })

  // console.log(token);

  const token = await db.sMSToken.findUnique({
    where: {
      id: 1
    }
  })

  console.log(token);

}

test();

export default db;

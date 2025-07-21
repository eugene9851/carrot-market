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
  //         id: 2,
  //       }
  //     }
  //   }
  // })
  // const token = await db.sMSToken.create({
  //   data: {
  //     token: '444444',
  //     user: {
  //       connect: {
  //         id: 4,
  //       }
  //     }
  //   }
  // })
  // const token5 = await db.sMSToken.create({
  //   data: {
  //     token: '555555',
  //     user: {
  //       connect: {
  //         id: 5,
  //       }
  //     }
  //   }
  // })

  // console.log(token);

  // const token = await db.sMSToken.findUnique({
  //   where: {
  //     id: 1
  //   }
  // })

  // console.log(token);
  // const updateUser = await db.user.update({
  //   where: { id: 4 },
  //   data: { email: 'nico@nomad.co' }
  // })
}

test();

export default db;

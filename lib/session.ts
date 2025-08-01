import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface Session {
  id?: number
}
export default async function getSession() {
  return getIronSession<Session>(await cookies(), {
    cookieName: 'delicious-karrot',
    password: process.env.COOKIE_PASSWORD!,
  });
}

export const setSession = async (id: number) => {
  const session = await getSession();
  session.id = id;
  await session.save();
  redirect('/profile');
}

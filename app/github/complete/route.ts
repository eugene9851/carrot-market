import { setSession } from "@/lib/session";
import { NextRequest } from "next/server";
import db from "@/lib/db";
import { getAccessToken, getEmail, getUserProfile } from "@/lib/github";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  if (!code) {
    return new Response(null, {
      status: 400,
    })
  }

  const {error, access_token} = await getAccessToken(code);

  if (error) {
    return new Response(null, {
      status: 400,
    })
  }

  const userEmail = await getEmail(access_token);
  const {id, avatar_url, login} = await getUserProfile(access_token);

  const user = await db.user.findUnique({
    where: {
      github_id: id.toString(),
    },
    select: {
      id: true
    },
  });

  if(user){
    return await setSession(user.id);
  }

  const now = Date.now().toString();
  const newUser = await db.user.create({
    data: {
      username: login + '_github_' + now,
      github_id: id.toString(),
      avatar: avatar_url,
      email: userEmail,
    },
    select: {
      id: true
    }
  });

  return await setSession(newUser.id);
}

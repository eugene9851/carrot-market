'use server'

import { PASSWORD_MIN_LENGTH } from "@/lib/constants";
import { z } from "zod";
import db from "@/lib/db";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import getSession from "@/lib/session";

const checkUsername = (username:string) => !username.includes('potato')
const checkPasswords = ({password, passwordConfirm}:{password:string, passwordConfirm:string}) => password === passwordConfirm

const checkUniqueUsername = async (username:string) => {
  const user = await db.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
    }
  });

  return !Boolean(user);
}

const checkUniqueEmail = async (email:string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    }
  });

  return !Boolean(user);
}

const formSchema = z.object({
  username: z.string({
    invalid_type_error: 'Username must be a string',
    required_error: 'Where is my username?'
  }).min(3, 'way too short!').max(10, 'way too long!').toLowerCase().trim().refine(checkUsername, 'No potatoes!').refine(checkUniqueUsername, 'This username is already taken'),
  email: z.string().email().toLowerCase().refine(checkUniqueEmail, 'There is an account already registered with that email'),
  // password: z.string().min(PASSWORD_MIN_LENGTH).regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
  password: z.string().min(PASSWORD_MIN_LENGTH),
  passwordConfirm: z.string().min(PASSWORD_MIN_LENGTH),
}).refine(checkPasswords, {
  message: 'Both passwords should be the same',
  path: ['passwordConfirm']
})

export async function createAccount(prevState:unknown, formData:FormData) {
  const data = {
    username: formData.get('username'),
    email: formData.get('email'),
    password: formData.get('password'),
    passwordConfirm: formData.get('passwordConfirm'),
  }

  const result = await formSchema.safeParseAsync(data);

  if(!result.success) {
    return result.error.flatten();
  } else {
    const hashedPassword = await bcrypt.hash(result.data.password, 12)
    const user = await db.user.create({
      data: {
        username: result.data.username,
        email: result.data.email,
        password: hashedPassword,
      },
      select: {
        id: true,
      }
    })

    const session = await getSession();
    session.id = user.id;
    await session.save();

    redirect('/profile')
  }
}

'use server'

import { PASSWORD_MIN_LENGTH } from "@/lib/constants";
import { z } from "zod";
import db from "@/lib/db";
import bcrypt from "bcrypt";
import { setSession } from "@/lib/session";

const checkUsername = (username:string) => !username.includes('potato')
const checkPasswords = ({password, passwordConfirm}:{password:string, passwordConfirm:string}) => password === passwordConfirm

const formSchema = z.object({
  username: z.string({
    invalid_type_error: 'Username must be a string',
    required_error: 'Where is my username?'
  }).min(3, 'way too short!').max(10, 'way too long!').toLowerCase().trim().refine(checkUsername, 'No potatoes!'),
  email: z.string().email().toLowerCase(),
  // password: z.string().min(PASSWORD_MIN_LENGTH).regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
  password: z.string().min(PASSWORD_MIN_LENGTH),
  passwordConfirm: z.string().min(PASSWORD_MIN_LENGTH),
}).superRefine(async ({username}, ctx) => {
  const user = await db.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
    }
  })
  if (user) {
    ctx.addIssue({
      code: 'custom',
      message: 'This username is already taken.',
      path: ['username'],
      fatal: true
    })
    return z.NEVER;
  }
}).superRefine(async ({email}, ctx) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    }
  })
  if (user) {
    ctx.addIssue({
      code: 'custom',
      message: 'This email is already taken.',
      path: ['email'],
      fatal: true
    })
    return z.NEVER;
  }
}).refine(checkPasswords, {
  message: 'Both passwords should be the same',
  path: ['passwordConfirm']
})
// if superRefine returns z.NEVER and has fatal issues, next refines will not run.

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

    await setSession(user.id);
  }
}

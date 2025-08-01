'use server'

import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX_ERROR } from "@/lib/constants"
import { PASSWORD_REGEX } from "@/lib/constants"
import { z } from "zod"
import db from "@/lib/db"
import bcrypt from "bcrypt";
import { setSession } from "@/lib/session"

const checkEmailExists = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    }
  })

  return Boolean(user)
}

const formSchema = z.object({
  email: z.string().email().toLowerCase().refine(checkEmailExists, 'An account with this email does not exist.'),
  password: z.string({
    required_error: 'Password is required',
  }).min(PASSWORD_MIN_LENGTH).regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
})

export default async function login(prevState: unknown, formData: FormData) {
  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
  }

  const result = await formSchema.safeParseAsync(data);

  if(!result.success) return result.error.flatten();
  else {
    const user = await db.user.findUnique({
      where: {
        email: result.data.email,
      },
      select: {
        password: true,
        id: true,
      }
    })
    const ok = await bcrypt.compare(result.data.password, user!.password ?? '')
    if (ok) {
      return await setSession(user!.id);
    } else {
      return {
        fieldErrors: {
          password: ['Wrong password'],
          email: [],
        }
      }
    }
  }
}

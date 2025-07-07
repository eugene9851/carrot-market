'use server'

import { z } from "zod";

const passwordRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/)

const checkUsername = (username:string) => !username.includes('potato')
const checkPasswords = ({password, passwordConfirm}:{password:string, passwordConfirm:string}) => password === passwordConfirm

const formSchema = z.object({
  username: z.string({
    invalid_type_error: 'Username must be a string',
    required_error: 'Where is my username?'
  }).min(3, 'way too short!').max(10, 'way too long!').toLowerCase().trim().transform((username) => `kkk ${username}`).refine(checkUsername, 'No potatoes!'),
  email: z.string().email().toLowerCase(),
  password: z.string().min(4).regex(passwordRegex, "A password must have lowercase, uppercase, number, and special characters."),
  passwordConfirm: z.string().min(4),
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

  const result = formSchema.safeParse(data);

  if(!result.success) {
    return result.error.flatten();
  } else {
    console.log(result.data)
  }
}

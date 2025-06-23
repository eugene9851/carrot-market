'use server'

export default async function handleForm(prevState: unknown, formData: FormData) {
  console.log(prevState, formData)
  await new Promise((resolve) => setTimeout(resolve, 5000));
  return {
    errors: ['Wrong password', 'password is too short']
  }
}

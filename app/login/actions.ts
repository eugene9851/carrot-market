'use server'

export default async function handleForm(prevState: any, formData: FormData) {
  console.log(prevState)
  await new Promise((resolve) => setTimeout(resolve, 5000));
  return {
    errors: ['Wrong password', 'password is too short']
  }
}

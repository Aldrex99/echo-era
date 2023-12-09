import { hash, genSalt, compare } from "bcrypt";

export const hashPassword = async (plainTextPassword: string): Promise<string> => {
  const salt: string = await genSalt(10);
  return await hash(plainTextPassword, salt);
}

export const checkPassword = async (inputPassword: string, hashedPassword: string): Promise<boolean> => {
  return await compare(inputPassword, hashedPassword);
}
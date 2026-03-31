
import bcrypt from "bcrypt";

export async function hashPassword(str: string): Promise<string> {
  return await bcrypt.hash(str + process.env.PEPPER_KEY_PASSWORDS, 12);
}

/**
 * compare a string to a password set with hashPassword (if the pepper hasn't changed)
 */
export async function comparePassword(
  str: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(
    str + process.env.PEPPER_KEY_PASSWORDS,
    hashedPassword
  );
}

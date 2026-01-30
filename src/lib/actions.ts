'use server';

export async function verifyAdminPassword(password: string): Promise<boolean> {
  // This is a simple check. In a real-world scenario, you should use a
  // more secure method for password comparison, like a timing-safe compare.
  return password === process.env.ADMIN_PASSWORD;
}

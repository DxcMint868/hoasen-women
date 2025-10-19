import { hashPassword } from "./lib/auth";

async function generateHashes(passwords: string[]) {
  const hashes: { password: string; hash: string }[] = [];

  for (const password of passwords) {
    const hash = await hashPassword(password);
	console.log(hash);
    hashes.push({ password, hash });
  }
  return hashes;
}

generateHashes(["coral", "ember", "smile"]);

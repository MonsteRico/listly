import { authOptions, getServerAuthSession } from "@/server/auth";

export default async function getUser() {
  const session = await getServerAuthSession();
  if (!session) {
    return null;
  }
  if (!session.user) {
    return null;
  }
  return session.user;
}
"use server";

import getUser from "@/lib/getUser";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export async function updateDbUser({ 
    userId,
    name,
    colorScheme
} : {
    userId: string;
    name?: string;
    colorScheme?: "system" | "light" | "dark";
}) {
    const user = await getUser();
    if (!user) {
        throw new Error("You must be logged in to update your user");
    }
    if (name) {
        await db.update(users).set({
            name: name
        }).where(eq(users.id, userId));
    }
    if (colorScheme) {
        await db.update(users).set({
            colorScheme: colorScheme
        }).where(eq(users.id, userId));
    }

    const newUser = await db.select().from(users).where(eq(users.id, userId));

    return newUser[0];
}
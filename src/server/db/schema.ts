// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  jsonb,
  pgEnum,
  pgTableCreator,
  primaryKey,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `listly_${name}`);

export const colorSchemes = pgEnum("color_schemes", ["system", "light", "dark"]);

export const users = createTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  image: varchar("image", { length: 255 }),
  colorScheme: colorSchemes("color_scheme").notNull().default("system"),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

export const accounts = createTable(
  "account",
  {
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_userId_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_userId_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);



export const listBoards = createTable("list_boards", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 256 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }),
  createdByUserId: varchar("created_by_user_id", { length: 255 }).notNull(),
  listOrder: jsonb("list_order").$type<string[]>().notNull(),
});

export const listTypes = pgEnum("list_types", ["thing", "movie", "game", "book", "tv_show"]);

export const lists = createTable("lists", {
  id: uuid("id").primaryKey().defaultRandom(),
  boardId: uuid("board_id").notNull(),
  name: varchar("name", { length: 256 }),
  items: jsonb("items").$type<Item[]>().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }),
  type: listTypes("type").notNull().default("thing"),
  accentColor: varchar("accent_color", { length: 255 }).notNull().default("#ffffff"),
});

export const listsRelations = relations(lists, ({ one }) => ({
  listBoards: one(listBoards, {
    fields: [lists.boardId],
    references: [listBoards.id],
  }),
}));

export const listBoardsRelations = relations(listBoards, ({ many, one }) => ({
  lists: many(lists),
  createdBy: one(users, { fields: [listBoards.createdByUserId], references: [users.id] }),
}));

export const usersToBoards = createTable("users_to_boards", {
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id),
  boardId: uuid("board_id").notNull().references(() => listBoards.id),
});

export type CreateList = { name: string; boardId: string;};
export type CreateListBoard = { name: string };
export type List = typeof lists.$inferSelect;
export type ListTypes = "thing" | "movie" | "game" | "book" | "tv_show";
export type ListBoard = typeof listBoards.$inferSelect & { lists: List[] };

export type ItemTypes = "thing" | "movie" | "game" | "book" | "tv_show";
export type Item = {
  id: string;
  listId: string;
  type: ItemTypes;
  content: ThingContent | MovieContent;
  createdAt: string;
  createdByUserId: string;
  updatedAt: string;
  updatedByUserId: string;
};

export type ThingContent = {
  text: string;
}

export type MovieContent = {
  title: string;
  posterPath: string;
};

export type ContentTypes = ThingContent | MovieContent;

export type MovieItem = Item & {
  content: MovieContent;
  type: "movie";
}

export type ThingItem = Item & {
  content: ThingContent;
  type: "thing";
}

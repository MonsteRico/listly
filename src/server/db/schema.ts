// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  jsonb,
  pgTableCreator,
  serial,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `listly_${name}`);

export const listBoards = createTable("list_boards", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 256 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }),
  listOrder: jsonb("list_order").$type<string[]>().notNull(),
});

export const lists = createTable("lists", {
  id: uuid("id").primaryKey().defaultRandom(),
  boardId: uuid("board_id").notNull(),
  name: varchar("name", { length: 256 }),
  items: jsonb("items").$type<Item[]>().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }),
});

export const listsRelations = relations(lists, ({ one }) => ({
  listBoards: one(listBoards, {
    fields: [lists.boardId],
    references: [listBoards.id],
  }),
}));

export const listBoardsRelations = relations(listBoards, ({ many }) => ({
  lists: many(lists),
}));

export type CreateList = { name: string; boardId: string;};
export type CreateListBoard = { name: string };
export type List = typeof lists.$inferSelect;
export type ListBoard = typeof listBoards.$inferSelect & { lists: List[] };

export type ItemTypes = "thing" | "movie" | "game" | "book" | "tv_show";
export type Item = {
  id: string;
  type: ItemTypes;
  content: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
};

import { relations, sql } from 'drizzle-orm';
import { integer, pgTable, text } from 'drizzle-orm/pg-core';

// Media Table
export const media = pgTable('media', {
  id: text('media_id')
    .primaryKey()
    .$default(() => sql`nanoid()`),
  name: text('name').notNull(),
  mime_type: text('mime_type').notNull(),
  size: integer('size').notNull(),
  url: text('url').notNull().unique(),
  reference_id: text('reference_id'), // Will hold user_id or post_id
  reference_table: text('reference_table'), // Will distinguish between 'users' and 'posts'
  created_at: integer('created_at')
    .notNull()
    .default(sql`extract(epoch from now())`),
});

// Users Table
export const users = pgTable('users', {
  id: text('user_id')
    .primaryKey()
    .$default(() => sql`nanoid()`),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  role: text('role'),
  password: text('password').notNull(),
  deleted_at: integer('deleted_at'),
  created_at: integer('created_at')
    .notNull()
    .default(sql`extract(epoch from now())`),
  updated_at: integer('updated_at')
    .notNull()
    .default(sql`extract(epoch from now())`),
});

// Posts Table
export const posts = pgTable('posts', {
  id: text('post_id')
    .primaryKey()
    .$default(() => sql`nanoid()`),
  title: text('title').notNull(),
  content: text('content').notNull(),
  created_at: integer('created_at')
    .notNull()
    .default(sql`extract(epoch from now())`),
});

// Define the relations
export const usersRelations = relations(users, ({ many }) => ({
  media: many(media), // Define many relation to media
}));

export const postsRelations = relations(posts, ({ many }) => ({
  media: many(media), // Define many relation to media
}));

export const databaseSchema = {
  users,
  posts,
  media,
  usersRelations,
  postsRelations,
};

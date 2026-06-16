import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const repos = pgTable('repos', {
  id: serial('id').primaryKey(),
  owner: text('owner').notNull(),
  name: text('name').notNull(),
  github_token_encrypted: text('github_token_encrypted').notNull(),
  created_at: timestamp('created_at').defaultNow(),
})

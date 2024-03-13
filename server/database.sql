CREATE TABLE IF NOT EXISTS Users (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(120) NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CREATE TABLE IF NOT EXISTS Pages (
--     id VARCHAR(36) PRIMARY KEY,
--     user_id VARCHAR(36) REFERENCES Users(id) ON DELETE CASCADE,
--     bio TEXT,
--     backgroung_color TEXT,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE IF NOT EXISTS Links (
--   id VARCHAR(36) PRIMARY KEY,
--   page_id VARCHAR(36) REFERENCES Pages(id) ON DELETE CASCADE,
--   name TEXT,
--   url TEXT,
--   active BOOLEAN DEFAULT TRUE
-- );

/* PG Session Middleware */
CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
CREATE INDEX "IDX_session_expire" ON "session" ("expire");
/* End PG Session Middleware */
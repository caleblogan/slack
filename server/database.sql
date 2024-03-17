CREATE TABLE IF NOT EXISTS Users (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(120) NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Workspaces(
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  user_id REFERENCES Users(id) NOT NULL
);

CREATE TABLE IF NOT EXISTS Channels(
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  user_id VARCHAR(36) REFERENCES Users(id) NOT NULL,
  workspace_id VARCHAR(36) REFERENCES Workspaces(id) NOT NULL,
  topic TEXT DEFAULT '',
  description TEXT DEFAULT '',
  is_private BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Messages(
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) REFERENCES Users(id) NOT NULL,
  channel_id VARCHAR(36) REFERENCES Channels(id) NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "idx_messages_channel_id" ON messages(channel_id);

CREATE TABLE IF NOT EXISTS Workspaces_Users (
  workspaces_id VARCHAR(36) REFERENCES Workspaces(id) ON DELETE CASCADE,
  users_id VARCHAR(36) REFERENCES Users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  Primary Key (workspaces_id, users_id)
);
CREATE INDEX "idx_workspaces_users_workspaces_id" ON workspaces_users(workspaces_id);
CREATE INDEX "idx_workspaces_users_users_id" ON workspaces_users(users_id);

CREATE TABLE IF NOT EXISTS Channels_Users (
  channels_id VARCHAR(36) REFERENCES Channels(id) ON DELETE CASCADE,
  users_id VARCHAR(36) REFERENCES Users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  Primary Key (channels_id, users_id)
);

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
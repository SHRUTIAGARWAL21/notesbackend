CREATE TYPE note_visibility AS ENUM ('private', 'public');

CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT,
    owner_id INTEGER REFERENCES users(id),
    visibility note_visibility NOT NULL DEFAULT 'private',
    is_deleted BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

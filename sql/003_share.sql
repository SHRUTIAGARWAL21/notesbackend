CREATE TYPE share_permission AS ENUM ('editor');

CREATE TABLE shares (
    id SERIAL PRIMARY KEY,
    note_id INTEGER REFERENCES notes(id),
    user_id INTEGER REFERENCES users(id),
    permission share_permission NOT NULL DEFAULT 'editor',
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (note_id, user_id)
);

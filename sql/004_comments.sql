CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    note_id INTEGER REFERENCES notes(id),
    user_id INTEGER REFERENCES users(id),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

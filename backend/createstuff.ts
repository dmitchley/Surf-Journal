import { db } from './src/db';

const createTables = async () => {
  try {
    // await db.query(`
    //   CREATE TABLE IF NOT EXISTS users (
    //     id SERIAL PRIMARY KEY,
    //     username VARCHAR(255) NOT NULL,
    //     email VARCHAR(255) NOT NULL UNIQUE,
    //     password VARCHAR(255) NOT NULL,
    //     role VARCHAR(50) DEFAULT 'user',
    //     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    //   );
    // `);

    // await db.query(`
    //   CREATE TABLE IF NOT EXISTS journal (
    //     id SERIAL PRIMARY KEY,
    //     text TEXT NOT NULL,
    //     time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    //     wave FLOAT,
    //     wave_direction VARCHAR(50),
    //     wind_direction VARCHAR(50),
    //     location VARCHAR(255),
    //     image BYTEA,
    //     user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    //     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    //     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    //   );
    // `);

    // await db.query(`
    //   CREATE TABLE IF NOT EXISTS journal_comments (
    //     id SERIAL PRIMARY KEY,
    //     journal_id INTEGER REFERENCES journal(id) ON DELETE CASCADE,
    //     user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    //     text TEXT NOT NULL,
    //     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    //   );
    // `);

    // await db.query(`
    //   CREATE TABLE IF NOT EXISTS koelbayReport (
    //     id SERIAL PRIMARY KEY,
    //     text TEXT NOT NULL,
    //     time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    //     wave FLOAT,
    //     wave_direction VARCHAR(50),
    //     wind_direction VARCHAR(50),
    //     location VARCHAR(255),
    //     image BYTEA,
    //     user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    //     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    //     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    //   );
    // `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS user_preferences (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        preferred_wave_min FLOAT,
        preferred_wave_max FLOAT,
        preferred_wave_direction VARCHAR(50),
        preferred_wind_direction VARCHAR(50),
        preferred_location VARCHAR(255),
        last_notified TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
  } finally {
    db.end();
  }
};

createTables();

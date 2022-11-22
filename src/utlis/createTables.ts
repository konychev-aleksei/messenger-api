import db from "../database";

const createTables = async () => {
  try {
    await db.query(`
    CREATE TABLE IF NOT EXISTS Users (
        username VARCHAR (255) PRIMARY KEY,
        displayname VARCHAR (255) NOT NULL,
        photoexists BOOLEAN
    );`);

    await db.query(`
    CREATE TABLE IF NOT EXISTS Chats (
        id SERIAL PRIMARY KEY,
        title VARCHAR (255) NOT NULL,
        creator VARCHAR (255) NOT NULL,
        FOREIGN KEY (creator) REFERENCES Users (username) ON DELETE CASCADE,
        photoexists BOOLEAN,
        lastmessage INTEGER
    );`);

    await db.query(`
    CREATE TABLE IF NOT EXISTS Messages (
        id SERIAL PRIMARY KEY, 
        chat_id INTEGER,
        FOREIGN KEY (chat_id) REFERENCES Chats (id) ON DELETE CASCADE,
        createdon TIMESTAMP NOT NULL,
        username VARCHAR (255) NOT NULL,
        FOREIGN KEY (username) REFERENCES Users (username) ON DELETE CASCADE,
        message VARCHAR (350) NOT NULL,
        audio VARCHAR(200),
        image BOOLEAN
    );`);

    await db.query(`
    CREATE TABLE IF NOT EXISTS UserChatRelation (
        chat_id INTEGER NOT NULL,
        username VARCHAR (255) NOT NULL,
        FOREIGN KEY (chat_id) REFERENCES Chats (id) ON DELETE CASCADE,
        FOREIGN KEY (username) REFERENCES Users (username) ON DELETE CASCADE,
        UNIQUE (chat_id, username)
    );`);
  } catch (error) {
    console.log(error);
  }
};

export default createTables;

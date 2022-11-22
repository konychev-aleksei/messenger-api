import db from "../../../database";
import C, { getDefaultChatPhoto } from "../../../constants";

class ChatsDBService {
  static async getChatsByUserName(
    userName: string,
    page: number,
    perPage: number
  ) {
    const offset = (page - 1) * perPage;
    const chats = await db.query(
      `SELECT 
          Messages.audio, Messages.message, 
          Messages.createdon, Messages.isevent,
          Messages.image, Chats.title, Chats.id, 
          Chats.photoexists, Chats.creator, Chats.lastmessage
          FROM UserChatRelation
          INNER JOIN Chats
          ON Chats.id = UserChatRelation.chat_id
          LEFT JOIN Messages
          ON Chats.lastmessage = Messages.id
          WHERE UserChatRelation.username = $1 
          OFFSET $2 LIMIT $3`,
      [userName, offset, perPage]
    );

    const response = chats.rows.map((chat) => {
      const { photoexists, id, title } = chat;

      if (chat.lastmessage === null) {
        return getDefaultChatPhoto(id, title);
      }

      const photo = photoexists
        ? `${C.API_DOMAIN}/previews/${id}.png`
        : C.DEFAULT_CHAT_IMAGE;

      return { ...chat, photo };
    });

    return response;
  }

  static async getParticipantsByChatId(chatId: number) {
    const usersRes = await db.query(
      `SELECT Users.* 
      FROM UserChatRelation
      INNER JOIN Users 
      ON UserChatRelation.username = Users.username
      WHERE UserChatRelation.chat_id = $1`,
      [chatId]
    );

    const users = usersRes.rows.map((user) => {
      const photo = user.photoexists
        ? `${C.API_DOMAIN}/avatars/${user.username}.png`
        : C.DEFAULT_CHAT_IMAGE;

      delete user.photoexists;
      return { ...user, photo };
    });

    return users;
  }

  static async getUserByUserName(userName: string) {
    const userRes = await db.query(
      `SELECT * 
      FROM Users
      WHERE username = $1`,
      [userName]
    );

    const user = userRes.rows[0];

    const photo = user.photoexists
      ? `${C.API_DOMAIN}/avatars/${user.username}.png`
      : C.DEFAULT_CHAT_IMAGE;

    delete user.photoexists;

    return { ...user, photo };
  }

  static async addUserToChat(userName: string, chatId: string) {
    await db.query(
      `INSERT INTO UserChatRelation (username, chat_id) 
      VALUES ($1, $2)`,
      [userName, chatId]
    );

    const user = await db.query(
      `SELECT * FROM Users 
       WHERE username = $1`,
      [userName]
    );

    return user;
  }

  static async removeUserFromChat(userName: string, chatId: string) {
    await db.query(
      `DELETE FROM UserChatRelation
      WHERE username = $1 AND chat_id = $2`,
      [userName, chatId]
    );
  }

  static async changeTitle(title: string, chatId: string) {
    await db.query(
      `UPDATE Chats 
      SET title = $1
      WHERE id = $2`,
      [title, chatId]
    );
  }

  static async changePhoto(chatId: string) {
    await db.query(
      `UPDATE Chats 
        SET previewexists = true
        WHERE id = $1`,
      [chatId]
    );
  }

  static async createNewChat(title: string, userName: string) {
    const response = await db.query(
      `INSERT INTO Chats (title, creator, photoexists, lastmessage) 
      VALUES ($1, $2, false, 0) RETURNING id`,
      [title, userName]
    );

    const chatId = response.rows[0].id;

    await db.query(
      `INSERT INTO UserChatRelation (chat_id, username) 
        VALUES ($1, $2)`,
      [chatId, userName]
    );

    return getDefaultChatPhoto(chatId, title);
  }

  static async getOnlineUsersInChat(chatId: string) {
    const users = await db.query(
      `SELECT UserChatRelation.username 
      FROM UserChatRelation
      INNER JOIN Users 
      ON Users.username = UserChatRelation.username
      WHERE Users.isonline = true AND UserChatRelation.chat_id = $1`,
      [chatId]
    );

    return users.rows.map((user) => user.username);
  }
}

export default ChatsDBService;

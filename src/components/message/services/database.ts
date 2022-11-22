import moment from "moment";
import db from "../../../database";
import { File } from "formidable";
import ChatsDBService from "../../chats/services/database";
import C from "../../../constants";

class MessageDBService {
  static async getChatById(id: string) {
    const chat = await db.query(`SELECT * FROM Chats WHERE id = $1`, [id]);
    return chat.rows.length === 1 ? chat.rows[0] : null;
  }

  static async getTotalCountByChatId(id: string) {
    const count = await db.query(
      `SELECT COUNT(*) FROM Messages
       WHERE id = $1`,
      [id]
    );

    return count.rows.length === 1 ? count.rows[0].count : null;
  }

  static async getMessagesByChatId(
    chatId: string,
    page: number,
    perPage: number
  ) {
    const offset = (page - 1) * perPage;
    const messagesRes = await db.query(
      `SELECT Messages.*, Users.photoexists FROM Messages 
          LEFT JOIN Users
          ON Users.username = Messages.username
          WHERE Messages.chat_id = $1 
          ORDER BY createdon DESC
          OFFSET $2 LIMIT $3`,
      [chatId, offset, perPage]
    );

    const messages = messagesRes.rows.map((message) => {
      const newMessage = {
        ...message,
        audio: message.audio
          ? message.audio.split(",").map((i: string) => Number(i))
          : null,
        photo: message.photoexists
          ? `${C.API_DOMAIN}/avatars/${message.username}.png`
          : C.DEFAULT_USER_IMAGE,
      };

      delete newMessage.photoexists;

      return newMessage;
    });

    return messages.reverse();
  }

  static async sendTextMessage({
    userName,
    chatId,
    message,
    image,
  }: {
    userName: string;
    chatId: string;
    message: string;
    image: File | undefined;
  }) {
    const createdon = moment(Date.now()).format("YYYY/MM/DD HH:mm:ss");
    try {
      const newMessage = await db.query(
        `INSERT INTO Messages (chat_id, createdon, username, message, image, isevent) 
              VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        [chatId, createdon, userName, message, Boolean(image), false]
      );

      const lastMessageId = newMessage.rows[0].id;

      const { photo } = await ChatsDBService.getUserByUserName(userName);

      await db.query(
        `UPDATE Chats 
        SET lastmessage = $1
        WHERE id = $2`,
        [lastMessageId, chatId]
      );

      return {
        id: lastMessageId,
        username: userName,
        message,
        image: Boolean(image),
        audio: false,
        photo,
        createdon,
      };
    } catch (e) {
      console.log(e);
      throw Error();
    }
  }

  static async sendAudioMessage({
    userName,
    chatId,
  }: {
    userName: string;
    chatId: string;
  }) {
    const createdOn = moment(Date.now()).format("YYYY/MM/DD HH:mm:ss");
    const sequence = Array.from(Array(60)).map((_) =>
      Math.floor(Math.random() * 20)
    );

    try {
      const newMessage = await db.query(
        `INSERT INTO Messages (chat_id, createdon, username, message, audio) 
                VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [chatId, createdOn, userName, "", sequence.join(",")]
      );

      const lastMessageId = newMessage.rows[0].id;

      await db.query(
        `UPDATE Chats 
          SET lastmessage = $1
          WHERE id = $2`,
        [lastMessageId, chatId]
      );

      return {
        id: lastMessageId,
        userName,
        message: "",
        image: false,
        audio: sequence,
        createdOn,
      };
    } catch (e) {
      console.log(e);
      throw Error();
    }
  }
}

export default MessageDBService;

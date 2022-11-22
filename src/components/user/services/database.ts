import db from "../../../database";
import C from "../../../constants";

class UserDBService {
  static async checkUserByUserName(username: string) {
    try {
      const user = await db.query(
        `
      SELECT * FROM Users 
      WHERE username = $1`,
        [username]
      );

      return Boolean(user.rows.length);
    } catch (e) {
      console.log(e);
      throw Error();
    }
  }

  static async createNewUser({
    userName,
    firstName,
    lastName,
  }: {
    userName: string;
    firstName: string;
    lastName: string;
  }) {
    try {
      await db.query(
        `INSERT INTO Users (username, firstname, lastname, photoexists, isonline) 
                VALUES ($1, $2, $3, $4, $5)`,
        [userName, firstName, lastName, false, true]
      );

      return { userName, photo: C.DEFAULT_USER_IMAGE };
    } catch (e) {
      console.log(e);
      throw Error();
    }
  }

  static async setUserOnline(online: boolean, username: string) {
    try {
      const userRes = await db.query(
        `UPDATE Users SET isonline = $1 WHERE username = $2 
        RETURNING *`,
        [online, username]
      );

      const user = userRes.rows[0];

      const photo = user.photoexists
        ? `${C.API_DOMAIN}/avatars/${user.username}.png`
        : C.DEFAULT_USER_IMAGE;

      return { username: user.username, photo };
    } catch (e) {
      console.log(e);
      throw Error();
    }
  }

  static async changePhoto(userName: string) {
    try {
      await db.query(
        `UPDATE Users 
        SET photoexists = true 
        WHERE userName = $1`,
        [userName]
      );
    } catch (e) {
      console.log(e);
      throw Error();
    }
  }

  static async getOnlineUsers(userName: string) {
    const chatsRes = await db.query(
      `SELECT UserChatRelation.chat_id FROM UserChatRelation
      WHERE UserChatRelation.username = $1`,
      [userName]
    );

    const chatsIds = chatsRes.rows.map((chat) => chat.chat_id);

    const usersRes = chatsIds.map(async (id) => {
      const response = await db.query(
        `SELECT Users.username FROM Users 
          INNER JOIN UserChatRelation
          ON UserChatRelation.username = Users.username
          WHERE UserChatRelation.chat_id = $1 
          AND Users.isonline = true`,
        [id]
      );

      return response.rows.map((user) => user.username);
    });

    let usersList: string[] = [];

    (await Promise.all(usersRes)).forEach((users) => {
      usersList = usersList.concat(users);
    });

    return Array.from(new Set(usersList));
  }
}

export default UserDBService;

import db from "../../database";
import C from "../../constants";

class UserService {
  static async checkUserByUserName(userName: string) {
    try {
      const user = await db.query(
        `SELECT photoexists FROM Users 
         WHERE username = $1`,
        [userName]
      );

      if (!user.rows.length) {
        return false;
      }

      const photo = user.rows[0].photoexists
        ? `${C.API_DOMAIN}/avatars/${userName}.png`
        : C.DEFAULT_USER_IMAGE;

      return { userName, photo };
    } catch (e) {
      console.log(e);
      throw Error();
    }
  }

  static async createNewUser({
    userName,
    displayName,
  }: {
    userName: string;
    displayName: string;
  }) {
    try {
      await db.query(
        `INSERT INTO Users (username, displayname, photoexists) 
                VALUES ($1, $2, $3)`,
        [userName, displayName, false]
      );

      return { userName, photo: C.DEFAULT_USER_IMAGE };
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
        WHERE username = $1`,
        [userName]
      );
    } catch (e) {
      console.log(e);
      throw Error();
    }
  }

  static async getAcquiantedUsers(userName: string) {
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
          WHERE UserChatRelation.chat_id = $1`,
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

export default UserService;

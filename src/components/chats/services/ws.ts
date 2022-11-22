import C from "../../../constants";
import { clients } from "../../../index";

class ChatsWSService {
  static async notifyChangeTitle(
    users: string[],
    title: string,
    chatId: string
  ) {
    const id = Number(chatId);

    users.forEach((user) => {
      const socket = clients.get(user);
      const data = {
        command: C.CHANGE_CHAT_TITLE,
        payload: {
          user,
          title,
          id,
        },
      };

      if (socket) {
        socket.send(JSON.stringify(data));
      }
    });
  }

  static async notifyChangePhoto(users: string[], chatId: string) {
    const id = Number(chatId);

    users.forEach((user) => {
      const socket = clients.get(user);
      const data = {
        command: C.CHANGE_CHAT_PHOTO,
        payload: {
          id,
        },
      };

      if (socket) {
        socket.send(JSON.stringify(data));
      }
    });
  }

  static async notifyAddUser(users: string[], senderUser: any, chatId: string) {
    const id = Number(chatId);

    users.forEach((user) => {
      const socket = clients.get(user);
      const data = {
        command: C.ADD_USER,
        payload: {
          id,
          senderUser,
        },
      };

      if (socket) {
        socket.send(JSON.stringify(data));
      }
    });
  }

  static async notifyRemoveUser(
    users: string[],
    userName: string,
    chatId: string
  ) {
    const id = Number(chatId);

    users.forEach((user) => {
      const socket = clients.get(user);
      const data = {
        command: C.REMOVE_USER,
        payload: {
          id,
          userName,
        },
      };

      if (socket) {
        socket.send(JSON.stringify(data));
      }
    });
  }

  static async notifyMessage(users: string[], chatId: string, message: any) {
    const id = Number(chatId);

    users.forEach((user) => {
      const socket = clients.get(user);

      const data = {
        command: C.SEND_MESSAGE,
        payload: {
          id,
          message,
        },
      };

      if (socket) {
        socket.send(JSON.stringify(data));
      }
    });
  }
}

export default ChatsWSService;

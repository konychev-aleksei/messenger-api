import C from "../../../constants";
import { clients } from "../../../index";

class UserWSService {
  static async notifyChangePhoto(users: string[], userName: string) {
    users.forEach((user) => {
      const socket = clients.get(user);
      const data = {
        command: C.CHANGE_USER_PHOTO,
        payload: {
          userName,
        },
      };

      if (socket) {
        socket.send(JSON.stringify(data));
      }
    });
  }
}

export default UserWSService;

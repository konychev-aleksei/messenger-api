import { clients } from "../index";

const notifyUsers = async (users: string[], command: string, payload: any) => {
  users.forEach((user) => {
    const socket = clients.get(user);
    const data = {
      command,
      payload,
    };

    if (socket) {
      socket.send(JSON.stringify(data));
    }
  });
};

export default notifyUsers;

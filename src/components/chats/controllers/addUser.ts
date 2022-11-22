import { RequestHandler } from "express";
import errorHandler from "../../../errorHandler";
import ChatsService from "../service";
import formidable from "formidable";
import notifyUsers from "../../../utlis/notifyUsers";
import C from "../../../constants";

type Params = {};
type ResBody = {};
export type ReqBody = {
  userName: string;
  chatId: number;
};
type ReqQuery = {};

const addUser: RequestHandler<Params, ResBody, ReqBody, ReqQuery> = async (
  req,
  res
) => {
  const form = new formidable.IncomingForm();

  try {
    form.parse(req, async (err, fields) => {
      if (err) {
        throw Error();
      }

      const { userName, id } = fields;

      if (
        !userName ||
        Array.isArray(userName) ||
        !id ||
        Array.isArray(id) ||
        Number.isNaN(id)
      ) {
        res.sendStatus(422);
        return;
      }

      const user = await ChatsService.getUserByUserName(userName);

      if (!user) {
        res.sendStatus(404);
        return;
      }

      const data = await ChatsService.addUserToChat(userName, id);

      const usersInChat = await ChatsService.getUsersInChat(id);

      notifyUsers(usersInChat, C.ADD_USER, { user, id });

      res.status(200).json(data);
    });
  } catch (error) {
    console.log(error);

    const errorStatus = errorHandler(error);
    res.sendStatus(errorStatus);
  }
};

export default addUser;

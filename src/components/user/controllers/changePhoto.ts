import { RequestHandler } from "express";
import errorHandler from "../../../errorHandler";
import UserService from "../service";
import formidable from "formidable";
import getUserNameByToken from "../../../utlis/getUserNameByToken";
import notifyUsers from "../../../utlis/notifyUsers";
import C from "../../../constants";
import saveFile from "../../../utlis/saveFile";

type Params = {};
type ResBody = {};
export type ReqBody = {
  email: string;
  photoURL: string;
  displayName: string;
};
type ReqQuery = {};

const checkUser: RequestHandler<Params, ResBody, ReqBody, ReqQuery> = async (
  req,
  res
) => {
  try {
    const token = req.headers.authorization!;
    const userName = getUserNameByToken(token);

    const form = new formidable.IncomingForm();

    form.parse(req, async (err, _, files) => {
      if (err) {
        throw Error();
      }

      const { photo } = files;

      if (!photo || Array.isArray(photo)) {
        throw Error("Unprocessable");
      }

      await UserService.changePhoto(userName);

      const users = await UserService.getAcquiantedUsers(userName);

      await saveFile("avatars", userName, "png", photo);

      notifyUsers(users, C.CHANGE_USER_PHOTO, { userName });

      res.sendStatus(200);
    });
  } catch (error) {
    console.log(error);

    const errorStatus = errorHandler(error);
    res.sendStatus(errorStatus);
  }
};

export default checkUser;

import { RequestHandler } from "express";
import errorHandler from "../../../errorHandler";
import UserService from "../service";
import formidable from "formidable";
import getUserNameByToken from "../../../utlis/getUserNameByToken";

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

    form.parse(req, async (err, fields) => {
      if (err) {
        throw Error();
      }

      const { displayName } = fields;

      if (!displayName || Array.isArray(displayName)) {
        throw Error("Unprocessable");
      }

      const user = await UserService.checkUserByUserName(userName);

      if (user) {
        res.status(200).json(user);
      } else {
        const newUser = await UserService.createNewUser({
          userName,
          displayName,
        });

        res.status(200).json(newUser);
      }
    });
  } catch (error) {
    console.log(error);

    const errorStatus = errorHandler(error);
    res.sendStatus(errorStatus);
  }
};

export default checkUser;

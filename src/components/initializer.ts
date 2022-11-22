import { RequestHandler } from "express";
import errorHandler from "../errorHandler";
import { initializer } from "../initializer";
import getUserNameByToken from "../utlis/getUserNameByToken";

type Params = {};
type ResBody = {};
export type ReqBody = {};
type ReqQuery = {
  name: string;
};

const initialize: RequestHandler<Params, ResBody, ReqBody, ReqQuery> = async (
  req,
  res
) => {
  const token = req.headers.authorization!;
  const userName = getUserNameByToken(token);

  const displayName = "Aleksei";

  try {
    await initializer(userName, displayName);
    res.sendStatus(200);
  } catch (error) {
    console.log(error);

    const errorStatus = errorHandler(error);
    res.sendStatus(errorStatus);
  }
};

export default initialize;

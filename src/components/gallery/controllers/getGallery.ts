import { RequestHandler } from "express";
import errorHandler from "../../../errorHandler";
import GalleryService from "../service";

type Params = {};
type ResBody = {};
type ReqBody = {};
type ReqQuery = {
  chatId: number;
  page: number;
  perPage: number;
};

const getGallery: RequestHandler<Params, ResBody, ReqBody, ReqQuery> = async (
  req,
  res
) => {
  try {
    let { chatId, page, perPage } = req.query;

    if (!page) {
      page = 1;
    }

    if (!perPage) {
      perPage = 1;
    }

    if (Number.isNaN(page) || Number.isNaN(perPage)) {
      throw Error("Unprocessable");
    }

    if (!chatId || Number.isNaN(chatId)) {
      throw Error("Unprocessable");
    }

    const data = await GalleryService.getGalleryByChatId(chatId, page, perPage);

    const totalCount = await GalleryService.getTotalCount(chatId);

    res.status(200).json({ data, totalCount });
  } catch (error) {
    console.log(error);

    const errorStatus = errorHandler(error);
    res.sendStatus(errorStatus);
  }
};

export default getGallery;

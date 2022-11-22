import db from "../../database";
import C from "../../constants";

class GalleryService {
  static async getGalleryByChatId(id: number, page: number, perPage: number) {
    const offset = (page - 1) * perPage;

    const response = await db.query(
      `SELECT id 
        FROM Messages 
        WHERE chat_id = $1 
        AND image = true
        ORDER BY createdon DESC
        OFFSET $2
        LIMIT $3`,
      [id, offset, perPage]
    );

    const images = response.rows.map((item) => {
      const photo = `${C.API_DOMAIN}/images/${item.id}.png`;
      return photo;
    });

    return images;
  }

  static async getTotalCount(id: number) {
    const response = await db.query(
      `SELECT COUNT(*) 
      FROM Messages 
      WHERE chat_id = $1 
      AND image = true`,
      [id]
    );

    return Number(response.rows[0].count);
  }
}

export default GalleryService;

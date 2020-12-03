import { NextApiRequest, NextApiResponse } from 'next';
import { redirect } from 'pages/[username]';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    return await redirect(req, res);
  } catch (error) {
    console.error(error);

    res
      .status(error.code || error.status || 404)
      .send({ code: 404, message: error.message || 'Link not found' });
  }
}

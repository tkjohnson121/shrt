import { UserService } from 'features/user';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { shrt_query } = req.query;
    const shrt_id = typeof shrt_query === 'string' ? shrt_query : shrt_query[0];
    // - lookup url in shrts db
    // - redirect, add view and related data

    const shrt = await UserService.getShrtById(shrt_id);

    await UserService.updateShrtAfterView(shrt);

    if (typeof window === 'undefined') {
      res?.writeHead(301, {
        Location: shrt.url,
      });
      res?.end();
    } else {
      window.location.replace(shrt.url);
    }
  } catch (error) {
    console.error(error);

    res.status(404).send({ code: 404, message: 'Link not found' });
  }
}

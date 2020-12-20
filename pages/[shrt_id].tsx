import { ErrorWrapper, Loading } from 'common';
import { ShrtService } from 'features/shrt';
import { NextApiRequest, NextApiResponse } from 'next';
import React from 'react';

export default function UserProfile({
  error,
  url,
}: {
  error?: Error;
  url?: string;
}) {
  if (typeof url === 'string' && typeof window !== 'undefined') {
    window.location.replace(url);

    return <Loading />;
  }

  if (error) {
    return (
      <ErrorWrapper
        title={('code' in error && error['code']) || '404: Not Found'}
        error={{
          message: error?.message,
        }}
      />
    );
  }

  return <Loading />;
}

export async function redirect(req: NextApiRequest, res: NextApiResponse) {
  const { shrt_id } = req.query;

  if (typeof shrt_id === 'undefined') {
    throw new Error('Shrt ID is required');
  }

  // - lookup shrt in shrts collection
  const shrt = await ShrtService.getShrtById(
    typeof shrt_id === 'string' ? shrt_id : shrt_id[0],
  );

  if (typeof shrt.url === 'undefined') {
    throw new Error('Shrt not Found');
  }

  // - add view and related data
  if (typeof window === 'undefined' && !!shrt) {
    await require('../features/shrt').ShrtService.updateShrtAfterView(shrt);
  }

  // redirect
  if (typeof window === 'undefined' && !!shrt.url) {
    res?.writeHead(301, {
      Location: shrt.url,
    });
    res?.end();

    return { props: { url: shrt.url } };
  } else {
    window.location.replace(shrt.url);
    return { props: { url: shrt.url } };
  }
}

// server-side function calls firestore to match the username and
//  grab data corresponding to the username
export async function getServerSideProps(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    return await redirect(req, res);
  } catch (error) {
    return {
      props: {
        error: {
          message:
            error.message || 'There was an error fetching data for' + req.query,
        },
      },
    };
  }
}

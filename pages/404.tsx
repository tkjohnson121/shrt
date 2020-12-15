import Link from 'next/link';
import React from 'react';

export default function NotFoundPage() {
  return (
    <>
      <h1>Whoops! Looks like we'e having trouble finding that page.</h1>
      <p>
        <Link href="/" passHref>
          <a>Go Home</a>
        </Link>
      </p>
    </>
  );
}

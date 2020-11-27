import Link from 'next/link';
import React from 'react';
import { User } from '../types';

type Props = {
  data: User;
};

export const ListItem = ({ data }: Props) => (
  <Link href="/users/[id]" as={`/users/${data.id}`}>
    <a>
      {data.id}: {data.name}
    </a>
  </Link>
);

export default ListItem;

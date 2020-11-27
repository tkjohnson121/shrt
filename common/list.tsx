import * as React from 'react';
import { User } from '../types';
import ListItem from './list-item';

type Props = {
  items: User[];
};

export const List = ({ items }: Props) => (
  <ul>
    {items.map((item) => (
      <li key={item.id}>
        <ListItem data={item} />
      </li>
    ))}
  </ul>
);

export default List;

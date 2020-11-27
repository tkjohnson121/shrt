import { List } from 'common';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import { User } from 'types';
import { sampleUserData } from 'utils/sample-data';

export default function WithStaticProps({ items }: { items: User[] }) {
  return (
    <div>
      <h1>Profile</h1>
      <p>
        Example fetching data from inside <code>getStaticProps()</code>.
      </p>
      <List items={items} />
      <br />
      <p>You are currently on: /profile</p>
      <p>
        <Link href="/">
          <a>Go home</a>
        </Link>
      </p>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  // Example for including static props in a Next.js function component page.
  // Don't forget to include the respective types for any props passed into
  // the component.
  const items: User[] = sampleUserData;
  return { props: { items } };
};

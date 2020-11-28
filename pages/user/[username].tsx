import { useRouter } from 'next/router';
import React from 'react';

export default function UserProfile() {
  const {
    query: { username },
  } = useRouter();

  return (
    <div>
      <h1 className="display">User Profile</h1>
      <span>{JSON.stringify(username, null, 2)}</span>
    </div>
  );
}

export async function getServerSideProps() {
  // server-side function calls firestore to match the username and
  //  grab data corresponding to the username
}

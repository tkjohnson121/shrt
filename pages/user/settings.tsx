import { AuthForm, ErrorWrapper, Loading } from 'common';
import { AuthService, useAuth } from 'features/authentication';
import React, { useState } from 'react';
import { FetchState } from 'types';

export default function UserSettings() {
  const authState = useAuth();
  const [state, setState] = useState<FetchState>({ loading: false });
  const onError = (error: Error) =>
    setState((prev) => ({ ...prev, loading: false, error }));

  const onLogout = async () => {
    try {
      setState({ loading: true });
      await AuthService.signOut();
      setState({ loading: false });
    } catch (error) {
      onError(error);
    }
  };

  if (state.loading) return <Loading />;
  if (state.error) return <ErrorWrapper error={state.error} />;

  return authState.data?.isAuthenticated ? (
    <section>
      <h1 className="display">User Settings</h1>
      <button onClick={onLogout}>Logout</button>

      {/* <pre>{JSON.stringify(authState, null, 2)}</pre> */}
    </section>
  ) : (
    <AuthForm />
  );
}

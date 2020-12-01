import { ErrorWrapper, Form, formFields, Loading, OnFormSubmit } from 'common';
import { useAuth } from 'features/authentication';
import { ShrtSwal } from 'features/swal';
import { UserService } from 'features/user';
import React, { useState } from 'react';
import { FetchState, LinkConfig } from 'types';

export default function PLPLinks() {
  const authState = useAuth();
  const currentUser = authState.data?.currentUser;

  const [state, setState] = useState<FetchState>({ loading: false });

  const onError = (error: Error) =>
    setState((prev) => ({ ...prev, loading: false, error }));

  const onFormSubmit: OnFormSubmit<LinkConfig> = async (
    linkConfig,
    setStatus,
  ) => {
    try {
      setStatus({ message: 'adding link', type: 'info' });

      if (!currentUser) {
        throw new Error('Please Login.');
      }

      await UserService.addPLPLink(currentUser.uid, linkConfig);

      setStatus(null);
      ShrtSwal.fire({ icon: 'success', title: 'Update Complete' });
    } catch (error) {
      console.error(error);
      setStatus({ message: error.message, type: 'error' });
    }
  };

  if (state.loading) return <Loading />;
  if (state.error) {
    return <ErrorWrapper error={state.error} />;
  }

  return currentUser ? (
    <section css={{ maxWidth: '50rem', margin: '0 auto' }}>
      <h1 className="display">User Settings</h1>

      <Form
        title={'Add a link to your PLP'}
        key="plp"
        onFormSubmit={onFormSubmit}
        fields={formFields.plpLinkFields}
        buttonText="Add Link"
      />
    </section>
  ) : (
    <section css={{ maxWidth: '50rem', margin: '0 auto' }}>
      <h1 className="display">User Settings</h1>

      <p>User Document not Available</p>
    </section>
  );
}

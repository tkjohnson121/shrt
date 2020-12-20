import {
  AuthForm,
  ErrorWrapper,
  Form,
  formFields,
  Loading,
  OnFormSubmit,
} from 'common';
import { useAuth } from 'features/authentication';
import { UserService } from 'features/user';
import React, { useState } from 'react';
import { FetchState, LinkConfig } from 'types';

export function PLPForm() {
  const authState = useAuth();
  const currentUser = authState.data?.currentUser;

  const [state] = useState<FetchState>({ loading: false });

  const onFormSubmit: OnFormSubmit<LinkConfig> = async (
    linkConfig,
    setStatus,
  ) => {
    setStatus({ message: 'adding link', type: 'info' });

    if (!currentUser) {
      throw new Error('Please Login.');
    }

    await UserService.addPLPLink(currentUser.uid, linkConfig);

    setStatus({ type: 'success', message: 'Link added to PLP.' });
  };

  if (state.loading) return <Loading />;
  if (state.error) {
    return <ErrorWrapper error={state.error} />;
  }

  return currentUser ? (
    <section css={{ margin: '2rem auto 1rem' }}>
      <Form
        title={'Add a link to your PLP'}
        key="plp"
        onFormSubmit={onFormSubmit}
        fields={formFields.plpLinkFields}
        buttonText="Add Link"
      />
    </section>
  ) : (
    <AuthForm />
  );
}

export default PLPForm;

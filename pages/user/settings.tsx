import {
  AuthForm,
  ErrorWrapper,
  Form,
  FormFields,
  formFields,
  Loading,
  OnFormSubmit,
  useUserDocumentListener,
} from 'common';
import { AuthService, useAuth } from 'features/authentication';
import { ShrtSwal } from 'features/swal';
import { UserService } from 'features/user';
import React, { useState } from 'react';
import { FetchState, UserDocument } from 'types';

export const getDefaultValues = (
  userData: UserDocument,
  formFields: FormFields,
): FormFields => {
  const formKeys = Object.keys(formFields);
  const fieldsWithDefaultValues = { ...formFields };

  formKeys.forEach((key) => {
    fieldsWithDefaultValues[key].defaultValue =
      key in userData ? userData[key as keyof UserDocument] : '';
  });

  return fieldsWithDefaultValues;
};

export default function UserSettings() {
  const authState = useAuth();
  const currentUser = authState.data?.currentUser;

  const {
    state: {
      data: userDocument,
      error: userDocumentError,
      loading: userDocumentLoading,
    },
  } = useUserDocumentListener();

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

  const onFormSubmit: OnFormSubmit = async (
    { avatar, header, ...args },
    setStatus,
  ) => {
    try {
      setStatus({ message: 'updating', type: 'info' });

      if (!currentUser) {
        throw new Error('Please Login.');
      }

      if (!!avatar && !!avatar[0]) {
        setStatus({ message: 'uploading avatar...', type: 'info' });

        await UserService.uploadUserFile(currentUser.uid, avatar[0], {
          name: 'avatar',
        });
      }

      if (!!header && !!header[0]) {
        setStatus({ message: 'uploading header...', type: 'info' });

        await UserService.uploadUserFile(currentUser.uid, avatar[0], {
          name: 'avatar',
        });
      }

      await UserService.updateUserDocument(currentUser.uid, {
        ...args,
      });

      setStatus(null);
      ShrtSwal.fire({ icon: 'success', title: 'Update Complete' });
    } catch (error) {
      console.error(error);
      setStatus({ message: error.message, type: 'error' });
    }
  };

  if (state.loading || (currentUser?.uid && userDocumentLoading))
    return <Loading />;
  if (state.error || userDocumentError) {
    return <ErrorWrapper error={state.error || userDocumentError} />;
  }

  return currentUser ? (
    userDocument ? (
      <section css={{ maxWidth: '50rem', margin: '0 auto' }}>
        <h1 className="display">User Settings</h1>
        <button onClick={onLogout}>Logout</button>

        <Form
          title={'Media'}
          key="media"
          onFormSubmit={onFormSubmit}
          fields={formFields.mediaFormFields}
          buttonText="Save"
        />

        <Form
          title={'User Profile'}
          subtitle={
            'Edit these setting to tell your audience more about who you are.'
          }
          key="profile"
          onFormSubmit={onFormSubmit}
          fields={getDefaultValues(userDocument, formFields.profileFields)}
          buttonText="Save"
        />

        <Form
          title={'User Profile Cont.'}
          subtitle={'More miscelleaneous setting to display on your PLP'}
          key="profile-cont"
          onFormSubmit={onFormSubmit}
          fields={getDefaultValues(userDocument, formFields.profileContFields)}
          buttonText="Save"
        />

        <Form
          title={'Social Media'}
          key="social-media"
          onFormSubmit={onFormSubmit}
          fields={getDefaultValues(userDocument, formFields.socialMediaFields)}
          buttonText="Save"
        />
      </section>
    ) : (
      <section css={{ maxWidth: '50rem', margin: '0 auto' }}>
        <h1 className="display">User Settings</h1>
        <button onClick={onLogout}>Logout</button>
        <p>User Document not Available</p>
      </section>
    )
  ) : (
    <AuthForm />
  );
}

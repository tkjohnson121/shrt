import { useAuth } from 'features/authentication';
import { UserService } from 'features/user';
import React from 'react';
import Form, { OnFormSubmit } from './form';
import { formFields } from './form-fields';

export function ShrtForm() {
  const authState = useAuth();

  const onShrtSubmit: OnFormSubmit = async ({ url, id }, setStatus) => {
    try {
      setStatus({ message: 'adding shrt', type: 'info' });

      if (!authState.data?.currentUser) {
        throw new Error('Please login to Shrten a link');
      }
      await UserService.addShrt(authState.data.currentUser.uid, { url, id });

      setStatus(null);
      // ShrtSwal.fire({ icon: 'success', title: 'Shrt Added!' });
    } catch (error) {
      console.error(error);
      setStatus({ message: error.message, type: 'error' });
    }
  };

  return (
    <Form
      key="shrt"
      onFormSubmit={onShrtSubmit}
      fields={formFields.shrtFields}
      buttonText="ShrtenURL"
    />
  );
}

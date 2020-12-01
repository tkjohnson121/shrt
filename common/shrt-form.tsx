import { useAuth } from 'features/authentication';
import { ShrtSwal } from 'features/swal';
import { UserService } from 'features/user';
import React from 'react';
import Form, { OnFormSubmit } from './form';
import { formFields } from './form-fields';

export function ShrtForm() {
  const authState = useAuth();

  const onShrtSubmit: OnFormSubmit = async ({ url }, setStatus) => {
    try {
      setStatus({ message: 'adding shrt', type: 'info' });

      if (!authState.data?.currentUser) {
        throw new Error('Please login to Shrten a link');
      }

      if (typeof url !== 'string' || url.length < 1) {
        throw new Error('Invalid URL');
      }

      await UserService.addShrt(authState.data.currentUser.uid, url);

      setStatus(null);
      ShrtSwal.fire({ icon: 'success', title: 'Update Complete!' });
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

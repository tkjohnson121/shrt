import { useAuth } from 'features/authentication';
import { ShrtSwal } from 'features/swal';
import { UserService } from 'features/user';
import React from 'react';
import { LinkConfig } from 'types';
import Form, { OnFormSubmit } from './form';
import { formFields } from './form-fields';

//   link_id: string;
//   url: string;
//   title: string;
//   description: string;
//   order: 'default' | number;
// isArchived: boolean;

//   link_id,
//   url,
//   title,
//   description,
//   order,
//   isArchived,

export function PLPLinkForm() {
  const authState = useAuth();

  const onLinkSubmit: OnFormSubmit<LinkConfig> = async (
    linkConfig: LinkConfig,
    setStatus,
  ) => {
    try {
      setStatus({ message: 'adding link to PLP', type: 'info' });

      if (!authState.data?.currentUser) {
        throw new Error('Please login add a PLP');
      }

      await UserService.addPLPLink(authState.data.currentUser.uid, {
        ...linkConfig,
        order: 0,
      });

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
      onFormSubmit={onLinkSubmit}
      fields={formFields.plpLinkFields}
      buttonText="ShrtenURL"
    />
  );
}

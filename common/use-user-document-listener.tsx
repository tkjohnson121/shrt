import { useAuth } from 'features/authentication';
import { UserService } from 'features/user';
import React from 'react';
import { FetchState, UserDocument } from 'types';

export const useUserDocumentListener = (uid?: string) => {
  const authState = useAuth();

  const [state, setState] = React.useState<FetchState<UserDocument>>({
    loading: true,
  });

  const onUserDocumentError = (error: Error) =>
    setState({ loading: false, error });

  React.useEffect(() => {
    const currentUser = authState.data?.currentUser;
    let unsubscribe: () => void;

    if (currentUser) {
      unsubscribe = UserService.openUserDocumentListener(
        uid || currentUser.uid,
        (documents) => setState({ loading: false, data: documents }),
        (error) => setState({ loading: false, error }),
      );
    }

    return () => {
      !!unsubscribe && unsubscribe();
    };
  }, [authState.data?.currentUser]);

  return { state, onUserDocumentError };
};
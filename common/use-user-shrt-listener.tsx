import { useAuth } from 'features/authentication';
import { UserService } from 'features/user';
import React from 'react';
import { FetchState, ShrtDocument } from 'types';

export const useUserShrtListener = (uid?: string) => {
  const authState = useAuth();

  const [state, setState] = React.useState<
    FetchState<{ shrts: Array<ShrtDocument> }>
  >({
    loading: true,
  });

  const onUserShrtError = (error: Error) => setState({ loading: false, error });

  React.useEffect(() => {
    const currentUser = authState.data?.currentUser;
    let unsubscribe: () => void;

    if (currentUser) {
      unsubscribe = UserService.openShrtListener(
        uid || currentUser.uid,
        (documents) => setState({ loading: false, data: { shrts: documents } }),
        (error) => onUserShrtError(error),
      );
    }

    return () => {
      !!unsubscribe && unsubscribe();
    };
  }, [authState.data?.currentUser]);

  return { state, onUserShrtError };
};

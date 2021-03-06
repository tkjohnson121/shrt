import { useAuth } from 'features/auth';
import { UserService } from 'features/user';
import { useRouter } from 'next/router';
import React from 'react';
import { FetchState, UserDocument } from 'types';

type UserDocState = FetchState<UserDocument>;

export const useUserDocumentListener = (
  uid?: string,
): [UserDocState, (error: Error) => void] => {
  const router = useRouter();
  const authState = useAuth();

  const [state, setState] = React.useState<UserDocState>({
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

  React.useEffect(() => {
    if (
      !state.loading &&
      !!state.data &&
      !state.data?.username &&
      !router.pathname.startsWith('/user/settings')
    ) {
      router.replace('/user/settings');
    }
  }, [router.pathname]);

  return [state, onUserDocumentError];
};

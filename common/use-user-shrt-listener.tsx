import { useAuth } from 'features/authentication';
import { UserService } from 'features/user';
import React from 'react';
import { FetchState, ShrtDocument } from 'types';

export const useUserShrtListener = (uid?: string) => {
  const authState = useAuth();

  const [state, setState] = React.useState<
    FetchState<{
      shrts: Array<ShrtDocument>;
      totalClicks: number;
      mostVisited: ShrtDocument;
    }>
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
        (documents) =>
          setState({
            loading: false,
            data: {
              shrts: documents,
              totalClicks: documents.reduce(
                (prev, curr) => prev + (curr.clicks || 0),
                0,
              ),
              mostVisited: documents.reduce((prev, curr) => {
                if (curr.clicks && prev.clicks && curr.clicks > prev.clicks) {
                  return curr;
                }

                return prev;
              }, documents[0]),
            },
          }),
        (error) => onUserShrtError(error),
      );
    } else {
      setState({ loading: false, error: new Error('Please Login.') });
    }

    return () => {
      !!unsubscribe && unsubscribe();
    };
  }, [authState.data?.currentUser]);

  return { state, onUserShrtError };
};

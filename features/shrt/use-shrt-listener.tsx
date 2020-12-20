import { useAuth } from 'features/authentication';
import { ShrtService } from 'features/shrt';
import React from 'react';
import { FetchState, ShrtDocument } from 'types';

type ShrtListenerState = FetchState<{
  shrts: Array<ShrtDocument>;
  totalClicks: number;
  mostVisited: ShrtDocument;
}>;

export const useShrtListener = (
  uid?: string,
): [ShrtListenerState, (error: Error) => void] => {
  const authState = useAuth();

  const [state, setState] = React.useState<ShrtListenerState>({
    loading: true,
  });

  const onShrtError = (error: Error) => setState({ loading: false, error });

  React.useEffect(() => {
    const currentUser = authState.data?.currentUser;
    let unsubscribe: () => void;

    if (currentUser) {
      unsubscribe = ShrtService.openShrtListener(
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
        (error) => onShrtError(error),
      );
    } else {
      setState({ loading: false, error: new Error('Please Login.') });
    }

    return () => {
      !!unsubscribe && unsubscribe();
    };
  }, [authState.data?.currentUser]);

  return [state, onShrtError];
};

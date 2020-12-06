import { ErrorWrapper, Loading } from 'common';
import { useAuth } from 'features/authentication';
import { UserService } from 'features/user';
import React, { useState } from 'react';
import { MdDelete } from 'react-icons/md';
import {
  addDelay,
  ComponentStyles,
  css,
  easing,
  listChildAnimation,
  motion,
} from 'theme';
import { FetchState, MotionTypes, ShrtDocument } from 'types';

const styles: ComponentStyles = {
  shrtCard: (theme) => css`
    flex: 0 1 10%;
    display: flex;
    flex-direction: column;
    align-item: flex-start;
    justify-content: center;
    position: relative;
    border: 2px solid ${theme.colors['secondary']};
    border-radius: ${theme.radii['md']};
    padding: ${theme.space[6]};
    margin: 0 ${theme.space[4]};
    margin-bottom: ${theme.space[12]};

    & > * {
      line-height: ${theme.lineHeights['taller']};
    }
  `,
  shrtLink: (theme) => css`
    position: relative;
    overflow: hidden;
    display: inline-flex;
    align-items: start;
    padding: ${theme.space[1]} ${theme.space[2]};
    max-width: ${theme.space[64]};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: '...';
    font-size: inherit;
    font-weight: inherit;
    font-family: inherit;
    line-height: inherit;
    margin: inherit;
    padding: inherit;

    &::after {
      content: '';
      transition: left 150ms cubic-bezier(${easing.join(',')});
      position: absolute;
      bottom: 0;
      left: -100%;
      width: 100%;
      height: 2px;
      background-color: ${theme.colors['primary']};
    }

    &.active::after,
    &:hover::after {
      left: 0;
    }
  `,
  shrtArchive: (theme) => css`
    margin-left: 90%;
    background-color: ${theme.colors['error']};
    color: ${theme.colors.whiteAlpha[900]};
    font-weight: ${theme.fontWeights['semibold']};
    border-radius: ${theme.radii['md']};
    font-size: ${theme.fontSizes['xl']};
  `,
};

export const ShrtCard: React.FC<{ as: MotionTypes; shrt: ShrtDocument }> = ({
  as = 'li',
  shrt,
}) => {
  const authState = useAuth();
  const uid = authState.data?.currentUser?.uid;

  const [state, setState] = useState<FetchState>({
    loading: shrt.shrt_url ? true : false,
  });

  const MotionComp = motion[as];

  const onShrtArchive = async (shrt: ShrtDocument) => {
    try {
      setState({ loading: true });

      if (uid === shrt.created_by && shrt.shrt_id) {
        await UserService.archiveShrt(uid, shrt.shrt_id);
      } else {
        throw new Error('ShrtId not found.');
      }

      setState({ loading: false });
    } catch (error) {
      setState({ loading: false, error });
    }
  };

  React.useEffect(() => {
    setState((prev) => ({ ...prev, loading: shrt.shrt_url ? false : true }));
  }, [shrt.shrt_url]);

  if (state.loading) return <Loading />;
  if (state.error) return <ErrorWrapper error={state.error} />;

  return (
    <MotionComp
      key={shrt.shrt_url}
      css={styles.shrtCard}
      variants={addDelay(listChildAnimation, 0.5)}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <h3>
        <a
          href={shrt.shrt_url || ''}
          target="_new"
          rel="noreferrer noopener"
          css={styles.shrtLink}
        >
          {shrt.shrt_id}
        </a>
      </h3>
      <pre>Clicks: {shrt.clicks}</pre>

      <pre>
        URL:{' '}
        <a
          href={shrt.url || ''}
          target="_new"
          rel="noreferrer noopener"
          css={styles.shrtLink}
        >
          {shrt.url}
        </a>
      </pre>

      <pre>Created on: {new Date(shrt.created_on).toLocaleDateString()}</pre>

      <button css={styles.shrtArchive} onClick={() => onShrtArchive(shrt)}>
        <MdDelete />
      </button>
    </MotionComp>
  );
};

export default ShrtCard;

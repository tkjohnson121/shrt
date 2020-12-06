import { ErrorWrapper, Loading } from 'common';
import { useAuth } from 'features/authentication';
import { UserService } from 'features/user';
import React, { useState } from 'react';
import {
  addDelay,
  ComponentStyles,
  css,
  listChildAnimation,
  motion,
} from 'theme';
import { FetchState, MotionTypes, PLPLinkDocument } from 'types';

const styles: ComponentStyles = {
  plpLink: (theme) => css`
    z-index: 0;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding: ${theme.space[8]};
    margin: ${theme.space[12]} 0;
    border-radius: ${theme.radii['md']};
    border: 2px solid ${theme.colors.secondary};
    box-shadow: ${theme.shadows['md']};

    span:first-of-type {
      display: block;
      width: 100%;
      height: 100%;
      font-size: ${theme.fontSizes['3xl']};
      z-index: -1;
    }

    span:nth-of-type(0n + 2) {
      line-height: ${theme.lineHeights['taller']};
      z-index: -1;
    }

    &.is-own {
      width: 90%;
    }

    button {
      position: absolute;
      top: 50%;
      right: -10%;
      padding: ${theme.space[2]};
      border-radius: ${theme.radii['md']};
      font-weight: ${theme.fontWeights['semibold']};
      font-size: ${theme.fontSizes['xl']};
      background-color: ${theme.colors['error']};
      color: ${theme.colors.whiteAlpha[900]};
      z-index: 5;
      transform: translate3d(0, -50%, 0);
      pointer-events: all;
    }
  `,
};

export const PLPCard: React.FC<{
  link: PLPLinkDocument;
  as?: MotionTypes;
  isOwnProfile?: boolean;
}> = ({ as = 'a', link, isOwnProfile }) => {
  const authState = useAuth();
  const uid = authState.data?.currentUser?.uid;

  const [state, setState] = useState<FetchState<{ isArchived: boolean }>>({
    loading: false,
  });

  const MotionComp = motion[as];

  const onPLPArchive = async (e: any, link: PLPLinkDocument) => {
    e.preventDefault();

    try {
      setState({ loading: true });

      if (uid === link.created_by && link.link_id) {
        await UserService.archivePLPLink(uid, link.link_id);
      } else {
        throw new Error('Link ID not found.');
      }

      setState({ loading: false, data: { isArchived: true } });
    } catch (error) {
      setState({ loading: false, error });
    }
  };

  if (state.loading) return <Loading />;
  if (state.error) return <ErrorWrapper error={state.error} />;
  if (state.data?.isArchived) return null;

  return (
    <MotionComp
      key={link.link_id}
      href={link.url}
      target="_new"
      rel="noreferrer noopener"
      className={isOwnProfile ? 'is-own' : 'is-other'}
      css={styles.plpLink}
      variants={addDelay(listChildAnimation, 1.2)}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <span>{link.name}</span>
      {link.description && <span>{link.description}</span>}
      {isOwnProfile && (
        <button onClick={(e) => onPLPArchive(e, link)}>X</button>
      )}
    </MotionComp>
  );
};

export default PLPCard;

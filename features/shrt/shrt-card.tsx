import { ErrorWrapper, Loading } from 'common';
import { useAuth } from 'features/auth';
import { ShrtService } from 'features/shrt';
import React, { useState } from 'react';
import {
  MdContentCopy,
  MdDateRange,
  MdDelete,
  MdLink,
  MdMouse,
} from 'react-icons/md';
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
    display: grid;
    grid-template-areas:
      'title'
      'stats'
      'actions'
      'status';
    position: relative;
    padding: ${theme.space[3]};
    margin: 0 ${theme.space[2]};

    &:not(:last-of-type) {
      border-bottom: 2px solid ${theme.colors['muted']};
    }

    @media (min-width: ${theme.space['2xl']}) {
      grid-template-columns: 2fr auto 1fr;
      grid-template-areas:
        'title . status'
        'stats . actions';
    }
  `,
  shrtTitle: () => css`
    grid-area: title;

    a {
      font-size: inherit;
      font-weight: inherit;
      font-family: inherit;
      line-height: inherit;
      letter-spacing: inherit;
      margin: inherit;
      padding: inherit;
    }
  `,

  shrtStats: (theme) => css`
    grid-area: stats;
    display: flex;
    flex-wrap: wrap;

    li {
      margin: ${theme.space[2]};
      display: flex;
      align-items: center;
      justify-content: flex-start;
      width: 100%;

      span[role='img'] {
        height: 100%;
        margin-right: ${theme.space[1]};

        svg {
          color: ${theme.colors['secondary']};
          height: 100%;
          width: ${theme.space[6]};
        }
      }
    }
  `,
  shrtLink: (theme) => css`
    position: relative;
    overflow: hidden;
    display: inline-flex;
    align-items: start;

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
    &:hover::after,
    &:focus::after {
      left: 0;
    }
  `,
  shrtStatus: (theme) => css`
    grid-area: status;
    text-align: right;
    position: relative;
    border-radius: ${theme.radii['md']};
    margin-top: ${theme.space[2]};
    padding: ${theme.space[2]};
    display: inline-block;

    &.info {
      color: ${theme.colors['info']};
    }
    &.error {
      color: ${theme.colors['error']};
    }
    &.warning {
      color: ${theme.colors['warning']};
    }
    &.success {
      color: ${theme.colors['success']};
    }
  `,
  shrtActions: (theme) => css`
    grid-area: actions;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: flex-end;

    button {
      margin: ${theme.space[2]};
      margin-right: 0;
      background-color: ${theme.colors['muted']};
      color: ${theme.colors.whiteAlpha[900]};
      border-radius: ${theme.radii['md']};
      font-size: ${theme.fontSizes['xl']};
      display: flex;
      align-items: center;
      justify-content: space-around;
      padding: ${theme.space[1]} ${theme.space[2]};

      span[role='img'] {
        height: 100%;
        margin-right: ${theme.space[1]};

        svg {
          height: 100%;
          width: 100%;
        }
      }

      &.archive {
        background-color: ${theme.colors['error']};
      }

      &.copy {
        background-color: ${theme.colors['info']};
      }
    }
  `,
};

export const ShrtCard: React.FC<{ as: MotionTypes; shrt: ShrtDocument }> = ({
  as = 'li',
  shrt,
}) => {
  const authState = useAuth();
  const uid = authState.data?.currentUser?.uid;

  const [state, setState] = useState<
    FetchState<{
      status: {
        type: 'success' | 'error' | 'info' | 'warning';
        message: string;
      };
    }>
  >({
    loading: false,
  });

  const MotionComp = motion[as];

  const onShrtAction = async (type: 'archive' | 'copy', shrt: ShrtDocument) => {
    try {
      setState({ loading: true });

      switch (type) {
        case 'archive': {
          if (uid === shrt.created_by && shrt.shrt_id) {
            await ShrtService.archiveShrt(uid, shrt.shrt_id);
          } else {
            throw new Error('ShrtId not found.');
          }

          return setState({ loading: false });
        }
        case 'copy': {
          if (!!shrt.shrt_url) {
            navigator.clipboard.writeText(shrt.shrt_url);
            return setState({
              loading: false,
              data: {
                status: { type: 'success', message: 'URL Copied!' },
              },
            });
          } else {
            throw new Error('Shrt URL could not be found. Unable to copy.');
          }
        }
        default: {
          break;
        }
      }
    } catch (error) {
      return setState({
        loading: false,
        data: {
          status: {
            type: 'error',
            message: error.message || 'An error has occured archiving shrt URL',
          },
        },
      });
    }
  };

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
      <h3 css={styles.shrtTitle}>
        <a
          href={shrt.shrt_url || ''}
          target="_new"
          rel="noreferrer noopener"
          css={styles.shrtLink}
        >
          {shrt.shrt_id}
        </a>
      </h3>

      <ul css={styles.shrtStats}>
        <li className="clicks">
          <span role="img" aria-label="click">
            <MdMouse />
          </span>{' '}
          {shrt.clicks}
        </li>

        <li className="url">
          <span role="img" aria-label="URL">
            <MdLink />
          </span>{' '}
          <a
            href={shrt.url || ''}
            target="_new"
            rel="noreferrer noopener"
            css={styles.shrtLink}
          >
            {shrt.url}
          </a>
        </li>

        <li className="created">
          <span role="img" aria-label="date">
            <MdDateRange />
          </span>{' '}
          {new Date(shrt.created_on).toLocaleDateString()}
        </li>
      </ul>

      {state.loading ? (
        <Loading />
      ) : (
        <div css={styles.shrtActions}>
          <button
            className="archive"
            onClick={() => onShrtAction('archive', shrt)}
          >
            <span role="img" aria-label="delete">
              <MdDelete />
            </span>{' '}
            Archive
          </button>
          <button className="copy" onClick={() => onShrtAction('copy', shrt)}>
            <span role="img" aria-label="copy">
              <MdContentCopy />
            </span>{' '}
            Copy
          </button>
        </div>
      )}

      {state.data?.status && (
        <span className={state.data.status.type} css={styles.shrtStatus}>
          {state.data.status.message}
        </span>
      )}
    </MotionComp>
  );
};

export default ShrtCard;

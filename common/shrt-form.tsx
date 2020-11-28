import { useAuth } from 'features/authentication';
import { ShrtenService } from 'features/shrten';
import React, { ChangeEvent, FormEvent, useCallback, useState } from 'react';
import { MdClose } from 'react-icons/md';
import {
  AnimatePresence,
  ComponentStyles,
  css,
  fadeInDown,
  listAnimation,
  listChildAnimation,
  motion,
} from 'theme';
import { FetchState } from 'types';
import Loading from './loading';

const styles: ComponentStyles = {
  header: (theme) => css`
    margin-bottom: ${theme.space[8]};

    button {
      background-color: transparent;
      color: ${theme.colors.text};
      border-bottom: 2px solid ${theme.colors.primary};
    }
  `,
  title: () => css``,
  error: (theme) => css`
    position: relative;
    flex: 1 1 100%;
    background-color: ${theme.colors.error};
    border-radius: ${theme.radii['md']};
    padding: ${theme.space[2]};
    margin: ${theme.space[4]} 0;

    button {
      position: absolute;
      top: 0;
      right: 0;
      border-radius: ${theme.radii['md']};
      background-color: ${theme.colors.whiteAlpha[300]};
      color: ${theme.colors.whiteAlpha[900]};
      font-size: ${theme.fontSizes.xl};
      margin: 0;
      padding: 0;
      display: flex;
      align-items: stretch;
      justify-content: center;
    }
  `,
  form: (theme) => css`
    margin: ${theme.space[4]} auto;
    display: flex;
    flex-wrap: wrap;
    align-items: stretch;
    justify-content: center;
    max-width: ${theme.space['2xl']};

    &.disabled {
      pointer-events: none;
    }
  `,
  label: () => css``,
  input: (theme) => css`
    flex: 1 1 50%;
    border-top-left-radius: ${theme.radii['md']};
    border-bottom-left-radius: ${theme.radii['md']};
    padding: ${theme.space[2]};
  `,
  button: (theme) => css`
    flex: 1 1 25%;
    background-color: ${theme.colors['primary']};
    color: ${theme.colors.whiteAlpha[900]};
    font-weight: ${theme.fontWeights['semibold']};
    border-top-right-radius: ${theme.radii['md']};
    border-bottom-right-radius: ${theme.radii['md']};
    padding: ${theme.space[2]};
  `,
};

export function ShrtForm() {
  const authState = useAuth();

  const [state, setState] = useState<FetchState<{ url: string }>>({
    loading: false,
    data: {
      url: '',
    },
  });

  const onError = (error: Error) =>
    setState((prev) => ({ ...prev, loading: false, error }));
  const onErrorClose = () =>
    setState((prev) => ({ ...prev, loading: false, error: null }));

  const onInputChange = ({
    target: { name, value },
  }: ChangeEvent<HTMLInputElement>) =>
    setState((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        [name]: value,
      } as { url: string },
    }));

  const onFormSubmit = useCallback(
    async (evt: FormEvent<HTMLFormElement>) => {
      try {
        evt.preventDefault();
        const { url } = state.data || {};

        if (
          typeof url !== 'string' ||
          !/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(
            url,
          )
        ) {
          throw new Error(
            'URL is incorrect. Tip. Be sure to include "http" or "https"',
          );
        }

        if (!authState.data?.currentUser) {
          throw new Error('Please login Shrten a link');
        }

        await ShrtenService.addShrt(authState.data.currentUser, url);
        setState({ loading: false, data: { url: '' } });
      } catch (error) {
        onError(error);
      }
    },
    [state.data],
  );

  return (
    <AnimatePresence>
      <motion.form
        css={styles.form}
        onSubmit={onFormSubmit}
        variants={listAnimation}
        initial="initial"
        animate="animate"
        exit="exit"
        key="form"
        className={`${state.loading ? 'disabled' : 'active'}`}
      >
        {!!state.error && (
          <motion.section
            variants={fadeInDown}
            initial="initial"
            animate="animate"
            exit="exit"
            css={styles.error}
            key="error"
          >
            <h3>{state.error?.name}</h3>
            <p>{state.error?.message}</p>
            <button onClick={onErrorClose}>
              <MdClose />
            </button>
          </motion.section>
        )}

        <motion.input
          id="url"
          name="url"
          placeholder="Enter your url to shrten..."
          type="text"
          css={styles.input}
          onChange={onInputChange}
          value={state.data?.url}
          variants={listChildAnimation}
          initial="initial"
          animate="animate"
          exit="exit"
          key="input-url"
        />

        {!!state.loading ? (
          <Loading key="loading-url" />
        ) : (
          <motion.button
            type="submit"
            css={styles.button}
            variants={listChildAnimation}
            initial="initial"
            animate="animate"
            exit="exit"
            key="button-submit"
          >
            Shrten URL
          </motion.button>
        )}
      </motion.form>
    </AnimatePresence>
  );
}

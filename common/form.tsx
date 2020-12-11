import { css } from '@emotion/core';
import { motion } from 'framer-motion';
import React from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import {
  fadeInDown,
  fadeInUp,
  listAnimation,
  listChildAnimation,
} from '../features/theme';
import { ComponentStyles } from './../features/theme/theme.d';

const styles: ComponentStyles = {
  formWrapper: (theme) => css`
    max-width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-items: start;

    &.disabled {
      input,
      textarea,
      select,
      label,
      fieldset,
      button,
      span {
        opacity: 0.65;
        pointer-events: none;
      }
    }

    @media (min-width: ${theme.breakpoints[3]}) {
      flex: 1 1 auto;
    }
  `,

  formHeader: (theme) => css`
    flex: 1 1 100%;
    padding ${theme.space[2]} 0;
  `,

  title: (theme) => css`
    font-size: ${theme.fontSizes['3xl']};
  `,
  subtitle: () => css``,

  formErrors: (theme) => css`
    text-align: center;
    color: ${theme.colors['error']};
    position: relative;
    background-color: ${theme.colors.whiteAlpha[300]};
    border-radius: ${theme.radii['md']};
    padding: ${theme.space[2]};
    margin: ${theme.space[4]} ${theme.space[8]};
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

  formActions: (theme) => css`
    flex: 1 1 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-bottom: ${theme.space[8]};

    button {
      background-color: ${theme.colors['primary']};
      color: ${theme.colors.whiteAlpha[900]};
      font-weight: ${theme.fontWeights['semibold']};
      border-radius: ${theme.radii['md']};
      padding: ${theme.space[2]};
    }

    &.submitting {
      button {
        background-color: ${theme.colors.gray[500]};
      }
    }
  `,

  formField: (theme) => css`
    flex: 1 1 20%;
    display: flex;
    flex-direction: column;
    margin: ${theme.space[4]} ${theme.space[2]};
    min-width: ${theme.space[32]};

    &.small {
      flex: 1 1 20%;
    }

    &.medium {
      flex: 1 1 40%;
    }

    &.large {
      flex: 1 1 65%;
    }

    &.full {
      flex: 1 1 100%;
    }

    &.checkbox {
      flex-direction: row;
    }
  `,

  formLabel: (theme) => css`
    margin-bottom: ${theme.space[2]};

    &.show,
    &.checkbox {
      height: auto;
      width: auto;
      opacity: 1;
    }

    &.file {
      position: relative;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0;
      text-align-center;
      border-radius: ${theme.radii['md']};
      background-color: ${theme.colors.whiteAlpha[300]};
      transition: background-color 150ms ease-in-out;


      &.circle,
      &.image {
        height: ${theme.space['32']};
      }

      &.circle {
        width: ${theme.space['32']};
        border-radius: ${theme.radii['full']};
      }

      &:hover, &:focus {
        background-color: ${theme.colors.whiteAlpha[700]};
      }
    }

    &.checkbox {
      width: 100%;
    }
  `,

  formInput: (theme) => css`
    appearance: auto;
    margin-bottom: ${theme.space[2]};
    width: 100%;
    max-width: 100%;
    padding: ${theme.space[2]};
    box-shadow: ${theme.shadows.lg};
    border: ${theme.borders['2px']};
    border-radius: ${theme.radii['md']};
    border-color: transparent;
    background-color: ${theme.colors.whiteAlpha['900']};

    &.has-error {
      border-color: ${theme.colors.error};
    }

    &.checkbox {
      order: -1;
      width: auto;
      margin-right: ${theme.space[4]};
    }

    // hide file inputs in favor of styling the label
    &.file {
      width: 0.1px;
      height: 0.1px;
      opacity: 0;
      overflow: hidden;
      position: absolute;
      z-index: -1;
    }
  `,
};

export interface FormFieldConfig extends React.HTMLProps<HTMLInputElement> {
  type: string;
  label?: string;
  placeholder?: string;
  defaultValue?: string | number;
  width?: string;
  config?: FieldValues;
  /** Used for `select` elements */
  options?: (string | number)[];
  /** Used for social media edits */
  smLink?: string | ((username: string | number) => any);
}

export interface FormFields {
  [key: string]: FormFieldConfig;
}

export type OnFormSubmit<T = {}> = (
  /** values from the input fields */
  formData: FieldValues & T,
  /** hook into the form's status, useful for displaying error messages */
  setStatus: React.Dispatch<
    React.SetStateAction<
      | {
          message: string | React.ReactNode;
          type: string;
        }
      | null
      | undefined
    >
  >,
) => any;

export interface FormProps {
  /** hooks into the submit function and runs the given function in a try/catch */
  onFormSubmit: OnFormSubmit<any>;
  /** title of the form */
  title?: string | React.ReactNode;
  /** subtitle form the form, to be replaced with status when available */
  subtitle?: string | React.ReactNode;
  /** list of form fields or components to be used in the form.  */
  fields: FormFields;
  /** the text od the submit button */
  buttonText?: string;
}

/**
 * # Form
 *
 * Component that handles the forms used in this applications.
 * Takes in default values and builds a standard form.
 */
export const Form: React.FC<FormProps> = (props) => {
  const { register, handleSubmit, errors, formState } = useForm();

  const [status, setStatus] = React.useState<{
    message: string | React.ReactNode;
    type: string;
  } | null>();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const formFields = Object.entries(props.fields);

  React.useEffect(() => {
    console.log(formState);
  }, [errors]);

  /**
   * # onSubmit
   * prefaces a developers onFormSubmit to wrap in a try catch block
   */
  const onSubmit = React.useCallback(
    handleSubmit(async (formData) => {
      setStatus(null);
      setIsSubmitting(true);
      try {
        await props.onFormSubmit(formData, setStatus);
        setIsSubmitting(false);
      } catch (error) {
        console.error(error);

        setStatus({
          message: JSON.stringify(error.message, null, 2),
          type: 'error',
        });
        return setIsSubmitting(false);
      }
    }),
    [formState.submitCount],
  );

  return (
    <motion.form
      variants={listAnimation}
      initial="initial"
      animate="animate"
      exit="exit"
      onSubmit={onSubmit}
      css={styles.formWrapper}
      className={isSubmitting ? 'disabled' : ''}
    >
      {(status || props.title || props.subtitle) && (
        <motion.header
          css={styles.formHeader}
          data-testid="status"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <h3 css={styles.title}>{props.title}</h3>
          <p css={styles.subtitle}>{props.subtitle}</p>
        </motion.header>
      )}

      {formFields.map(([name, field]) => (
        <motion.div
          key={`form-input-${name}`}
          css={styles.formField}
          className={`${field.width} ${field.type}`}
          variants={listChildAnimation}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <label
            htmlFor={name}
            css={styles.formLabel}
            className={`${field.type} ${field.width}`}
          >
            {field.label}
          </label>

          {[
            'checkbox',
            'url',
            'number',
            'text',
            'tel',
            'date',
            'email',
            'password',
          ].includes(field.type) && (
            <input
              key={name}
              id={name}
              type={field.type}
              name={name}
              defaultValue={field.defaultValue || ''}
              placeholder={field.placeholder || ''}
              ref={register(field.config || {})}
              css={styles.formInput}
              className={`${errors[name] ? 'has-error' : null} ${field.type}`}
            />
          )}

          {['file'].includes(field.type) && (
            <input
              key={name}
              id={name}
              type={field.type}
              name={name}
              defaultValue={field.defaultValue || ''}
              placeholder={field.placeholder || ''}
              ref={register(field.config || {})}
              css={styles.formInput}
              className={`${errors[name] ? 'has-error' : null} ${field.type}`}
              accept={field?.config?.accept || '*'}
              multiple={field?.config?.multiple || true}
            />
          )}

          {['textarea'].includes(field.type) && (
            <textarea
              key={name}
              id={name}
              name={name}
              rows={5}
              defaultValue={field.defaultValue || ''}
              placeholder={field.placeholder || ''}
              ref={register(field.config || {})}
              css={styles.formInput}
              className={`${errors[name] ? 'has-error' : null} ${field.type}`}
            />
          )}

          {['select'].includes(field.type) && (
            <select
              key={name}
              id={name}
              name={name}
              defaultValue={field.defaultValue || ''}
              placeholder={field.placeholder || ''}
              ref={register(field.config || {})}
              css={styles.formInput}
              className={`${errors[name] ? 'has-error' : null} ${field.type}`}
            >
              {field.options?.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          )}

          {errors[name] && (
            <span css={styles.formErrors}>{errors[name].message}</span>
          )}
        </motion.div>
      ))}

      <motion.div
        css={styles.formActions}
        className={isSubmitting ? 'submitting' : 'idle'}
        variants={listChildAnimation}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {status && (
          <motion.p
            variants={fadeInDown}
            initial="initial"
            animate="animate"
            exit="exit"
            css={styles.formErrors}
            className={status.type}
          >
            {status.message || props.subtitle}
          </motion.p>
        )}

        <button type="submit" className="block">
          {props.buttonText || 'submit'}
        </button>
      </motion.div>
    </motion.form>
  );
};

export default Form;

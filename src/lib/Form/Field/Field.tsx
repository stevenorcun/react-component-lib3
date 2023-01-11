import React from 'react';
import styles from './Field.scss';

interface FormFieldProps {
  label?: string;
  children?: React.ReactNode;
}
const FormField = ({ label, children }: FormFieldProps) => (
  <div className={styles.Field}>
    <label className={styles.Label}>{label}</label>
    {children}
  </div>
);

export default FormField;

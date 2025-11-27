// Form type definitions for better type safety

export interface FieldApi<T = unknown> {
  name: string;
  state: {
    value: T;
    meta: {
      errors: string[];
      errorMap: Record<string, string>;
      touched: boolean;
      isDirty: boolean;
      isTouched: boolean;
      isValidating: boolean;
      isValid: boolean;
    };
  };
  handleChange: (value: T) => void;
  handleBlur: () => void;
  setValue: (value: T) => void;
  getValue: () => T;
  validate: () => void;
}

export interface FormApi<T = unknown> {
  state: {
    values: T;
    errors: string[];
    fieldMeta: Record<string, unknown>;
    canSubmit: boolean;
    isSubmitting: boolean;
    isValid: boolean;
  };
  handleSubmit: () => void;
  Field: React.ComponentType<FieldProps>;
  Subscribe: React.ComponentType<SubscribeProps<T>>;
}

export interface FieldProps {
  name: string;
  validatorAdapter?: unknown;
  validators?: {
    onChange?: unknown;
    onBlur?: unknown;
    onMount?: unknown;
  };
  children: (field: FieldApi) => React.ReactNode;
}

export interface SubscribeProps<T> {
  selector?: (state: unknown) => unknown;
  children: (state: {
    values: T;
    canSubmit: boolean;
    isSubmitting: boolean;
  }) => React.ReactNode;
}

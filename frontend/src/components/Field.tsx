import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";

interface Base {
  label: string;
  error?: string;
  hint?: string;
}

function describedBy(id: string, error?: string, hint?: string) {
  return error ? `${id}-error` : hint ? `${id}-hint` : undefined;
}

function Wrapper({ id, label, error, hint, children }: Base & { id: string; children: ReactNode }) {
  return (
    <div className="field">
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="field-error" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="field-hint">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function TextField({ label, error, hint, ...props }: Base & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <Wrapper id={id} label={label} error={error} hint={hint}>
      <input id={id} className="field-input" aria-invalid={!!error} aria-describedby={describedBy(id, error, hint)} {...props} />
    </Wrapper>
  );
}

export function TextArea({ label, error, hint, ...props }: Base & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  return (
    <Wrapper id={id} label={label} error={error} hint={hint}>
      <textarea id={id} className="field-input min-h-28 resize-y" aria-invalid={!!error} aria-describedby={describedBy(id, error, hint)} {...props} />
    </Wrapper>
  );
}

export function SelectField({ label, error, hint, children, ...props }: Base & SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId();
  return (
    <Wrapper id={id} label={label} error={error} hint={hint}>
      <select id={id} className="field-input" aria-invalid={!!error} aria-describedby={describedBy(id, error, hint)} {...props}>
        {children}
      </select>
    </Wrapper>
  );
}

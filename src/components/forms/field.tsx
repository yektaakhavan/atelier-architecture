import { AlertCircle } from "lucide-react";

type FieldProps = {
  id: string;
  label: string;
  optionalLabel?: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
};

export const hintId = (id: string) => `${id}-hint`;
export const errorId = (id: string) => `${id}-error`;

/** Props every control needs so its label, hint and error are announced together. */
export function fieldA11y(id: string, { hint, error }: { hint?: string; error?: string }) {
  const describedBy = [hint ? hintId(id) : null, error ? errorId(id) : null]
    .filter(Boolean)
    .join(" ");
  return {
    id,
    "aria-invalid": error ? (true as const) : undefined,
    "aria-describedby": describedBy || undefined,
  };
}

export function Field({ id, label, optionalLabel, hint, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
        {optionalLabel ? (
          <span className="ms-2 font-normal text-muted">{optionalLabel}</span>
        ) : null}
      </label>
      {children}
      {hint ? (
        <p id={hintId(id)} className="text-xs text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId(id)} className="flex items-start gap-2 text-sm text-accent-ink">
          <AlertCircle aria-hidden className="mt-0.5 size-4 shrink-0" />
          {error}
        </p>
      ) : null}
    </div>
  );
}

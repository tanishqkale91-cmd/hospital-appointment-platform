export default function FormField({ label, id, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
      </label>
      {children}
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}

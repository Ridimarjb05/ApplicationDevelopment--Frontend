import "../styles/forms.css";

export default function Input({ label, error, ...props }) {
    return (
        <div className="field">
            {label && <label className="field__label">{label}</label>}
            <input className={`field__input ${error ? "field__input--error" : ""}`} {...props} />
            {error && <div className="field__error">{error}</div>}
        </div>
    );
}
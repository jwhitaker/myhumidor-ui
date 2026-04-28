import type { FormEvent } from 'react'

export type CigarDraft = {
  humidor_id: string
  name: string
  brand: string
  vitola: string
  year: string
  notes: string
}

type CigarFormProps = {
  title: string
  submitLabel: string
  humidors: Array<{ id: string; name: string }>
  value: CigarDraft
  isSubmitting: boolean
  error: string | null
  onChange: (next: CigarDraft) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onCancel: () => void
}

export function CigarForm({
  title,
  submitLabel,
  humidors,
  value,
  isSubmitting,
  error,
  onChange,
  onSubmit,
  onCancel,
}: CigarFormProps) {
  return (
    <section className="modal-card" role="dialog" aria-modal="true" aria-label={title}>
      <div className="modal-header">
        <h2>{title}</h2>
        <button type="button" onClick={onCancel} aria-label="Close cigar dialog">
          Close
        </button>
      </div>
      <form className="humidor-form" onSubmit={onSubmit}>
        <label htmlFor="cigar-humidor">Humidor</label>
        <select
          id="cigar-humidor"
          value={value.humidor_id}
          onChange={(event) => onChange({ ...value, humidor_id: event.target.value })}
          required
        >
          <option value="">Select a humidor</option>
          {humidors.map((humidor) => (
            <option key={humidor.id} value={humidor.id}>
              {humidor.name}
            </option>
          ))}
        </select>

        <label htmlFor="cigar-name">Name</label>
        <input
          id="cigar-name"
          value={value.name}
          onChange={(event) => onChange({ ...value, name: event.target.value })}
          required
        />

        <label htmlFor="cigar-brand">Brand</label>
        <input
          id="cigar-brand"
          value={value.brand}
          onChange={(event) => onChange({ ...value, brand: event.target.value })}
        />

        <label htmlFor="cigar-vitola">Vitola</label>
        <input
          id="cigar-vitola"
          value={value.vitola}
          onChange={(event) => onChange({ ...value, vitola: event.target.value })}
        />

        <label htmlFor="cigar-year">Year</label>
        <input
          id="cigar-year"
          inputMode="numeric"
          value={value.year}
          onChange={(event) => onChange({ ...value, year: event.target.value })}
        />

        <label htmlFor="cigar-notes">Notes</label>
        <textarea
          id="cigar-notes"
          value={value.notes}
          onChange={(event) => onChange({ ...value, notes: event.target.value })}
          rows={3}
        />

        {error ? (
          <p className="inline-error" role="alert">
            {error}
          </p>
        ) : null}

        <div className="modal-actions">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : submitLabel}
          </button>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </section>
  )
}

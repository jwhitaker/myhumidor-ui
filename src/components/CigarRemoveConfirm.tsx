import type { Cigar } from '../api/generated'

type CigarRemoveConfirmProps = {
  cigar: Cigar
  isPending: boolean
  error: string | null
  onConfirm: () => void
  onCancel: () => void
}

export function CigarRemoveConfirm({
  cigar,
  isPending,
  error,
  onConfirm,
  onCancel,
}: CigarRemoveConfirmProps) {
  return (
    <section className="modal-card" role="dialog" aria-modal="true" aria-label="Remove cigar confirmation">
      <div className="modal-header">
        <h2>Remove cigar</h2>
        <button type="button" onClick={onCancel} aria-label="Close remove cigar dialog">
          Close
        </button>
      </div>
      <p>Remove {cigar.name} from this humidor?</p>
      {error ? (
        <p className="inline-error" role="alert">
          {error}
        </p>
      ) : null}
      <div className="modal-actions">
        <button type="button" className="danger" onClick={onConfirm} disabled={isPending}>
          {isPending ? 'Removing...' : 'Confirm remove'}
        </button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </section>
  )
}

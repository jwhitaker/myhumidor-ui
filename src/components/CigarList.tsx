import type { Cigar } from '../api/generated'

type CigarListProps = {
  cigars: Cigar[]
  onEdit: (cigar: Cigar) => void
  onRemove: (cigar: Cigar) => void
}

export function CigarList({ cigars, onEdit, onRemove }: CigarListProps) {
  if (!cigars.length) {
    return <p className="humidor-description humidor-description-empty">No cigars in this humidor yet.</p>
  }

  return (
    <ul className="cigar-list" aria-label="Cigars in selected humidor">
      {cigars.map((cigar) => (
        <li key={cigar.id} className="cigar-list-item">
          <div>
            <h3>{cigar.name}</h3>
            <p>
              {cigar.brand ?? 'Unknown brand'}
              {cigar.vitola ? ` • ${cigar.vitola}` : ''}
              {typeof cigar.year === 'number' ? ` • ${cigar.year}` : ''}
            </p>
            {cigar.notes ? <p>{cigar.notes}</p> : null}
          </div>
          <div className="card-actions">
            <button type="button" onClick={() => onEdit(cigar)}>
              Edit
            </button>
            <button type="button" className="danger" onClick={() => onRemove(cigar)}>
              Remove
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}

import { useNavigate } from 'react-router-dom'

type HumidorCardProps = {
  id: string
  name: string
  description?: string | null
  currentCount: number
  maximumCapacity: number
  onEdit: (event: React.MouseEvent<HTMLButtonElement>) => void
  onDelete: (event: React.MouseEvent<HTMLButtonElement>) => void
}

export function HumidorCard({ id, name, description, currentCount, maximumCapacity, onEdit, onDelete }: HumidorCardProps) {
  const navigate = useNavigate()

  return (
    <article
      className="humidor-card"
      aria-label={`Humidor ${name}`}
      onClick={() => void navigate(`/humidors/${id}`)}
      style={{ cursor: 'pointer' }}
    >
      <h2>{name}</h2>
      <p className="humidor-id">
        Cigars: {currentCount} / {maximumCapacity}
      </p>
      {description ? (
        <p className="humidor-description">{description}</p>
      ) : (
        <p className="humidor-description humidor-description-empty">No description provided.</p>
      )}
      <div className="card-actions" onClick={(e) => e.stopPropagation()}>
        <button type="button" onClick={onEdit}>
          Edit
        </button>
        <button type="button" className="danger" onClick={onDelete}>
          Delete
        </button>
      </div>
    </article>
  )
}

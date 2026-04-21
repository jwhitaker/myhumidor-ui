type HumidorCardProps = {
  id: string
  name: string
  description?: string | null
}

export function HumidorCard({ id, name, description }: HumidorCardProps) {
  return (
    <article className="humidor-card" aria-label={`Humidor ${name}`}>
      <h2>{name}</h2>
      <p className="humidor-id">ID: {id}</p>
      {description ? (
        <p className="humidor-description">{description}</p>
      ) : (
        <p className="humidor-description humidor-description-empty">
          No description provided.
        </p>
      )}
    </article>
  )
}

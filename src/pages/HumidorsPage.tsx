import { useQuery } from '@tanstack/react-query'
import { HumidorCard } from '../components/HumidorCard.tsx'
import { getHumidors } from '../api/humidors.ts'

export function HumidorsPage() {
  const {
    data: humidors,
    isPending,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['humidors'],
    queryFn: getHumidors,
  })

  if (isPending) {
    return (
      <section className="state-panel" aria-live="polite">
        <p>Loading humidors...</p>
      </section>
    )
  }

  if (isError) {
    return (
      <section className="state-panel state-panel-error" role="alert">
        <h2>Could not load humidors</h2>
        <p>{error instanceof Error ? error.message : 'Unexpected error'}</p>
        <button type="button" onClick={() => void refetch()}>
          Try again
        </button>
      </section>
    )
  }

  if (!humidors || humidors.length === 0) {
    return (
      <section className="state-panel" aria-live="polite">
        <h2>No humidors found</h2>
        <p>Create a humidor in the backend, then refresh this page.</p>
      </section>
    )
  }

  return (
    <section className="humidor-grid" aria-label="Humidor list">
      {humidors.map((humidor) => (
        <HumidorCard
          key={humidor.id}
          id={humidor.id}
          name={humidor.name}
          description={humidor.description}
        />
      ))}
    </section>
  )
}

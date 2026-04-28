import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Cigar } from '../api/generated'
import {
  createHumidorCigar,
  deleteHumidorCigar,
  getHumidors,
  HumidorApiError,
  listHumidorCigars,
  updateHumidorCigar,
} from '../api/humidors'
import { CigarForm, type CigarDraft } from '../components/CigarForm'
import { CigarList } from '../components/CigarList'
import { CigarRemoveConfirm } from '../components/CigarRemoveConfirm'

type EditingCigar = {
  sourceHumidorId: string
  cigar: Cigar
}

const emptyCigarDraft: CigarDraft = {
  humidor_id: '',
  name: '',
  brand: '',
  vitola: '',
  year: '',
  notes: '',
}

const messageFromError = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback

const toNullableString = (value: string) => {
  const trimmed = value.trim()
  return trimmed ? trimmed : null
}

const parseYear = (value: string) => {
  const trimmed = value.trim()
  if (!trimmed) return null
  const parsed = Number.parseInt(trimmed, 10)
  return Number.isFinite(parsed) ? parsed : null
}

export function HumidorDetailPage() {
  const { id: humidorId } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [isCreateCigarOpen, setIsCreateCigarOpen] = useState(false)
  const [createCigarDraft, setCreateCigarDraft] = useState<CigarDraft>(emptyCigarDraft)
  const [createCigarError, setCreateCigarError] = useState<string | null>(null)

  const [editingCigar, setEditingCigar] = useState<EditingCigar | null>(null)
  const [editCigarDraft, setEditCigarDraft] = useState<CigarDraft>(emptyCigarDraft)
  const [editCigarError, setEditCigarError] = useState<string | null>(null)

  const [removingCigar, setRemovingCigar] = useState<Cigar | null>(null)
  const [removeCigarError, setRemoveCigarError] = useState<string | null>(null)

  const humidorsQuery = useQuery({
    queryKey: ['humidors'],
    queryFn: getHumidors,
  })

  const humidor = humidorsQuery.data?.find((h) => h.id === humidorId) ?? null

  const cigarQuery = useQuery({
    queryKey: ['humidor-cigar-list', humidorId],
    queryFn: () => listHumidorCigars(humidorId ?? ''),
    enabled: Boolean(humidorId),
  })

  const sortedHumidors = [...(humidorsQuery.data ?? [])].sort((a, b) => a.name.localeCompare(b.name))

  const createCigarMutation = useMutation({
    mutationFn: ({ draft }: { draft: CigarDraft }) =>
      createHumidorCigar(humidorId ?? '', {
        humidor_id: draft.humidor_id,
        name: draft.name,
        brand: toNullableString(draft.brand),
        vitola: toNullableString(draft.vitola),
        year: parseYear(draft.year),
        notes: toNullableString(draft.notes),
      }),
    onSuccess: async () => {
      setIsCreateCigarOpen(false)
      setCreateCigarError(null)
      setCreateCigarDraft(emptyCigarDraft)
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['humidors'] }),
        queryClient.invalidateQueries({ queryKey: ['humidor-cigar-list', humidorId] }),
      ])
    },
    onError: (mutationError) => {
      setCreateCigarError(messageFromError(mutationError, 'Could not create cigar'))
    },
  })

  const updateCigarMutation = useMutation({
    mutationFn: ({
      sourceHumidorId,
      cigarId,
      draft,
    }: {
      sourceHumidorId: string
      cigarId: string
      draft: CigarDraft
    }) =>
      updateHumidorCigar(sourceHumidorId, cigarId, {
        humidor_id: draft.humidor_id,
        name: draft.name,
        brand: toNullableString(draft.brand),
        vitola: toNullableString(draft.vitola),
        year: parseYear(draft.year),
        notes: toNullableString(draft.notes),
      }),
    onSuccess: async (_data, variables) => {
      const destinationHumidorId = variables.draft.humidor_id
      setEditingCigar(null)
      setEditCigarError(null)
      const invalidations = [
        queryClient.invalidateQueries({ queryKey: ['humidors'] }),
        queryClient.invalidateQueries({ queryKey: ['humidor-cigar-list', variables.sourceHumidorId] }),
      ]
      if (destinationHumidorId && destinationHumidorId !== variables.sourceHumidorId) {
        invalidations.push(
          queryClient.invalidateQueries({ queryKey: ['humidor-cigar-list', destinationHumidorId] }),
        )
        await Promise.all(invalidations)
        void navigate(`/humidors/${destinationHumidorId}`)
      } else {
        await Promise.all(invalidations)
      }
    },
    onError: (mutationError) => {
      setEditCigarError(messageFromError(mutationError, 'Could not update cigar'))
    },
  })

  const removeCigarMutation = useMutation({
    mutationFn: ({ humidorId: hid, cigarId }: { humidorId: string; cigarId: string }) =>
      deleteHumidorCigar(hid, cigarId),
    onSuccess: async () => {
      setRemovingCigar(null)
      setRemoveCigarError(null)
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['humidors'] }),
        queryClient.invalidateQueries({ queryKey: ['humidor-cigar-list', humidorId] }),
      ])
    },
    onError: (mutationError) => {
      if (mutationError instanceof HumidorApiError && mutationError.status === 404) {
        setRemovingCigar(null)
        void queryClient.invalidateQueries({ queryKey: ['humidor-cigar-list', humidorId] })
      } else {
        setRemoveCigarError(messageFromError(mutationError, 'Could not remove cigar'))
      }
    },
  })

  if (humidorsQuery.isPending) {
    return (
      <section className="state-panel" aria-live="polite">
        <p>Loading humidor...</p>
      </section>
    )
  }

  if (humidorsQuery.isError) {
    return (
      <section className="state-panel state-panel-error" role="alert">
        <h2>Could not load humidor</h2>
        <p>{messageFromError(humidorsQuery.error, 'Unexpected error')}</p>
        <button type="button" onClick={() => void humidorsQuery.refetch()}>
          Try again
        </button>
      </section>
    )
  }

  if (!humidor) {
    return (
      <section className="state-panel state-panel-error" role="alert">
        <h2>Humidor not found</h2>
        <button type="button" onClick={() => void navigate('/humidors')}>
          Back to humidors
        </button>
      </section>
    )
  }

  const capacityLabel =
    humidor.maximum_capacity === 0
      ? '0 / 0'
      : `${humidor.current_count} / ${humidor.maximum_capacity}`

  return (
    <>
      <section className="humidor-toolbar" aria-label="Humidor detail actions">
        <button type="button" onClick={() => void navigate('/humidors')}>
          ← Back
        </button>
      </section>

      <section aria-label="Humidor details">
        <div className="modal-header">
          <h2>{humidor.name}</h2>
          <button
            type="button"
            onClick={() => {
              setCreateCigarError(null)
              setCreateCigarDraft({ ...emptyCigarDraft, humidor_id: humidor.id })
              setIsCreateCigarOpen(true)
            }}
          >
            Add cigar
          </button>
        </div>
        <p>
          Cigars: {capacityLabel}
        </p>
        {humidor.description ? (
          <p className="humidor-description">{humidor.description}</p>
        ) : (
          <p className="humidor-description humidor-description-empty">No description provided.</p>
        )}
      </section>

      {cigarQuery.isPending ? (
        <section className="state-panel" aria-live="polite">
          <p>Loading cigars...</p>
        </section>
      ) : cigarQuery.isError ? (
        <section className="state-panel state-panel-error" role="alert">
          <p>{messageFromError(cigarQuery.error, 'Could not load cigars')}</p>
          <button type="button" onClick={() => void cigarQuery.refetch()}>
            Try again
          </button>
        </section>
      ) : cigarQuery.data ? (
        <CigarList
          cigars={cigarQuery.data}
          onEdit={(cigar) => {
            setEditCigarError(null)
            setEditingCigar({ sourceHumidorId: cigar.humidor_id, cigar })
            setEditCigarDraft({
              humidor_id: cigar.humidor_id,
              name: cigar.name,
              brand: cigar.brand ?? '',
              vitola: cigar.vitola ?? '',
              year: typeof cigar.year === 'number' ? String(cigar.year) : '',
              notes: cigar.notes ?? '',
            })
          }}
          onRemove={(cigar) => {
            setRemoveCigarError(null)
            setRemovingCigar(cigar)
          }}
        />
      ) : null}

      {isCreateCigarOpen ? (
        <div
          className="modal-backdrop"
          role="presentation"
          onClick={(event) => {
            if (event.currentTarget === event.target) setIsCreateCigarOpen(false)
          }}
        >
          <CigarForm
            title="Add cigar"
            submitLabel="Create cigar"
            humidors={sortedHumidors}
            value={createCigarDraft}
            isSubmitting={createCigarMutation.isPending}
            error={createCigarError}
            onChange={setCreateCigarDraft}
            onCancel={() => setIsCreateCigarOpen(false)}
            onSubmit={(event: FormEvent<HTMLFormElement>) => {
              event.preventDefault()
              createCigarMutation.mutate({ draft: createCigarDraft })
            }}
          />
        </div>
      ) : null}

      {editingCigar ? (
        <div
          className="modal-backdrop"
          role="presentation"
          onClick={(event) => {
            if (event.currentTarget === event.target) setEditingCigar(null)
          }}
        >
          <CigarForm
            title="Edit cigar"
            submitLabel="Save changes"
            humidors={sortedHumidors}
            value={editCigarDraft}
            isSubmitting={updateCigarMutation.isPending}
            error={editCigarError}
            onChange={setEditCigarDraft}
            onCancel={() => setEditingCigar(null)}
            onSubmit={(event: FormEvent<HTMLFormElement>) => {
              event.preventDefault()
              updateCigarMutation.mutate({
                sourceHumidorId: editingCigar.sourceHumidorId,
                cigarId: editingCigar.cigar.id,
                draft: editCigarDraft,
              })
            }}
          />
        </div>
      ) : null}

      {removingCigar ? (
        <div
          className="modal-backdrop"
          role="presentation"
          onClick={(event) => {
            if (event.currentTarget === event.target) setRemovingCigar(null)
          }}
        >
          <CigarRemoveConfirm
            cigar={removingCigar}
            isPending={removeCigarMutation.isPending}
            error={removeCigarError}
            onCancel={() => setRemovingCigar(null)}
            onConfirm={() =>
              removeCigarMutation.mutate({
                humidorId: removingCigar.humidor_id,
                cigarId: removingCigar.id,
              })
            }
          />
        </div>
      ) : null}
    </>
  )
}

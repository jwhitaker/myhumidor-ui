import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createHumidor,
  deleteHumidor,
  getHumidors,
  HumidorApiError,
  updateHumidor,
} from '../api/humidors'

type EditDraft = {
  name: string
  description: string
}

const messageFromError = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback

export function HumidorsPage() {
  const queryClient = useQueryClient()
  const createTriggerRef = useRef<HTMLButtonElement | null>(null)
  const editTriggerRef = useRef<HTMLButtonElement | null>(null)

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [createName, setCreateName] = useState('')
  const [createDescription, setCreateDescription] = useState('')
  const [createError, setCreateError] = useState<string | null>(null)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editDrafts, setEditDrafts] = useState<Record<string, EditDraft>>({})
  const [editErrors, setEditErrors] = useState<Record<string, string>>({})

  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

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

  const sortedHumidors = useMemo(
    () => [...(humidors ?? [])].sort((a, b) => a.name.localeCompare(b.name)),
    [humidors],
  )

  const closeCreateModal = () => {
    setIsCreateModalOpen(false)
    setCreateError(null)
    createTriggerRef.current?.focus()
  }

  const beginEdit = (
    id: string,
    name: string,
    description: string | null | undefined,
    trigger: HTMLButtonElement,
  ) => {
    editTriggerRef.current = trigger
    setEditErrors((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
    setEditingId(id)
    setEditDrafts((prev) => ({
      ...prev,
      [id]: { name, description: description ?? '' },
    }))
  }

  const closeEditModal = (id: string) => {
    setEditingId(null)
    setEditErrors((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
    setEditDrafts((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
    editTriggerRef.current?.focus()
  }

  useEffect(() => {
    if (!isCreateModalOpen && !editingId) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return
      }

      if (editingId) {
        setEditingId(null)
        setEditErrors((prev) => {
          const next = { ...prev }
          delete next[editingId]
          return next
        })
        setEditDrafts((prev) => {
          const next = { ...prev }
          delete next[editingId]
          return next
        })
        editTriggerRef.current?.focus()
        return
      }

      if (isCreateModalOpen) {
        setIsCreateModalOpen(false)
        setCreateError(null)
        createTriggerRef.current?.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [editingId, isCreateModalOpen])

  const createMutation = useMutation({
    mutationFn: createHumidor,
    onSuccess: async () => {
      setCreateName('')
      setCreateDescription('')
      setCreateError(null)
      setIsCreateModalOpen(false)
      await queryClient.invalidateQueries({ queryKey: ['humidors'] })
      createTriggerRef.current?.focus()
    },
    onError: (mutationError) => {
      setCreateError(messageFromError(mutationError, 'Could not create humidor'))
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, name, description }: { id: string; name: string; description: string }) =>
      updateHumidor(id, {
        name,
        description: description.trim() ? description : null,
      }),
    onSuccess: async (_data, variables) => {
      closeEditModal(variables.id)
      await queryClient.invalidateQueries({ queryKey: ['humidors'] })
    },
    onError: async (mutationError, variables) => {
      setEditErrors((prev) => ({
        ...prev,
        [variables.id]: messageFromError(mutationError, 'Could not update humidor'),
      }))
      if (mutationError instanceof HumidorApiError && mutationError.status === 404) {
        closeEditModal(variables.id)
        await queryClient.invalidateQueries({ queryKey: ['humidors'] })
      }
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteHumidor,
    onSuccess: async () => {
      setPendingDeleteId(null)
      setDeleteError(null)
      await queryClient.invalidateQueries({ queryKey: ['humidors'] })
    },
    onError: async (mutationError) => {
      setDeleteError(messageFromError(mutationError, 'Could not delete humidor'))
      if (mutationError instanceof HumidorApiError && mutationError.status === 404) {
        setPendingDeleteId(null)
        await queryClient.invalidateQueries({ queryKey: ['humidors'] })
      }
    },
  })

  const submitCreate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setCreateError(null)
    createMutation.mutate({
      name: createName,
      description: createDescription.trim() ? createDescription : null,
    })
  }

  const editingHumidor = editingId
    ? sortedHumidors.find((humidor) => humidor.id === editingId) ?? null
    : null

  const editingDraft =
    editingId && editingHumidor
      ? (editDrafts[editingId] ?? {
          name: editingHumidor.name,
          description: editingHumidor.description ?? '',
        })
      : null

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

  return (
    <>
      <section className="humidor-toolbar" aria-label="Humidor actions">
        <button
          ref={createTriggerRef}
          type="button"
          onClick={() => {
            setCreateError(null)
            setIsCreateModalOpen(true)
          }}
        >
          Add humidor
        </button>
      </section>

      {!sortedHumidors.length ? (
        <section className="state-panel" aria-live="polite">
          <h2>No humidors found</h2>
          <p>Create your first humidor with the add button above.</p>
        </section>
      ) : (
        <section className="humidor-grid" aria-label="Humidor list">
          {sortedHumidors.map((humidor) => (
            <article key={humidor.id} className="humidor-card" aria-label={`Humidor ${humidor.name}`}>
              <h2>{humidor.name}</h2>
              <p className="humidor-id">ID: {humidor.id}</p>
              {humidor.description ? (
                <p className="humidor-description">{humidor.description}</p>
              ) : (
                <p className="humidor-description humidor-description-empty">No description provided.</p>
              )}
              {deleteError && pendingDeleteId === humidor.id ? (
                <p className="inline-error" role="alert">
                  {deleteError}
                </p>
              ) : null}
              <div className="card-actions">
                <button
                  type="button"
                  onClick={(event) =>
                    beginEdit(
                      humidor.id,
                      humidor.name,
                      humidor.description,
                      event.currentTarget,
                    )
                  }
                >
                  Edit
                </button>
                {pendingDeleteId === humidor.id ? (
                  <>
                    <button
                      type="button"
                      className="danger"
                      onClick={() => deleteMutation.mutate(humidor.id)}
                      disabled={deleteMutation.isPending}
                    >
                      {deleteMutation.isPending ? 'Deleting...' : 'Confirm delete'}
                    </button>
                    <button type="button" onClick={() => setPendingDeleteId(null)}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="danger"
                    onClick={() => {
                      setDeleteError(null)
                      setPendingDeleteId(humidor.id)
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
            </article>
          ))}
        </section>
      )}

      {isCreateModalOpen ? (
        <div
          className="modal-backdrop"
          role="presentation"
          onClick={(event) => {
            if (event.currentTarget === event.target) {
              closeCreateModal()
            }
          }}
        >
          <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="create-modal-title">
            <div className="modal-header">
              <h2 id="create-modal-title">Add Humidor</h2>
              <button type="button" onClick={closeCreateModal} aria-label="Close add humidor dialog">
                Close
              </button>
            </div>
            <form className="humidor-form" onSubmit={submitCreate}>
              <label htmlFor="create-name">Name</label>
              <input
                id="create-name"
                autoFocus
                value={createName}
                onChange={(event) => setCreateName(event.target.value)}
                placeholder="Living Room Humidor"
                maxLength={120}
                required
              />
              <label htmlFor="create-description">Description</label>
              <textarea
                id="create-description"
                value={createDescription}
                onChange={(event) => setCreateDescription(event.target.value)}
                placeholder="Temperature and humidity details"
                rows={3}
              />
              {createError ? (
                <p className="inline-error" role="alert">
                  {createError}
                </p>
              ) : null}
              <div className="modal-actions">
                <button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'Creating...' : 'Save'}
                </button>
                <button type="button" onClick={closeCreateModal}>
                  Cancel
                </button>
              </div>
            </form>
          </section>
        </div>
      ) : null}

      {editingId && editingHumidor && editingDraft ? (
        <div
          className="modal-backdrop"
          role="presentation"
          onClick={(event) => {
            if (event.currentTarget === event.target) {
              closeEditModal(editingId)
            }
          }}
        >
          <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="edit-modal-title">
            <div className="modal-header">
              <h2 id="edit-modal-title">Edit Humidor</h2>
              <button
                type="button"
                onClick={() => closeEditModal(editingId)}
                aria-label="Close edit humidor dialog"
              >
                Close
              </button>
            </div>
            <form
              className="humidor-form"
              onSubmit={(event) => {
                event.preventDefault()
                updateMutation.mutate({
                  id: editingId,
                  name: editingDraft.name,
                  description: editingDraft.description,
                })
              }}
            >
              <label htmlFor="edit-name">Name</label>
              <input
                id="edit-name"
                autoFocus
                value={editingDraft.name}
                onChange={(event) =>
                  setEditDrafts((prev) => ({
                    ...prev,
                    [editingId]: { ...editingDraft, name: event.target.value },
                  }))
                }
                required
              />
              <label htmlFor="edit-description">Description</label>
              <textarea
                id="edit-description"
                value={editingDraft.description}
                onChange={(event) =>
                  setEditDrafts((prev) => ({
                    ...prev,
                    [editingId]: { ...editingDraft, description: event.target.value },
                  }))
                }
                rows={3}
              />
              {editErrors[editingId] ? (
                <p className="inline-error" role="alert">
                  {editErrors[editingId]}
                </p>
              ) : null}
              <div className="modal-actions">
                <button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? 'Saving...' : 'Save'}
                </button>
                <button type="button" onClick={() => closeEditModal(editingId)}>
                  Cancel
                </button>
              </div>
            </form>
          </section>
        </div>
      ) : null}
    </>
  )
}

import { useEffect, useMemo, useState } from 'react'
import { AlertCircle, LoaderCircle, Plus } from 'lucide-react'
import Button from '../components/common/Button'
import CategoryFormModal from '../components/CategoryFormModal'
import CategoryTable from '../components/CategoryTable'
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from '../api/categoryApi'

const getErrorMessage = (error, fallbackMessage) => {
  const message = error?.response?.data?.message
  return typeof message === 'string' && message.trim() ? message : fallbackMessage
}

export default function Category() {
  const [categories, setCategories] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [error, setError] = useState('')

  const headingStats = useMemo(() => {
    return {
      totalCategories: categories.length,
    }
  }, [categories])

  useEffect(() => {
    const loadCategories = async () => {
      setIsLoading(true)
      setError('')

      try {
        const data = await getCategories()
        setCategories(Array.isArray(data) ? data : [])
      } catch (apiError) {
        setError(getErrorMessage(apiError, 'Unable to load categories right now.'))
      } finally {
        setIsLoading(false)
      }
    }

    loadCategories()
  }, [])

  const openAddModal = () => {
    setEditingCategory(null)
    setIsModalOpen(true)
  }

  const openEditModal = (category) => {
    setEditingCategory(category)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingCategory(null)
  }

  const handleSubmitCategory = async (title) => {
    setIsSaving(true)
    setError('')

    try {
      if (editingCategory) {
        const updated = await updateCategory(editingCategory.id, { title })

        setCategories((previousCategories) =>
          previousCategories.map((category) =>
            category.id === editingCategory.id ? updated : category
          )
        )
      } else {
        const created = await createCategory({ title })
        setCategories((previousCategories) => [created, ...previousCategories])
      }

      closeModal()
    } catch (apiError) {
      setError(getErrorMessage(apiError, 'Unable to save category. Please try again.'))
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteCategory = async (category) => {
    const shouldDelete = window.confirm(`Delete category "${category.title}"?`)

    if (!shouldDelete) {
      return
    }

    setDeletingId(category.id)
    setError('')

    try {
      await deleteCategory(category.id)
      setCategories((previousCategories) =>
        previousCategories.filter((item) => item.id !== category.id)
      )
    } catch (apiError) {
      setError(getErrorMessage(apiError, 'Unable to delete category. Please try again.'))
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <section className="space-y-6 text-left">
      <div className="overflow-hidden rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="m-0 text-xs font-semibold uppercase tracking-[0.2em] text-violet-600">
              Budget control
            </p>
            <h1 className="m-0 mt-2 text-3xl font-semibold text-gray-900">Category Management</h1>
            <p className="mt-2 text-sm text-gray-600">
              Create and maintain your expense buckets so every transaction stays structured.
            </p>
          </div>

          <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:self-start lg:self-auto">
            <div className="rounded-2xl border border-violet-200 bg-white px-4 py-3 shadow-sm">
              <p className="m-0 text-xs font-medium uppercase tracking-wide text-violet-600">
                Total Categories
              </p>
              <p className="m-0 mt-1 text-2xl font-bold text-gray-900">{headingStats.totalCategories}</p>
            </div>

            <Button
              type="button"
              onClick={openAddModal}
              className="h-11 w-full gap-2 rounded-xl bg-violet-600 px-4 text-white shadow-md shadow-violet-200 transition hover:bg-violet-700 sm:w-auto"
            >
              <Plus size={16} />
              Add Category
            </Button>
          </div>
        </div>
      </div>

      {error ? (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      ) : null}

      {isLoading ? (
        <div className="flex min-h-44 items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 text-center text-sm text-gray-600">
          <LoaderCircle size={18} className="mr-2 animate-spin" />
          Loading categories...
        </div>
      ) : (
        <CategoryTable
          categories={categories}
          deletingId={deletingId}
          onEdit={openEditModal}
          onDelete={handleDeleteCategory}
        />
      )}

      <CategoryFormModal
        key={editingCategory?.id ?? 'new-category'}
        isOpen={isModalOpen}
        mode={editingCategory ? 'edit' : 'add'}
        initialTitle={editingCategory?.title ?? ''}
        onClose={closeModal}
        onSubmit={handleSubmitCategory}
        isSubmitting={isSaving}
      />
    </section>
  )
}

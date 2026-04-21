import { useState } from 'react'
import { LoaderCircle, X } from 'lucide-react'
import Button from '../common/Button'

export default function CategoryFormModal({
  isOpen,
  mode = 'add',
  initialTitle = '',
  onClose,
  onSubmit,
  isSubmitting = false,
}) {
  const [title, setTitle] = useState(initialTitle)

  if (!isOpen) {
    return null
  }

  const isEdit = mode === 'edit'

  const handleSubmit = (event) => {
    event.preventDefault()
    const trimmedTitle = title.trim()

    if (!trimmedTitle || isSubmitting) {
      return
    }

    onSubmit(trimmedTitle)
  }

  const handleClose = () => {
    if (isSubmitting) {
      return
    }

    setTitle('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div className="text-left">
            <h2 className="text-xl font-semibold text-gray-900">
              {isEdit ? 'Edit category' : 'Add category'}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {isEdit
                ? 'Update the category name and save changes.'
                : 'Enter a category title and submit to add it.'}
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="Close dialog"
            disabled={isSubmitting}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="text-left">
            <label htmlFor="category-title" className="mb-1.5 block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              id="category-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Grocery"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              autoFocus
              disabled={isSubmitting}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              className="border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="gap-2 bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-60"
              disabled={!title.trim() || isSubmitting}
            >
              {isSubmitting ? <LoaderCircle size={14} className="animate-spin" /> : null}
              {isEdit ? 'Save changes' : 'Submit'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

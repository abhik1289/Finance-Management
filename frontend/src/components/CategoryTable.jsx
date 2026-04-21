import { LoaderCircle, Pencil, Trash2 } from 'lucide-react'

const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

export default function CategoryTable({
  categories,
  deletingId = null,
  onEdit,
  onDelete,
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-[640px] w-full divide-y divide-gray-200 text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Sl No</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Category Name
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Created</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 bg-white">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-sm text-gray-500">
                  No categories added yet.
                </td>
              </tr>
            ) : (
              categories.map((category, index) => (
                <tr key={category.id} className="hover:bg-violet-50/30">
                  <td className="px-4 py-3 text-sm text-gray-700">{index + 1}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{category.title}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{formatDate(category.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(category)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-violet-200 text-violet-700 transition hover:bg-violet-50"
                        aria-label="Edit category"
                      >
                        <Pencil size={14} />
                      </button>

                      <button
                        type="button"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-red-200 text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                        onClick={() => onDelete(category)}
                        disabled={deletingId === category.id}
                        aria-label="Delete category"
                      >
                        {deletingId === category.id ? (
                          <LoaderCircle size={14} className="animate-spin" />
                        ) : (
                          <Trash2 size={14} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

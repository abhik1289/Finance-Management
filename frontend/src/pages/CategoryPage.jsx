import { useState } from 'react'
import { Plus } from 'lucide-react'
import Button from '../components/common/Button'
import CategoryFormModal from '../components/category/CategoryFormModal'
import CategoryTable from '../components/category/CategoryTable'

const createCategoryRecord = (title) => ({
  id: crypto.randomUUID(),
  title,
  createdAt: new Date().toISOString(),
})

export default function CategoryPage() {
  const [categories, setCategories] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)

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

  const handleSubmitCategory = (title) => {
    if (editingCategory) {
      setCategories((previousCategories) =>
        previousCategories.map((category) =>
          category.id === editingCategory.id ? { ...category, title } : category
        )
      )
    } else {
      setCategories((previousCategories) => [
        createCategoryRecord(title),
        ...previousCategories,
      ])
    }

    closeModal()
  }

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-left">
            <h1 className="m-0 text-3xl font-semibold text-gray-900">Category</h1>
            <p className="mt-1 text-sm text-gray-600">
              Add, review, and update your expense categories from one place.
            </p>
          </div>

          <Button
            type="button"
            onClick={openAddModal}
            className="h-10 gap-2 rounded-lg bg-violet-600 px-4 text-white hover:bg-violet-700"
          >
            <Plus size={16} />
            Add Category
          </Button>
        </div>
      </div>

      <CategoryTable categories={categories} onEdit={openEditModal} />

      <CategoryFormModal
        key={editingCategory?.id ?? 'new-category'}
        isOpen={isModalOpen}
        mode={editingCategory ? 'edit' : 'add'}
        initialTitle={editingCategory?.title ?? ''}
        onClose={closeModal}
        onSubmit={handleSubmitCategory}
      />
    </section>
  )
}

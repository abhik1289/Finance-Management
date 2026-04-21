import { useEffect, useMemo, useState } from 'react'
import { AlertCircle, LoaderCircle, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import Button from '../components/common/Button'
import { getCategories } from '../api/categoryApi'
import {
  createTransaction,
  deleteTransaction,
  getTransactions,
  updateTransaction,
} from '../api/transactionApi'

const typeOptions = ['credit', 'debit']

const getErrorMessage = (error, fallbackMessage) => {
  const message = error?.response?.data?.message
  return typeof message === 'string' && message.trim() ? message : fallbackMessage
}

const normalizeTransaction = (transaction) => ({
  ...transaction,
  type: String(transaction?.type ?? '').toLowerCase(),
  amount: Number(transaction?.amount ?? 0),
  categoryId: transaction?.categoryId != null ? String(transaction.categoryId) : '',
})

export default function ExpensesPage() {
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedType, setSelectedType] = useState('all')

  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    amount: '',
    type: 'debit',
  })

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true)
      setError('')

      try {
        const [categoriesData, transactionsData] = await Promise.all([
          getCategories(),
          getTransactions(),
        ])

        const safeCategories = Array.isArray(categoriesData) ? categoriesData : []
        const safeTransactions = Array.isArray(transactionsData)
          ? transactionsData.map(normalizeTransaction)
          : []

        setCategories(safeCategories)
        setTransactions(safeTransactions)

        if (safeCategories.length > 0) {
          setFormData((previous) => ({
            ...previous,
            categoryId: previous.categoryId || String(safeCategories[0].id),
          }))
        }
      } catch (apiError) {
        setError(getErrorMessage(apiError, 'Unable to load transactions right now.'))
      } finally {
        setIsLoading(false)
      }
    }

    loadInitialData()
  }, [])

  const categoriesById = useMemo(() => {
    return new Map(categories.map((category) => [String(category.id), category.title]))
  }, [categories])

  const filteredTransactions = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()

    return transactions.filter((transaction) => {
      const transactionCategoryId = String(transaction.categoryId)

      const matchesCategory = selectedCategory === 'all' || transactionCategoryId === selectedCategory
      const matchesType = selectedType === 'all' || transaction.type === selectedType

      const categoryTitle =
        transaction.categoryTitle || categoriesById.get(transactionCategoryId) || 'Uncategorized'

      const matchesSearch =
        normalizedQuery.length === 0 ||
        transaction.name.toLowerCase().includes(normalizedQuery) ||
        categoryTitle.toLowerCase().includes(normalizedQuery) ||
        String(transaction.amount).includes(normalizedQuery)

      return matchesCategory && matchesType && matchesSearch
    })
  }, [transactions, searchQuery, selectedCategory, selectedType, categoriesById])

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingTransaction(null)

    setFormData({
      name: '',
      categoryId: categories[0] ? String(categories[0].id) : '',
      amount: '',
      type: 'debit',
    })
  }

  const openAddModal = () => {
    setEditingTransaction(null)
    setFormData({
      name: '',
      categoryId: categories[0] ? String(categories[0].id) : '',
      amount: '',
      type: 'debit',
    })
    setIsModalOpen(true)
  }

  const openEditModal = (transaction) => {
    setEditingTransaction(transaction)
    setFormData({
      name: transaction.name,
      categoryId: String(transaction.categoryId),
      amount: String(transaction.amount),
      type: transaction.type,
    })
    setIsModalOpen(true)
  }

  const handleSubmitTransaction = async (event) => {
    event.preventDefault()

    const trimmedName = formData.name.trim()
    const parsedAmount = Number(formData.amount)

    if (!trimmedName || !formData.categoryId || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      return
    }

    setIsSaving(true)
    setError('')

    const payload = {
      name: trimmedName,
      categoryId: Number(formData.categoryId),
      amount: parsedAmount,
      type: formData.type.toUpperCase(),
    }

    try {
      if (editingTransaction) {
        const updated = normalizeTransaction(
          await updateTransaction(editingTransaction.id, payload)
        )

        setTransactions((previousTransactions) =>
          previousTransactions.map((transaction) =>
            transaction.id === editingTransaction.id ? updated : transaction
          )
        )
      } else {
        const created = normalizeTransaction(await createTransaction(payload))
        setTransactions((previousTransactions) => [created, ...previousTransactions])
      }

      closeModal()
    } catch (apiError) {
      setError(getErrorMessage(apiError, 'Unable to save transaction. Please try again.'))
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteTransaction = async (transaction) => {
    const shouldDelete = window.confirm(`Delete transaction "${transaction.name}"?`)

    if (!shouldDelete) {
      return
    }

    setDeletingId(transaction.id)
    setError('')

    try {
      await deleteTransaction(transaction.id)
      setTransactions((previousTransactions) =>
        previousTransactions.filter((item) => item.id !== transaction.id)
      )
    } catch (apiError) {
      setError(getErrorMessage(apiError, 'Unable to delete transaction. Please try again.'))
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
              Finance activity
            </p>
            <h1 className="m-0 mt-2 text-3xl font-semibold text-gray-900">Transactions</h1>
            <p className="mt-2 text-sm text-gray-600">
              Track credits and debits with searchable, filterable, and fully actionable records.
            </p>
          </div>

          <Button
            type="button"
            onClick={openAddModal}
            className="h-11 w-full gap-2 rounded-xl bg-violet-600 px-4 text-white shadow-md shadow-violet-200 transition hover:bg-violet-700 sm:w-auto"
            disabled={categories.length === 0}
          >
            <Plus size={16} />
            Add Transaction
          </Button>
        </div>
      </div>

      {error ? (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      ) : null}

      {categories.length === 0 && !isLoading ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Add at least one category before creating transactions.
        </div>
      ) : null}

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="relative">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by name, category, or amount"
              className="h-10 w-full rounded-lg border border-gray-300 pl-9 pr-3 text-sm text-gray-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
            className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm text-gray-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={String(category.id)}>
                {category.title}
              </option>
            ))}
          </select>

          <select
            value={selectedType}
            onChange={(event) => setSelectedType(event.target.value)}
            className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm text-gray-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          >
            <option value="all">All Types</option>
            {typeOptions.map((type) => (
              <option key={type} value={type}>
                {type[0].toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <div className="mt-5 flex min-h-44 items-center justify-center rounded-xl border border-gray-100 bg-gray-50 text-sm text-gray-600">
            <LoaderCircle size={18} className="mr-2 animate-spin" />
            Loading transactions...
          </div>
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-[760px] w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500">
                  <th className="px-3 py-3 font-semibold">Transaction</th>
                  <th className="px-3 py-3 font-semibold">Category</th>
                  <th className="px-3 py-3 font-semibold">Type</th>
                  <th className="px-3 py-3 font-semibold">Amount</th>
                  <th className="px-3 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => {
                    const categoryTitle =
                      transaction.categoryTitle ||
                      categoriesById.get(String(transaction.categoryId)) ||
                      'Uncategorized'

                    return (
                      <tr key={transaction.id} className="border-b border-gray-100 text-gray-800">
                        <td className="px-3 py-3 font-medium">{transaction.name}</td>
                        <td className="px-3 py-3">{categoryTitle}</td>
                        <td className="px-3 py-3">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                              transaction.type === 'credit'
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-rose-100 text-rose-700'
                            }`}
                          >
                            {transaction.type}
                          </span>
                        </td>
                        <td
                          className={`px-3 py-3 font-semibold ${
                            transaction.type === 'credit' ? 'text-emerald-700' : 'text-rose-700'
                          }`}
                        >
                          ₹{transaction.amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openEditModal(transaction)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-violet-200 text-violet-700 transition hover:bg-violet-50"
                              aria-label="Edit transaction"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteTransaction(transaction)}
                              disabled={deletingId === transaction.id}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-red-200 text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                              aria-label="Delete transaction"
                            >
                              {deletingId === transaction.id ? (
                                <LoaderCircle size={14} className="animate-spin" />
                              ) : (
                                <Trash2 size={14} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="px-3 py-8 text-center text-sm text-gray-500">
                      No transactions found for current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-4 shadow-2xl sm:p-6">
            <h2 className="m-0 text-xl font-semibold text-gray-900">
              {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Fill transaction name, category, amount, and type.
            </p>

            <form onSubmit={handleSubmitTransaction} className="mt-5 space-y-4">
              <div>
                <label htmlFor="transaction-name" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Transaction Name
                </label>
                <input
                  id="transaction-name"
                  type="text"
                  value={formData.name}
                  onChange={(event) =>
                    setFormData((previous) => ({ ...previous, name: event.target.value }))
                  }
                  placeholder="e.g. Monthly Salary"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                  autoFocus
                  disabled={isSaving}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="transaction-category"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Category
                  </label>
                  <select
                    id="transaction-category"
                    value={formData.categoryId}
                    onChange={(event) =>
                      setFormData((previous) => ({ ...previous, categoryId: event.target.value }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                    disabled={isSaving}
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={String(category.id)}>
                        {category.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="transaction-amount" className="mb-1.5 block text-sm font-medium text-gray-700">
                    Amount
                  </label>
                  <input
                    id="transaction-amount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={formData.amount}
                    onChange={(event) =>
                      setFormData((previous) => ({ ...previous, amount: event.target.value }))
                    }
                    placeholder="0.00"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                    disabled={isSaving}
                  />
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-gray-700">Type</p>
                <div className="grid grid-cols-2 gap-3">
                  {typeOptions.map((type) => (
                    <label
                      key={type}
                      className={`cursor-pointer rounded-lg border px-3 py-2 text-center text-sm font-medium capitalize transition ${
                        formData.type === type
                          ? 'border-violet-500 bg-violet-50 text-violet-700'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      } ${isSaving ? 'pointer-events-none opacity-70' : ''}`}
                    >
                      <input
                        type="radio"
                        name="transaction-type"
                        value={type}
                        checked={formData.type === type}
                        onChange={(event) =>
                          setFormData((previous) => ({ ...previous, type: event.target.value }))
                        }
                        className="sr-only"
                        disabled={isSaving}
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <Button
                  type="button"
                  onClick={closeModal}
                  className="border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-violet-600 text-white hover:bg-violet-700"
                  disabled={
                    isSaving ||
                    !formData.name.trim() ||
                    !formData.categoryId ||
                    !formData.amount ||
                    Number(formData.amount) <= 0
                  }
                >
                  {isSaving ? 'Saving...' : 'Save Transaction'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  )
}

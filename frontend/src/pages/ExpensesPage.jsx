import { useMemo, useState } from 'react'
import { Plus, Search } from 'lucide-react'
import Button from '../components/common/Button'

const categoryOptions = ['Food', 'Transport', 'Salary', 'Shopping', 'Utilities']

const typeOptions = ['credit', 'debit']

const initialTransactions = [
  {
    id: crypto.randomUUID(),
    name: 'Salary April',
    category: 'Salary',
    amount: 52000,
    type: 'credit',
    createdAt: new Date('2026-04-01T10:00:00').toISOString(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Grocery Market',
    category: 'Food',
    amount: 2350,
    type: 'debit',
    createdAt: new Date('2026-04-05T18:45:00').toISOString(),
  },
]

export default function ExpensesPage() {
  const [transactions, setTransactions] = useState(initialTransactions)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [formData, setFormData] = useState({
    name: '',
    category: categoryOptions[0],
    amount: '',
    type: 'debit',
  })

  const uniqueCategories = useMemo(() => {
    const categoriesFromTransactions = transactions.map((transaction) => transaction.category)
    return Array.from(new Set([...categoryOptions, ...categoriesFromTransactions]))
  }, [transactions])

  const filteredTransactions = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()

    return transactions.filter((transaction) => {
      const matchesCategory =
        selectedCategory === 'all' || transaction.category === selectedCategory
      const matchesType = selectedType === 'all' || transaction.type === selectedType

      const matchesSearch =
        normalizedQuery.length === 0 ||
        transaction.name.toLowerCase().includes(normalizedQuery) ||
        String(transaction.amount).includes(normalizedQuery)

      return matchesCategory && matchesType && matchesSearch
    })
  }, [transactions, searchQuery, selectedCategory, selectedType])

  const closeModal = () => {
    setIsModalOpen(false)
    setFormData({
      name: '',
      category: categoryOptions[0],
      amount: '',
      type: 'debit',
    })
  }

  const handleAddTransaction = (event) => {
    event.preventDefault()

    const trimmedName = formData.name.trim()
    const parsedAmount = Number(formData.amount)

    if (!trimmedName || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      return
    }

    const newTransaction = {
      id: crypto.randomUUID(),
      name: trimmedName,
      category: formData.category,
      amount: parsedAmount,
      type: formData.type,
      createdAt: new Date().toISOString(),
    }

    setTransactions((previousTransactions) => [newTransaction, ...previousTransactions])
    closeModal()
  }

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="m-0 text-3xl font-semibold text-gray-900">Transactions</h1>
            <p className="mt-1 text-sm text-gray-600">
              Add and manage your credits and debits with quick filters and search.
            </p>
          </div>

          <Button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="h-10 gap-2 rounded-lg bg-violet-600 px-4 text-white hover:bg-violet-700"
          >
            <Plus size={16} />
            Add Transaction
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
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
              placeholder="Search by transaction name or amount"
              className="h-10 w-full rounded-lg border border-gray-300 pl-9 pr-3 text-sm text-gray-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
            className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm text-gray-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          >
            <option value="all">All Categories</option>
            {uniqueCategories.map((category) => (
              <option key={category} value={category}>
                {category}
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

        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500">
                <th className="px-3 py-3 font-semibold">Transaction</th>
                <th className="px-3 py-3 font-semibold">Category</th>
                <th className="px-3 py-3 font-semibold">Type</th>
                <th className="px-3 py-3 font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-gray-100 text-gray-800">
                    <td className="px-3 py-3 font-medium">{transaction.name}</td>
                    <td className="px-3 py-3">{transaction.category}</td>
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
                      ₹{transaction.amount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-3 py-8 text-center text-sm text-gray-500">
                    No transactions found for current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="m-0 text-xl font-semibold text-gray-900">Add Transaction</h2>
            <p className="mt-1 text-sm text-gray-500">
              Fill transaction name, category, amount, and type.
            </p>

            <form onSubmit={handleAddTransaction} className="mt-5 space-y-4">
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
                    value={formData.category}
                    onChange={(event) =>
                      setFormData((previous) => ({ ...previous, category: event.target.value }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                  >
                    {uniqueCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
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
                    min="0"
                    step="0.01"
                    value={formData.amount}
                    onChange={(event) =>
                      setFormData((previous) => ({ ...previous, amount: event.target.value }))
                    }
                    placeholder="0.00"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
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
                      }`}
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
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-violet-600 text-white hover:bg-violet-700"
                  disabled={!formData.name.trim() || !formData.amount || Number(formData.amount) <= 0}
                >
                  Save Transaction
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  )
}

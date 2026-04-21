import { useEffect, useMemo, useState } from 'react'
import { AlertCircle, ChartSpline, CircleDollarSign, CreditCard, ListTree, Wallet } from 'lucide-react'
import { getDashboardSummary } from '../api/dashboardApi'

const defaultSummary = {
  totalCategories: 0,
  monthlyDebit: 0,
  monthlyCredit: 0,
  last24HoursDebit: 0,
  last24HoursCredit: 0,
}

const getErrorMessage = (error, fallbackMessage) => {
  const message = error?.response?.data?.message
  return typeof message === 'string' && message.trim() ? message : fallbackMessage
}

const formatCurrency = (value) => {
  return `₹${Number(value ?? 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export default function Home() {
  const [summary, setSummary] = useState(defaultSummary)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadSummary = async () => {
      setIsLoading(true)
      setError('')

      try {
        const data = await getDashboardSummary()
        setSummary({
          totalCategories: Number(data?.totalCategories ?? 0),
          monthlyDebit: Number(data?.monthlyDebit ?? 0),
          monthlyCredit: Number(data?.monthlyCredit ?? 0),
          last24HoursDebit: Number(data?.last24HoursDebit ?? 0),
          last24HoursCredit: Number(data?.last24HoursCredit ?? 0),
        })
      } catch (apiError) {
        setError(getErrorMessage(apiError, 'Unable to load dashboard summary right now.'))
      } finally {
        setIsLoading(false)
      }
    }

    loadSummary()
  }, [])

  const cards = useMemo(
    () => [
      {
        key: 'totalCategories',
        label: 'Total Categories',
        value: summary.totalCategories.toLocaleString('en-IN'),
        icon: ListTree,
        accent: 'text-indigo-700 bg-indigo-100',
      },
      {
        key: 'monthlyDebit',
        label: 'This Month Debit',
        value: formatCurrency(summary.monthlyDebit),
        icon: Wallet,
        accent: 'text-rose-700 bg-rose-100',
      },
      {
        key: 'monthlyCredit',
        label: 'This Month Credit',
        value: formatCurrency(summary.monthlyCredit),
        icon: CreditCard,
        accent: 'text-emerald-700 bg-emerald-100',
      },
      {
        key: 'last24HoursDebit',
        label: 'Last 24h Debit',
        value: formatCurrency(summary.last24HoursDebit),
        icon: ChartSpline,
        accent: 'text-rose-700 bg-rose-100',
      },
      {
        key: 'last24HoursCredit',
        label: 'Last 24h Credit',
        value: formatCurrency(summary.last24HoursCredit),
        icon: CircleDollarSign,
        accent: 'text-emerald-700 bg-emerald-100',
      },
    ],
    [summary]
  )

  return (
    <section className="space-y-6 text-left">
      <div className="overflow-hidden rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 p-4 shadow-sm sm:p-6">
        <p className="m-0 text-xs font-semibold uppercase tracking-[0.2em] text-violet-600">Overview</p>
        <h1 className="m-0 mt-2 text-2xl font-semibold text-gray-900 sm:text-3xl">Financial Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          A consolidated snapshot of your category scale and incoming versus outgoing flows.
        </p>
      </div>

      {error ? (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon

          return (
            <article
              key={card.key}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="m-0 text-xs font-semibold uppercase tracking-wide text-gray-500">{card.label}</p>
                  <p className="m-0 mt-2 text-2xl font-bold text-gray-900">
                    {isLoading ? '—' : card.value}
                  </p>
                </div>
                <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${card.accent}`}>
                  <Icon size={18} />
                </span>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

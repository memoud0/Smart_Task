'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import FilterableTaskTable from './FilterableTaskTable'

export default function CalendarPage() {
  const { data: session, status } = useSession()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTasks = async () => {
      if (status === 'authenticated') {
        try {
          const response = await fetch('/api/tasks')
          if (!response.ok) throw new Error('Failed to fetch tasks')
          const data = await response.json()
          setTasks(data)
        } catch (err) {
          setError(err.message)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchTasks()
  }, [status])

  if (status === 'loading' || loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <p className="text-lg">Loading...</p>
    </div>
  }

  if (status === 'unauthenticated') {
    return <div className="flex justify-center items-center min-h-screen">
      <p className="text-lg">Please sign in to view your tasks</p>
    </div>
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen">
      <p className="text-lg text-red-500">Error: {error}</p>
    </div>
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Calendar Tasks</h1>
      <FilterableTaskTable initialTasks={tasks} />
    </div>
  )
}
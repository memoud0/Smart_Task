'use client'

import { useEffect, useState } from 'react'
import { useSession, signIn } from 'next-auth/react'
import FilterableTaskTable from './FilterableTaskTable'

export default function CalendarPage() {
  const { data: session, status } = useSession()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTasks = async () => {
      if (status === 'authenticated' && session) {
        try {
          const response = await fetch('/api/tasks', {
            headers: {
              'Authorization': `Bearer ${session.accessToken}`
            }
          })
          if (response.status === 401) {
            signIn('google') // Redirect to sign in if unauthorized
            return
          }
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

    if (status === 'authenticated') {
      fetchTasks()
    }
  }, [status, session])

  if (status === 'loading' || loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <p className="text-lg">Loading...</p>
    </div>
  }

  if (status === 'unauthenticated') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <button
          onClick={() => signIn('google')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Sign in with Google
        </button>
      </div>
    )
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
'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, RefreshCw } from 'lucide-react'
import RepoForm from '@/components/repo-form'
import RepoList from '@/components/repo-list'
import WorkflowPanel from '@/components/workflow-panel'

interface Repo {
  id: number
  owner: string
  name: string
  created_at: string
}

export default function Home() {
  const [repos, setRepos] = useState<Repo[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRepo, setSelectedRepo] = useState<Repo | null>(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchRepos()
  }, [])

  async function fetchRepos() {
    try {
      const res = await fetch('/api/repos')
      const data = await res.json()
      setRepos(data)
    } catch (error) {
      console.error('Failed to fetch repos:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteRepo(id: number) {
    if (confirm('Delete this repo?')) {
      try {
        await fetch(`/api/repos/${id}`, { method: 'DELETE' })
        setRepos(repos.filter((r) => r.id !== id))
        if (selectedRepo?.id === id) {
          setSelectedRepo(null)
        }
      } catch (error) {
        alert('Failed to delete repo')
      }
    }
  }

  async function handleAddRepo(owner: string, name: string, token: string) {
    try {
      const res = await fetch('/api/repos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ owner, name, github_token: token }),
      })

      if (res.ok) {
        await fetchRepos()
        setShowForm(false)
      } else {
        alert('Failed to add repo')
      }
    } catch (error) {
      alert('Error adding repo')
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-80 border-r border-border bg-card p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">GitHub Actions</h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
              title="Add repo"
            >
              <Plus size={20} />
            </button>
          </div>

          {showForm && (
            <div className="mb-6 pb-6 border-b border-border">
              <RepoForm onSubmit={handleAddRepo} onCancel={() => setShowForm(false)} />
            </div>
          )}

          {loading ? (
            <div className="text-sm text-muted-foreground">Loading...</div>
          ) : repos.length === 0 ? (
            <div className="text-sm text-muted-foreground">No repos added yet</div>
          ) : (
            <RepoList
              repos={repos}
              selectedRepo={selectedRepo}
              onSelectRepo={setSelectedRepo}
              onDeleteRepo={handleDeleteRepo}
            />
          )}
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-hidden">
          {selectedRepo ? (
            <WorkflowPanel repo={selectedRepo} />
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <p className="text-lg mb-2">Select a repo to view workflows</p>
                <p className="text-sm">or add a new one using the + button</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

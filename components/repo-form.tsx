'use client'

import { useState } from 'react'

interface RepoFormProps {
  onSubmit: (owner: string, name: string, token: string) => void
  onCancel: () => void
}

export default function RepoForm({ onSubmit, onCancel }: RepoFormProps) {
  const [owner, setOwner] = useState('')
  const [name, setName] = useState('')
  const [token, setToken] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!owner || !name || !token) {
      alert('All fields required')
      return
    }
    setSubmitting(true)
    await onSubmit(owner, name, token)
    setSubmitting(false)
    setOwner('')
    setName('')
    setToken('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-sm font-medium mb-1">Owner</label>
        <input
          type="text"
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
          placeholder="your-username"
          className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={submitting}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Repository</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="repo-name"
          className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={submitting}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">GitHub Token</label>
        <input
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="ghp_..."
          className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={submitting}
        />
      </div>
      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 px-3 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {submitting ? 'Adding...' : 'Add Repo'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="flex-1 px-3 py-2 border border-border rounded-lg font-medium text-sm hover:bg-secondary transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

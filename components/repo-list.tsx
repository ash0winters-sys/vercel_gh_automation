'use client'

import { Trash2 } from 'lucide-react'

interface Repo {
  id: number
  owner: string
  name: string
}

interface RepoListProps {
  repos: Repo[]
  selectedRepo: Repo | null
  onSelectRepo: (repo: Repo) => void
  onDeleteRepo: (id: number) => void
}

export default function RepoList({
  repos,
  selectedRepo,
  onSelectRepo,
  onDeleteRepo,
}: RepoListProps) {
  return (
    <div className="space-y-2 flex-1 overflow-y-auto">
      {repos.map((repo) => (
        <div
          key={repo.id}
          className={`p-3 rounded-lg cursor-pointer transition-colors flex items-center justify-between group ${
            selectedRepo?.id === repo.id
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-secondary'
          }`}
          onClick={() => onSelectRepo(repo)}
        >
          <div className="min-w-0">
            <p className="font-medium text-sm truncate">
              {repo.owner}/{repo.name}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDeleteRepo(repo.id)
            }}
            className="p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:bg-opacity-20 rounded"
            title="Delete repo"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
    </div>
  )
}

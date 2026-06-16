'use client'

import { useState, useEffect } from 'react'
import { RefreshCw, Play } from 'lucide-react'
import WorkflowList from './workflow-list'
import RunsList from './runs-list'

interface Repo {
  id: number
  owner: string
  name: string
}

interface Workflow {
  id: number
  name: string
  path: string
  state: string
}

interface WorkflowPanelProps {
  repo: Repo
}

export default function WorkflowPanel({ repo }: WorkflowPanelProps) {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWorkflows()
  }, [repo.id])

  async function fetchWorkflows() {
    try {
      setLoading(true)
      const res = await fetch(`/api/github/workflows?repoId=${repo.id}`)
      const data = await res.json()
      if (data.workflows) {
        setWorkflows(data.workflows)
        setSelectedWorkflow(data.workflows[0] || null)
      }
    } catch (error) {
      console.error('Failed to fetch workflows:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-full">
      {/* Workflows sidebar */}
      <div className="w-64 border-r border-border bg-card p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Workflows</h2>
          <button
            onClick={fetchWorkflows}
            disabled={loading}
            className="p-2 hover:bg-secondary rounded-lg transition-colors disabled:opacity-50"
            title="Refresh workflows"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {loading ? (
          <div className="text-sm text-muted-foreground">Loading...</div>
        ) : workflows.length === 0 ? (
          <div className="text-sm text-muted-foreground">No workflows found</div>
        ) : (
          <WorkflowList
            workflows={workflows}
            selectedWorkflow={selectedWorkflow}
            onSelectWorkflow={setSelectedWorkflow}
          />
        )}
      </div>

      {/* Runs and logs */}
      <div className="flex-1 overflow-hidden">
        {selectedWorkflow ? (
          <RunsList repo={repo} workflow={selectedWorkflow} />
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            No workflow selected
          </div>
        )}
      </div>
    </div>
  )
}

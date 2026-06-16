'use client'

import { useState, useEffect } from 'react'
import { RefreshCw, Play, Square, FileText } from 'lucide-react'

interface Repo {
  id: number
  owner: string
  name: string
}

interface Workflow {
  id: number
  name: string
}

interface WorkflowRun {
  id: number
  name: string
  status: string
  conclusion: string | null
  created_at: string
  updated_at: string
}

interface RunsListProps {
  repo: Repo
  workflow: Workflow
}

export default function RunsList({ repo, workflow }: RunsListProps) {
  const [runs, setRuns] = useState<WorkflowRun[]>([])
  const [selectedRun, setSelectedRun] = useState<WorkflowRun | null>(null)
  const [loading, setLoading] = useState(true)
  const [logs, setLogs] = useState<string>('')
  const [logsLoading, setLogsLoading] = useState(false)
  const [triggering, setTriggering] = useState(false)

  useEffect(() => {
    fetchRuns()
  }, [workflow.id])

  async function fetchRuns() {
    try {
      setLoading(true)
      const res = await fetch(
        `/api/github/runs?repoId=${repo.id}&workflowId=${workflow.id}`
      )
      const data = await res.json()
      if (data.workflow_runs) {
        setRuns(data.workflow_runs)
        if (data.workflow_runs.length > 0) {
          setSelectedRun(data.workflow_runs[0])
        }
      }
    } catch (error) {
      console.error('Failed to fetch runs:', error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchLogs() {
    if (!selectedRun) return
    try {
      setLogsLoading(true)
      const res = await fetch(
        `/api/github/logs?repoId=${repo.id}&runId=${selectedRun.id}`
      )
      const text = await res.text()
      setLogs(text)
    } catch (error) {
      console.error('Failed to fetch logs:', error)
      setLogs('Failed to load logs')
    } finally {
      setLogsLoading(false)
    }
  }

  async function handleCancelRun() {
    if (!selectedRun || selectedRun.status === 'completed') return
    try {
      await fetch(
        `/api/github/runs/${selectedRun.id}/cancel?repoId=${repo.id}`,
        { method: 'POST' }
      )
      await fetchRuns()
    } catch (error) {
      alert('Failed to cancel run')
    }
  }

  async function handleTriggerWorkflow() {
    try {
      setTriggering(true)
      await fetch(`/api/github/workflows/${workflow.id}/dispatch?repoId=${repo.id}`, {
        method: 'POST',
      })
      await fetchRuns()
    } catch (error) {
      alert('Failed to trigger workflow')
    } finally {
      setTriggering(false)
    }
  }

  return (
    <div className="flex h-full">
      {/* Runs list */}
      <div className="w-80 border-r border-border bg-card p-4 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Runs</h2>
          <div className="flex gap-2">
            <button
              onClick={fetchRuns}
              disabled={loading}
              className="p-2 hover:bg-secondary rounded-lg transition-colors disabled:opacity-50"
              title="Refresh runs"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={handleTriggerWorkflow}
              disabled={triggering}
              className="p-2 hover:bg-secondary rounded-lg transition-colors disabled:opacity-50"
              title="Trigger workflow"
            >
              <Play size={16} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-sm text-muted-foreground">Loading...</div>
        ) : runs.length === 0 ? (
          <div className="text-sm text-muted-foreground">No runs yet</div>
        ) : (
          <div className="space-y-2 flex-1 overflow-y-auto">
            {runs.map((run) => (
              <div
                key={run.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedRun?.id === run.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-secondary'
                }`}
                onClick={() => {
                  setSelectedRun(run)
                  setLogs('')
                }}
              >
                <p className="font-medium text-sm truncate">{run.name}</p>
                <div className="flex items-center justify-between mt-1">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      run.status === 'completed'
                        ? run.conclusion === 'success'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
                    }`}
                  >
                    {run.status === 'completed'
                      ? run.conclusion
                      : run.status}
                  </span>
                  <span className="text-xs opacity-75">
                    {new Date(run.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Logs */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedRun ? (
          <>
            <div className="border-b border-border p-4 flex items-center justify-between bg-card">
              <div>
                <h3 className="font-semibold">{selectedRun.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(selectedRun.created_at).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={fetchLogs}
                  disabled={logsLoading}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors disabled:opacity-50"
                  title="Load logs"
                >
                  <FileText size={16} />
                </button>
                {selectedRun.status !== 'completed' && (
                  <button
                    onClick={handleCancelRun}
                    className="p-2 hover:bg-destructive hover:bg-opacity-20 rounded-lg transition-colors text-destructive"
                    title="Cancel run"
                  >
                    <Square size={16} />
                  </button>
                )}
              </div>
            </div>
            <div className="flex-1 overflow-auto bg-background p-4">
              {logs ? (
                <pre className="text-xs font-mono whitespace-pre-wrap break-words text-foreground">
                  {logs}
                </pre>
              ) : logsLoading ? (
                <div className="text-sm text-muted-foreground">Loading logs...</div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  Click the file icon to load logs
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Select a run to view logs
          </div>
        )}
      </div>
    </div>
  )
}

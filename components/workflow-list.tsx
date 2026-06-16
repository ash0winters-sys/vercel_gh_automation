'use client'

import { Play } from 'lucide-react'

interface Workflow {
  id: number
  name: string
  path: string
}

interface WorkflowListProps {
  workflows: Workflow[]
  selectedWorkflow: Workflow | null
  onSelectWorkflow: (workflow: Workflow) => void
}

export default function WorkflowList({
  workflows,
  selectedWorkflow,
  onSelectWorkflow,
}: WorkflowListProps) {
  return (
    <div className="space-y-2">
      {workflows.map((workflow) => (
        <div
          key={workflow.id}
          className={`p-3 rounded-lg cursor-pointer transition-colors ${
            selectedWorkflow?.id === workflow.id
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-secondary'
          }`}
          onClick={() => onSelectWorkflow(workflow)}
        >
          <p className="font-medium text-sm">{workflow.name}</p>
          <p className="text-xs opacity-75">{workflow.path}</p>
        </div>
      ))}
    </div>
  )
}

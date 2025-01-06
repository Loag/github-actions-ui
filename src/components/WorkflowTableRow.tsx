'use client'

import { TableCell, TableRow } from "@/components/ui/table"

interface WorkflowTableRowProps {
  repoName: string
  workflowName: string
  conclusion: string | null | undefined
  status: string | null | undefined
  startedAt: string | null | undefined
  duration: number | null | undefined
  url: string | null | undefined
  actor: string | null | undefined
  trigger: string | null | undefined
}

export function WorkflowTableRow({
  repoName,
  workflowName,
  conclusion,
  actor,
  trigger,
  status,
  startedAt,
  duration,
  url
}: WorkflowTableRowProps) {
  return (
    <TableRow 
      className="cursor-pointer hover:bg-muted/50"
      onClick={() => window.open(url ?? '', '_blank')}
    >
      <TableCell>{repoName}</TableCell>
      <TableCell>{workflowName}</TableCell>
      <TableCell>{actor}</TableCell>
      <TableCell>{trigger}</TableCell>
      <TableCell>{conclusion}</TableCell>
      <TableCell>{status}</TableCell>
      <TableCell>{formatDate(startedAt)}</TableCell>
      <TableCell>{formatDuration(duration)}</TableCell> 
    </TableRow>
  )
}

function formatDate(date: string | null | undefined) {
  if (date === null || date === undefined) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function formatDuration(milliseconds: number | null | undefined) {
  if (milliseconds === null || milliseconds === undefined) return 'N/A';
  const seconds = milliseconds / 1000;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return `${hours}h ${minutes}m ${remainingSeconds}s`;
} 
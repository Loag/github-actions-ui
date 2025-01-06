import { CheckCircle2, XCircle, Play, Pause, Clock } from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";

interface WorkflowCardProps {
  repoName: string;
  workflowName: string;
  actor: string | null | undefined;
  trigger: string | null | undefined;
  conclusion: string | null | undefined;
  status: string | null | undefined;
  startedAt: string | null | undefined;
  duration: number;
  url: string | null | undefined;
}

export function WorkflowCard({
  repoName,
  workflowName,
  actor,
  trigger,
  conclusion,
  status,
  startedAt,
  duration,
  url,
}: WorkflowCardProps) {
  return (
    <Link href={url || '#'} target="_blank">
      <Card className="w-full hover:bg-accent transition-colors">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">
                {repoName} - {workflowName}
              </h3>
              <p className="text-sm text-muted-foreground">
                Triggered by {actor} via {trigger}
              </p>
            </div>
            <div>
              {conclusion === "success" ? (
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              ) : conclusion === "failure" ? (
                <XCircle className="h-6 w-6 text-red-500" />
              ) : null}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              {status === "in_progress" ? (
                <Play className="h-4 w-4 text-blue-500" />
              ) : status === "queued" ? (
                <Pause className="h-4 w-4 text-yellow-500" />
              ) : null}
              <span className="text-sm capitalize">{status}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>
              {new Date(startedAt || "").toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <div>Duration: {Math.round(duration / 1000)}s</div>
        </CardFooter>
      </Card>
    </Link>
  );
} 
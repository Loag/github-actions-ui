import { CheckCircle2, XCircle, Play, Pause, Clock, CheckCircle, AlertCircle, MinusCircle, Lock, Globe } from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";

interface WorkflowCardProps {
  repoName: string;
  repoDescription: string | null | undefined;
  repoVisibility: string | undefined;
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
  repoDescription,
  repoVisibility,
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
      <Card className={`w-full hover:bg-accent transition-colors ${status === 'in_progress' ? 'border-blue-500' : ''}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <div className="flex flex-col md:flex-row md:items-center md:gap-2">
                <h3 className="text-2xl font-semibold flex items-center gap-2">
                  {repoVisibility === 'private' ? (
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Globe className="h-4 w-4 text-muted-foreground" />
                  )}
                  {repoName}
                </h3>
                {repoDescription && (
                  <>
                    <span className="hidden md:inline text-muted-foreground">-</span>
                    <p className="text-sm md:text-base text-muted-foreground line-clamp-2 md:line-clamp-1">
                      {repoDescription}
                    </p>
                  </>
                )}
              </div>
              <h4 className="text-base text-muted-foreground">
                {workflowName}
              </h4>
              <p className="text-sm text-muted-foreground">
                Triggered by {actor} via {cleanDisplayString(trigger)}
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
              {getStatusIcon(status)}
              <span className="text-base capitalize">{cleanDisplayString(status)}</span>
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
              {" "}
              ({(() => {
                const now = new Date();
                const start = new Date(startedAt || "");
                const diff = now.getTime() - start.getTime();
                const seconds = Math.floor(diff / 1000);
                const minutes = Math.floor(seconds / 60);
                const hours = Math.floor(minutes / 60);
                const days = Math.floor(hours / 24);
                const months = Math.floor(days / 30);
                const years = Math.floor(days / 365);

                if (years > 0) return `${years} ${years === 1 ? 'year' : 'years'} ago`;
                if (months > 0) return `${months} ${months === 1 ? 'month' : 'months'} ago`;
                if (days > 0) return `${days} ${days === 1 ? 'day' : 'days'} ago`;
                if (hours > 0) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
                if (minutes > 0) return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
                return `${seconds} ${seconds === 1 ? 'second' : 'seconds'} ago`;
              })()})
            </span>
          </div>
          <div className="text-sm">Duration: {(() => {
            const seconds = Math.round(duration / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);
            
            const remainingHours = hours % 24;
            const remainingMinutes = minutes % 60;
            const remainingSeconds = seconds % 60;

            const parts = [];
            if (days > 0) parts.push(`${days}d`);
            if (remainingHours > 0) parts.push(`${remainingHours}h`);
            if (remainingMinutes > 0) parts.push(`${remainingMinutes}m`);
            if (remainingSeconds > 0) parts.push(`${remainingSeconds}s`);
            
            return parts.join(' ') || '0s';
          })()}</div>
        </CardFooter>
      </Card>
    </Link>
  );
} 

const getStatusIcon = (status: string | null | undefined) => {
  switch (status) {
    case 'success':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'completed':
      return <MinusCircle className="h-4 w-4 text-gray-400" />;
    case 'action_required':
    case 'waiting':
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    case 'cancelled':
      return <XCircle className="h-4 w-4 text-gray-500" />;
    case 'failure':
    case 'timed_out':
      return <XCircle className="h-4 w-4 text-red-500" />;
    case 'neutral':
    case 'skipped':
    case 'stale':
      return <MinusCircle className="h-4 w-4 text-gray-400" />;
    case 'in_progress':
      return <Play className="h-4 w-4 text-blue-500" />;
    case 'queued':
    case 'requested':
    case 'pending':
      return <Pause className="h-4 w-4 text-yellow-500" />;
    default:
      return null;
  }
};


const cleanDisplayString = (status: string | null | undefined) => {
  return status?.replace(/_/g, ' ');
}
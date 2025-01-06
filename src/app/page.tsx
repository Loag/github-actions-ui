import { GitHubService } from "@/services";
import Image from "next/image";
import { WorkflowCard } from "@/components/WorkflowCard";

export default async function Home() {

  const githubService = new GitHubService(process.env.GITHUB_TOKEN!)

  const user = await githubService.getUser();

  const repositories = (await githubService.getAllRepositoriesWithWorkflows());

  return (
    <div className="items-center justify-items-center min-h-screen gap-8 sm:p-8 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full">
        <div className="flex w-full justify-between items-center gap-4">
          <div className="flex flex-row justify-between items-center w-full">
            <h1 className="text-3xl font-semibold tracking-tight">Last action runs</h1>
            <div className="flex items-center gap-4">
            <div className="flex flex-col">
                <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                  {user.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {user.login}
                </p>
              </div>
              <Image 
                src={user.avatar_url || ''} 
                alt={`${user.name}'s avatar`}
                className="w-12 h-12 rounded-full"
                width={48}
                height={48}
                unoptimized
              />
            </div>
          </div>
        </div>
        
        <div className="flex flex-col gap-4 w-full">
          {repositories.map((item) =>
            item.workflows.map((workflow, index) => (
              <WorkflowCard
                key={index}
                repoName={item.repoName}
                actor={workflow.lastRun?.actor}
                trigger={workflow.lastRun?.trigger}
                workflowName={workflow.workflowName}
                conclusion={workflow.lastRun?.conclusion}
                status={workflow.lastRun?.status}
                startedAt={workflow.lastRun?.startedAt}
                duration={workflow.lastRun?.duration ?? 0}
                url={workflow.lastRun?.url}
              />
            ))
          )}
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
      </footer>
    </div>
  );
}
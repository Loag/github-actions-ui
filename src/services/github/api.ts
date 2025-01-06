import { Octokit } from "@octokit/rest";

interface WorkflowWithLastRun {
  workflowName: string;
  workflowId: number;
  lastRun: {
    runId: number;
    runNumber: number;
    status: string | null;
    conclusion: string | null;
    startedAt: string | null;
    duration: number | null;
    url: string | null;
    actor: string | null;
    trigger: string | null;
  } | null;
}

interface RepositoryWorkflows {
  repoName: string;
  repoId: number;
  workflows: WorkflowWithLastRun[];
}

interface User {
  login: string;
  id: number;
  avatar_url: string;
  name: string | null;
}

export class GitHubService {
  private octokit: Octokit;

  constructor(authToken: string) {
    this.octokit = new Octokit({ auth: authToken });
  }

  async getUser(): Promise<User> {
    const response = await this.octokit.users.getAuthenticated();
    return response.data;
  }

  async getAllRepositoriesWithWorkflows(): Promise<RepositoryWorkflows[]> {
    // Get all repositories for authenticated user
    const repos = await this.octokit.repos.listForAuthenticatedUser({
      per_page: 100,
      sort: 'updated'
    });

    const reposWithWorkflows = await Promise.all(
      repos.data.map(async (repo): Promise<RepositoryWorkflows> => {
        const workflows = await this.getWorkflowsWithLastRun(repo.owner.login, repo.name);
        
        return {
          repoName: repo.name,
          repoId: repo.id,
          workflows
        };
      })
    );

    // Filter out workflows with no start date and sort by start time
    return reposWithWorkflows
      .flatMap(repo => 
        repo.workflows
          .filter(workflow => workflow.lastRun?.startedAt !== undefined)
          .map(workflow => ({
            repoName: repo.repoName,
            repoId: repo.repoId,
            workflow
          }))
      )
      .sort((a, b) => {
        const aTime = new Date(a.workflow.lastRun!.startedAt!).getTime();
        const bTime = new Date(b.workflow.lastRun!.startedAt!).getTime();
        return bTime - aTime; // Sort descending (newest first)
      })
      .map(({repoName, repoId, workflow}) => ({
        repoName,
        repoId,
        workflows: [workflow]
      }));

    // return reposWithWorkflows.filter(repo => repo.workflows.length > 0);
  }

  private async getWorkflowsWithLastRun(
    owner: string, 
    repo: string
  ): Promise<WorkflowWithLastRun[]> {
    try {
      // Get all workflows for the repository
      const workflows = await this.octokit.actions.listRepoWorkflows({
        owner,
        repo,
        per_page: 100
      });

      // Get last run for each workflow
      const workflowsWithRuns = await Promise.all(
        workflows.data.workflows.map(async (workflow): Promise<WorkflowWithLastRun> => {
          const runs = await this.octokit.actions.listWorkflowRuns({
            owner,
            repo,
            workflow_id: workflow.id,
            per_page: 1
          });

          const lastRun = runs.data.total_count > 0 ? runs.data.workflow_runs[0] : null;
        
          return {
            workflowName: workflow.name,
            workflowId: workflow.id,
            lastRun: lastRun ? {
              runId: lastRun.id,
              runNumber: lastRun.run_number,
              status: lastRun.status,
              conclusion: lastRun.conclusion,
              startedAt: lastRun.run_started_at ?? null,
              duration: lastRun.updated_at && lastRun.run_started_at ? 
                new Date(lastRun.updated_at).getTime() - new Date(lastRun.run_started_at).getTime() 
                : null,
              url: lastRun.html_url ?? null,
              actor: lastRun.actor?.login ?? null,
              trigger: lastRun.event ?? null
            } : null
          };
        })
      );

      return workflowsWithRuns;
    } catch (error) {
      console.error(`Error fetching workflows for ${owner}/${repo}:`, error);
      return [];
    }
  }
}

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
}

export interface GitHubError {
  message: string;
  documentation_url?: string;
}

export interface RepoWorkflows {
  total_count: number;
  workflows: GitHubWorkflow[];
}

export interface GitHubWorkflow {
  id: number;
  name: string;
  path: string;
  state: string;
  created_at: string;
  updated_at: string;
  url: string;
  html_url: string;
  badge_url: string;
}

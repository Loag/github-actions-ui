import { githubConfig, GITHUB_API_BASE_URL } from './config'
import type { GitHubRepository, GitHubError, GitHubWorkflow, RepoWorkflows } from './types'

export class GitHubService {
    
  static async getRepository(owner: string, repo: string): Promise<GitHubRepository> {
    try {
      const response = await fetch(
        `${GITHUB_API_BASE_URL}/repos/${owner}/${repo}`,
        {
          headers: githubConfig.headers,
        }
      )

      if (!response.ok) {
        const error = await response.json() as GitHubError
        throw new Error(error.message)
      }

      return response.json() as Promise<GitHubRepository>
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch repository')
    }
  }

  static async getAuthenticatedUser() {
    try {
      const response = await fetch(`${GITHUB_API_BASE_URL}/user`, {
        headers: githubConfig.headers,
      })

      if (!response.ok) {
        const error = await response.json() as GitHubError
        throw new Error(error.message)
      }

      return response.json()
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch authenticated user')
    }
  }

  
  static async getRepositoryWorkflows(owner: string, repo: string): Promise<GitHubWorkflow[]> {
    try {
      const response = await fetch(
        `${GITHUB_API_BASE_URL}/repos/${owner}/${repo}/actions/workflows`,
        {
          headers: githubConfig.headers,
        }
      )

      if (response.ok) {
        return await response.json()
      }
      return response.json()
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch repository workflows')
    }
  }

  static async getUserRepositoriesWorkflows(): Promise<RepoWorkflows[]> {
    try {
      const user = await this.getAuthenticatedUser()
      const repos = await fetch(
        `${GITHUB_API_BASE_URL}/user/repos`,
        {
          headers: githubConfig.headers,
        }
      ).then(res => res.json())

      const workflowsPromises = repos.map((repo: GitHubRepository) => 
        this.getRepositoryWorkflows(user.login, repo.name)
      )
      return Promise.all(workflowsPromises)
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch workflows for user repositories')
    }
  }
}

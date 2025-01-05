export const GITHUB_API_BASE_URL = 'https://api.github.com'
export const GITHUB_API_VERSION = '2022-11-28'

export const githubConfig = {
  headers: {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': GITHUB_API_VERSION,
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
  }
}

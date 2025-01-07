# github-actions-ui

self-hosted github actions ui for your latest github actions runs

## Usage

Create a github personal access token with the `repo`, `user`, and `workflow` scopes

``` bash
docker run -d --name github-actions-ui -e GITHUB_TOKEN=<your-token> -p 3000:3000 ghcr.io/loag/github-actions-ui:latest
```


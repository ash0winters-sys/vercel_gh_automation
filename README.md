# GitHub Actions Controller

A web app to control and monitor your GitHub Actions without leaving your browser. Run, cancel, and view logs for workflows across your repositories.

## Features

- **Add Multiple Repos**: Manage workflows from different GitHub repositories and accounts
- **View Workflows**: List all workflows for each repo
- **See Runs**: View workflow runs with their status (success, failure, in progress)
- **View Logs**: Stream action logs directly in the app
- **Control Runs**: Cancel running workflows or trigger new ones
- **Secure Token Storage**: Tokens are encrypted in the database

## Setup

### 1. Environment Variables

Create a `.env.local` file in the root directory:

```env
DATABASE_URL=your-neon-database-url
ENCRYPTION_KEY=your-secret-encryption-key-min-32-chars
```

Generate a secure encryption key:
```bash
openssl rand -base64 32
```

### 2. Database Setup

The database schema is created automatically. You need a Neon PostgreSQL database with the following table:

```sql
CREATE TABLE repos (
  id SERIAL PRIMARY KEY,
  owner TEXT NOT NULL,
  name TEXT NOT NULL,
  github_token_encrypted TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 3. GitHub Token

You'll need a GitHub personal access token with the following permissions:
- `repo` (full control of private repositories)
- `workflow` (read/write access to workflows)
- `actions` (full control of actions)

Create a token at: https://github.com/settings/tokens/new

## Running

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000

## Usage

1. Click the **+** button to add a repository
2. Enter the GitHub owner, repository name, and your personal access token
3. Select a repo from the sidebar to view its workflows
4. Click a workflow to see its runs
5. Click a run to view its logs
6. Use the **play icon** to trigger a workflow
7. Use the **stop icon** to cancel a running workflow
8. Use the **trash icon** to delete a repo

## Architecture

- **Frontend**: Next.js App Router with client components
- **Backend**: Next.js API routes
- **Database**: Neon PostgreSQL with Drizzle ORM
- **Security**: AES encryption for GitHub tokens

## API Routes

- `GET/POST /api/repos` - Manage repositories
- `DELETE /api/repos/[id]` - Delete repository
- `GET /api/github/workflows` - List workflows for a repo
- `GET /api/github/runs` - List runs for a workflow
- `GET /api/github/logs` - Get logs for a run
- `POST /api/github/runs/[id]/cancel` - Cancel a run
- `POST /api/github/workflows/[id]/dispatch` - Trigger a workflow

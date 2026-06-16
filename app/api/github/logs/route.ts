import { db } from '@/lib/db'
import { repos } from '@/lib/schema'
import { decryptToken } from '@/lib/encryption'
import { eq } from 'drizzle-orm'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const repoId = searchParams.get('repoId')
    const runId = searchParams.get('runId')

    if (!repoId || !runId) {
      return Response.json(
        { error: 'Missing repoId or runId' },
        { status: 400 }
      )
    }

    const repo = await db
      .select()
      .from(repos)
      .where(eq(repos.id, parseInt(repoId)))

    if (!repo.length) {
      return Response.json({ error: 'Repo not found' }, { status: 404 })
    }

    const token = decryptToken(repo[0].github_token_encrypted)
    const owner = repo[0].owner
    const name = repo[0].name

    const response = await fetch(
      `https://api.github.com/repos/${owner}/${name}/actions/runs/${runId}/logs`,
      {
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    )

    if (!response.ok) {
      return Response.json(
        { error: 'Failed to fetch logs from GitHub' },
        { status: response.status }
      )
    }

    return response
  } catch (error) {
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

import { db } from '@/lib/db'
import { repos } from '@/lib/schema'
import { encryptToken, decryptToken } from '@/lib/encryption'
import { eq } from 'drizzle-orm'

export async function GET() {
  try {
    const allRepos = await db.select().from(repos)
    return Response.json(
      allRepos.map((repo) => ({
        ...repo,
        github_token_encrypted: undefined,
      }))
    )
  } catch (error) {
    return Response.json({ error: 'Failed to fetch repos' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { owner, name, github_token } = await req.json()

    if (!owner || !name || !github_token) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const encrypted = encryptToken(github_token)
    const newRepo = await db
      .insert(repos)
      .values({
        owner,
        name,
        github_token_encrypted: encrypted,
      })
      .returning({ id: repos.id })

    return Response.json(newRepo[0], { status: 201 })
  } catch (error) {
    return Response.json({ error: 'Failed to add repo' }, { status: 500 })
  }
}

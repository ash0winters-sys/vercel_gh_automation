import { db } from '@/lib/db'
import { repos } from '@/lib/schema'
import { eq } from 'drizzle-orm'

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await db.delete(repos).where(eq(repos.id, parseInt(id)))
    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: 'Failed to delete repo' }, { status: 500 })
  }
}

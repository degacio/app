import { supabaseAdmin } from '@/lib/supabaseAdmin'

// ===============================
// 🔧 Helper - Check Supabase Admin
// ===============================
function checkSupabaseAdmin() {
  if (!supabaseAdmin) {
    return new Response(JSON.stringify({
      error: 'Database connection failed',
      message: 'Supabase admin client is not properly configured'
    }), { status: 500 })
  }
  return null
}

// ===============================
// 🔐 Helper - Validate User Token
// ===============================
async function validateUserFromToken(authHeader: string) {
  if (!supabaseAdmin) {
    return { user: null, error: new Error('Supabase admin client not available') }
  }

  const token = authHeader.replace('Bearer ', '')

  const { data: { user }, error } =
    await supabaseAdmin.auth.getUser(token)

  if (error || !user?.id) {
    return { user: null, error }
  }

  return { user, error: null }
}

// ===============================
// 📥 GET - Get Character By ID
// ===============================
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const adminCheck = checkSupabaseAdmin()
    if (adminCheck) return adminCheck

    const id = params.id

    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }

    const { user } = await validateUserFromToken(authHeader)
    if (!user) {
      return new Response(JSON.stringify({ error: 'Authentication failed' }), { status: 401 })
    }

    const { data, error } = await supabaseAdmin
      .from('characters')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (error || !data) {
      return new Response(JSON.stringify({ error: 'Character not found' }), { status: 404 })
    }

    return Response.json(data)

  } catch (error: any) {
    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: error?.message
    }), { status: 500 })
  }
}

// ===============================
// ✏️ PUT - Update Character
// ===============================
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const adminCheck = checkSupabaseAdmin()
    if (adminCheck) return adminCheck

    const id = params.id
    const authHeader = request.headers.get('Authorization')

    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }

    const { user } = await validateUserFromToken(authHeader)
    if (!user) {
      return new Response(JSON.stringify({ error: 'Authentication failed' }), { status: 401 })
    }

    const updates = await request.json()

    const { data, error } = await supabaseAdmin
      .from('characters')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error || !data) {
      return new Response(JSON.stringify({ error: 'Update failed' }), { status: 500 })
    }

    return Response.json(data)

  } catch (error: any) {
    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: error?.message
    }), { status: 500 })
  }
}

// ===============================
// 🗑 DELETE - Remove Character
// ===============================
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const adminCheck = checkSupabaseAdmin()
    if (adminCheck) return adminCheck

    const id = params.id

    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }

    const { user } = await validateUserFromToken(authHeader)
    if (!user) {
      return new Response(JSON.stringify({ error: 'Authentication failed' }), { status: 401 })
    }

    console.log("Deleting ID:", id)

    const { error } = await supabaseAdmin
      .from('characters')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    console.log("Delete error:", error)

    if (error) {
      return new Response(JSON.stringify(error), { status: 500 })
    }

    return Response.json({ success: true })

  } catch (error: any) {
    console.error("DELETE CRASH:", error)

    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error?.message
      }),
      { status: 500 }
    )
  }
}
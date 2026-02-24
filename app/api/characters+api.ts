import { supabaseAdmin, executeWithRecovery } from '@/lib/supabaseAdmin';

// ===============================
// 🔐 Helper - Validate User Token
// ===============================
async function validateUserFromToken(authHeader: string) {
  try {
    if (!supabaseAdmin) {
      throw new Error('Supabase admin client not available');
    }

    const token = authHeader.replace('Bearer ', '');

    const { data: { user }, error } =
      await supabaseAdmin.auth.getUser(token);

    if (error || !user?.id) {
      return { user: null, error };
    }

    return { user, error: null };
  } catch (error) {
    return { user: null, error };
  }
}

// ===============================
// 📥 GET - List Characters
// ===============================
export async function GET(request: Request) {
  try {
    if (!supabaseAdmin) {
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Invalid authorization header' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { user, error: authError } =
      await validateUserFromToken(authHeader);

    if (authError || !user?.id) {
      return new Response(JSON.stringify({
        error: 'Authentication failed'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { data, error } = await supabaseAdmin
      .from('characters')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return new Response(JSON.stringify({
        error: 'Database error',
        message: error.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(data ?? []), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('GET characters error:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: error?.message || 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// ===============================
// 📤 POST - Create Character
// ===============================
export async function POST(request: Request) {
  try {
    if (!supabaseAdmin) {
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Invalid authorization header' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { user, error: authError } =
      await validateUserFromToken(authHeader);

    if (authError || !user?.id) {
      return new Response(JSON.stringify({
        error: 'Authentication failed'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body = await request.json();

    if (!body.name || !body.class_name) {
      return new Response(JSON.stringify({
        error: 'Missing required fields: name and class_name are required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const characterData = {
      user_id: user.id,
      name: body.name,
      class_name: body.class_name,
      level: body.level ?? 1,
      hp_current: body.hp_current ?? 1,
      hp_max: body.hp_max ?? 1,
      spell_slots: body.spell_slots ?? {},
      spells_known: body.spells_known ?? [],
      character_data: body.character_data ?? {},
    };

    console.log('📝 Creating character:', {
      name: characterData.name,
      class: characterData.class_name,
      userId: characterData.user_id
    });

    // 🚀 INSERT DIRETO (SEM RETRY)
   const { error } = await supabaseAdmin
  .from('characters')
  .insert(characterData);

if (error) {
  throw error;
}

// Se chegou aqui, deu certo.
return new Response(JSON.stringify({ success: true }), {
  status: 201,
  headers: { 'Content-Type': 'application/json' }
});

  } catch (error: any) {
    console.error('💥 API error:', error);

    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: error?.message || 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
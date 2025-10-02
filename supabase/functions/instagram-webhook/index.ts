import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const body = await req.json()
    console.log('Received webhook data:', body)

    // Extract data from n8n webhook
    const {
      instagram_username,
      full_name,
      keyword,
      comment,
      response,
      metadata = {}
    } = body

    // Validate required fields
    if (!instagram_username || !full_name || !keyword || !comment || !response) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields',
          required: ['instagram_username', 'full_name', 'keyword', 'comment', 'response']
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Insert data into database
    const { data, error } = await supabase
      .from('instagram_interactions')
      .insert({
        instagram_username,
        full_name,
        keyword,
        comment,
        response,
        metadata
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return new Response(
        JSON.stringify({ error: error.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Successfully saved interaction:', data)

    return new Response(
      JSON.stringify({ 
        success: true, 
        data,
        message: 'Interaction saved successfully' 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('Error processing webhook:', error)
    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

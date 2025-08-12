import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { apiKey, query, variables } = await req.json()

    if (!apiKey) {
      throw new Error('GRID API key is required')
    }

    // GRID GraphQL endpoint
    const response = await fetch('https://api.grid.gg/live-data-feed/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        query,
        variables: variables || {}
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(`GRID API error: ${response.status} - ${data.message || 'Unknown error'}`)
    }

    return new Response(
      JSON.stringify(data),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error calling GRID API:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Failed to call GRID API'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
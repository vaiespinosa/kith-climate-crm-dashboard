import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey, {
  db: {
    schema: 'diego'
  }
})

export type WorkshopLead = {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  company_domain: string | null
  lead_type: 'professional' | 'pivoter' | 'unknown'
  classification_confidence: 'high' | 'medium' | 'low' | null
  linkedin_url: string | null
  linkedin_title: string | null
  linkedin_company: string | null
  linkedin_headline: string | null
  linkedin_industry: string | null
  linkedin_location: string | null
  climate_signals: Record<string, unknown> | null
  created_at: string
  updated_at: string
}

export type WorkshopRegistration = {
  id: string
  lead_id: string
  event_name: string
  event_date: string
  registration_date: string
  attended: boolean
  source_api_id: string | null
  created_at: string
}

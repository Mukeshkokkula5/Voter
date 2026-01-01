import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tgbnnvpkvifmippyftii.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnYm5udnBrdmlmbWlwcHlmdGlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyNzQyMzIsImV4cCI6MjA4Mjg1MDIzMn0.mrW3p1SyAuJC9xiiliHe0vEUqOAn8KBIJzL1b2Lvj4o'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

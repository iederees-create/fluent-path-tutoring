import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jglgzxoennxiqwafmujm.supabase.co'
const supabaseKey = 'sb_publishable_ux7LXt8H3kZRE7pdw1U8Tw_HqPCpOjY'

export const supabase = createClient(supabaseUrl, supabaseKey)

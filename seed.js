import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wmfstfmckopooyleqfsi.supabase.co'
const supabaseKey = 'sb_publishable_zq3PzPO6CoKPCth_iX_yVQ_E4z21T96' // Use service role for seeding if possible, but I don't have it. 
// Wait, I can use the DB URL to seed via SQL! 

import { MOCK_PROPERTIES } from './src/utils/constants.js'

// This won't work easily with node due to imports. 
// I'll just create a SQL SEED file.

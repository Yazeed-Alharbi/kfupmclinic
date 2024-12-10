import { createClient } from '@supabase/supabase-js'; 
const supabaseUrl = 'https://zymxgpzqnwphdnuyhzmn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5bXhncHpxbndwaGRudXloem1uIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMjU2MjEzMiwiZXhwIjoyMDQ4MTM4MTMyfQ.JzL5XYS0mTdk0Bf_J6KTn8AkW2-L2DqFS7hL5q4BStk'; 
const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default supabase


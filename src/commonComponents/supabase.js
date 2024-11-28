import { createClient } from '@supabase/supabase-js'; 
const supabaseUrl = 'https://zymxgpzqnwphdnuyhzmn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5bXhncHpxbndwaGRudXloem1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI1NjIxMzIsImV4cCI6MjA0ODEzODEzMn0.efCMEiXg7e1Zh-Mwa5DmnzaUJ6pcI2E1EaOmozIdjYU'; 
const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default supabase
import { createClient } from '@supabase/supabase-js'; 
const supabaseUrl = 'http://192.168.164.24:8000';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJyb2xlIjogInNlcnZpY2Vfcm9sZSIsCiAgImlzcyI6ICJzdXBhYmFzZSIsCiAgImlhdCI6IDE3MzMwMDA0MDAsCiAgImV4cCI6IDE4OTA3NjY4MDAKfQ.TIvUAyvZFK-PydwZD3ahHDsUFmI0tXOM6TZOPaoDcxc'; 
const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default supabase
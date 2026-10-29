import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const sbUrl = process.env.SUPABASE_API_URL;
const sbKey = process.env.SUPABASE_API_KEY;

const supabase = createClient(sbUrl, sbKey);
 
export default supabase;
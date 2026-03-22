import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;

console.log('URL:', url);
console.log('KEY:', key?.substring(0, 10) + '...');

const supabase = createClient(url, key);

async function test() {
  console.log('Attempting to insert profile...');
  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      email: 'test' + Date.now() + '@example.com',
      name: 'Diagnostic Test',
      profile_type: 'generic'
    })
    .select()
    .single();

  if (error) {
    console.error('ERROR:', error);
  } else {
    console.log('SUCCESS:', data);
  }
}

test();

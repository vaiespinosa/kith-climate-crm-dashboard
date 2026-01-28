const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://zvllsngvdkmnsjydoymq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2bGxzbmd2ZGttbnNqeWRveW1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgyNDM0MjIsImV4cCI6MjA1MzgxOTQyMn0.u4hdlDewfcII7UbkfAu7CukHxNho7yIw-JoSB3S4o34'
);

const csvFiles = [
  '/Users/diego/Desktop/Claude-Projects/kith-climate/Workshop Registrants/Build a Climate Solution - Guests - Dec - 4th.csv',
  '/Users/diego/Desktop/Claude-Projects/kith-climate/Workshop Registrants/Build a Climate Solution - Guests - Dec - 17th.csv',
  '/Users/diego/Desktop/Claude-Projects/kith-climate/Workshop Registrants/Build a Climate Solution - Guests - Jan - 13th.csv'
];

function parseCSV(content) {
  const lines = content.split('\n');
  const headers = lines[0].replace(/^\uFEFF/, '').split(',');
  return lines.slice(1).filter(l => l.trim()).map(line => {
    const values = line.split(',');
    const obj = {};
    headers.forEach((h, i) => obj[h.trim()] = (values[i] || '').trim());
    return obj;
  });
}

function parseName(fullName) {
  if (!fullName) return { first: '', last: '' };
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return { first: parts[0], last: '' };
  return { first: parts[0], last: parts.slice(1).join(' ') };
}

async function main() {
  const toFix = [];

  for (const file of csvFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const rows = parseCSV(content);

    for (const row of rows) {
      const email = row.email?.toLowerCase();
      const name = row.name;
      const hasFirst = row.first_name?.trim();
      const hasLast = row.last_name?.trim();

      // If name exists but first/last are empty, we can parse
      if (email && name && (!hasFirst || !hasLast)) {
        const parsed = parseName(name);
        if (parsed.last) {
          toFix.push({ email, first_name: parsed.first, last_name: parsed.last });
        }
      }
    }
  }

  console.log('Found', toFix.length, 'records to fix from CSV');

  // Update database
  let updated = 0;
  for (const fix of toFix) {
    const { error } = await supabase
      .schema('diego')
      .from('workshop_leads')
      .update({ first_name: fix.first_name, last_name: fix.last_name })
      .eq('email', fix.email)
      .or('last_name.is.null,last_name.eq.');

    if (!error) updated++;
  }

  console.log('Updated', updated, 'records in database');

  // Check remaining
  const { count } = await supabase
    .schema('diego')
    .from('workshop_leads')
    .select('*', { count: 'exact', head: true })
    .is('linkedin_url', null)
    .or('last_name.is.null,last_name.eq.');

  console.log('Remaining leads without last_name:', count);
}

main().catch(console.error);

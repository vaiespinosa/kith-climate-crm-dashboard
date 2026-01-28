const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://zvllsngvdkmnsjydoymq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2bGxzbmd2ZGttbnNqeWRveW1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgyNDM0MjIsImV4cCI6MjA1MzgxOTQyMn0.u4hdlDewfcII7UbkfAu7CukHxNho7yIw-JoSB3S4o34'
);

const climateKeywords = [
  'sustainability', 'sustainable', 'climate', 'environmental', 'environment',
  'carbon', 'net zero', 'renewable', 'esg', 'green', 'clean energy',
  'decarbonization', 'circular economy', 'biodiversity', 'conservation',
  'emissions', 'impact investing', 'social impact', 'green finance'
];

function hasClimateKeyword(text) {
  if (!text) return false;
  const lower = text.toLowerCase();
  return climateKeywords.some(kw => lower.includes(kw));
}

async function main() {
  // 1. Fix misclassified pivoters with climate keywords
  console.log('=== FIXING MISCLASSIFIED PIVOTERS ===');
  const { data: pivoters } = await supabase.schema('diego').from('workshop_leads')
    .select('id, first_name, last_name, linkedin_title, linkedin_company')
    .eq('lead_type', 'pivoter');

  let fixed = 0;
  for (const p of pivoters) {
    const text = [p.linkedin_title, p.linkedin_company].join(' ');
    if (hasClimateKeyword(text)) {
      await supabase.schema('diego').from('workshop_leads')
        .update({ lead_type: 'professional' })
        .eq('id', p.id);
      console.log('  ✓', p.first_name, p.last_name, '→ professional');
      console.log('    Title:', p.linkedin_title);
      fixed++;
    }
  }
  console.log('\nTotal pivoters reclassified:', fixed);

  // 2. Fix records with email in first_name
  console.log('\n=== FIXING EMAIL IN FIRST_NAME ===');
  const { data: badNames } = await supabase.schema('diego').from('workshop_leads')
    .select('id, first_name, last_name, email')
    .like('first_name', '%@%');

  for (const r of badNames) {
    // Extract name from email prefix
    const emailPrefix = r.email.split('@')[0];
    const nameParts = emailPrefix.replace(/[._0-9]/g, ' ').trim().split(/\s+/);
    const firstName = nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1).toLowerCase();

    await supabase.schema('diego').from('workshop_leads')
      .update({ first_name: firstName })
      .eq('id', r.id);
    console.log('  ✓', r.first_name, '→', firstName);
  }
  console.log('\nTotal name fixes:', badNames.length);

  // 3. Get final counts
  console.log('\n=== FINAL LEAD TYPE BREAKDOWN ===');
  const { data: all } = await supabase.schema('diego').from('workshop_leads').select('lead_type');
  const types = {};
  all.forEach(l => { types[l.lead_type] = (types[l.lead_type] || 0) + 1; });
  Object.entries(types).sort((a, b) => b[1] - a[1]).forEach(([t, c]) => {
    console.log(t + ':', c, '(' + Math.round(c / all.length * 100) + '%)');
  });
}

main().catch(console.error);

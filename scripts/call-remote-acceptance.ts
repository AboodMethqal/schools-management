async function run() {
  const url = 'https://schools-management-parent.vercel.app/api/system/final-acceptance';
  console.log('Fetching', url);
  const res = await fetch(url);
  console.log('HTTP Status:', res.status);
  const data = await res.json();
  console.log('Results summary:');
  console.log('Timestamp:', data.timestamp);
  console.log('Summary:', data.summary);
  if (data.results) {
    data.results.forEach((r: any) => {
      console.log(`- [${r.status}] ${r.testName}: ${r.details}`);
    });
  }
}

run().catch(console.error);

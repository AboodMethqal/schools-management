async function callWorkflows() {
  const url = 'https://schools-management-parent.vercel.app/api/system/test-workflows';
  const res = await fetch(url);
  const data = await res.json();
  console.log('Success:', data.success);
  console.log(`Passed: ${data.passedTests} / ${data.totalTests}`);
  data.testLog?.forEach((item: any, i: number) => {
    console.log(`${i + 1}. [${item.result}] ${item.step}`);
    if (item.details) console.log('   Details:', JSON.stringify(item.details));
  });
}

callWorkflows().catch(console.error);

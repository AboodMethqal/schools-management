async function testLogin() {
  const res = await fetch('https://schools-management-parent.vercel.app/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'qa.principal@methqal.tech',
      password: 'Principal@NewPass2026!'
    })
  });
  console.log('Status:', res.status);
  const data = await res.json();
  console.log('Response:', data);
}

testLogin().catch(console.error);

const http = require('http');

async function request(method, path, data, token) {
  return new Promise((resolve, reject) => {
    const dataString = data ? JSON.stringify(data) : '';
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };
    if (token) options.headers['Authorization'] = `Bearer ${token}`;
    if (data) options.headers['Content-Length'] = dataString.length;

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(body || '{}') }));
    });
    req.on('error', e => reject(e));
    if (data) req.write(dataString);
    req.end();
  });
}

async function runTests() {
  try {
    // 1. Register User A
    const emailA = `testA_${Date.now()}@example.com`;
    await request('POST', '/auth/register', { email: emailA, password: 'Password123!', fullName: 'User A' });
    const loginA = await request('POST', '/auth/login', { email: emailA, password: 'Password123!' });
    const tokenA = loginA.data.accessToken;

    // Register User B
    const emailB = `testB_${Date.now()}@example.com`;
    await request('POST', '/auth/register', { email: emailB, password: 'Password123!', fullName: 'User B' });
    const loginB = await request('POST', '/auth/login', { email: emailB, password: 'Password123!' });
    const tokenB = loginB.data.accessToken;

    console.log("Tokens acquired.");

    // 2. Create Goal (User A)
    const goalData = {
      title: "Complete Quran",
      category: "QURAN",
      startDate: new Date().toISOString(),
      targetDate: new Date(Date.now() + 30*24*60*60*1000).toISOString(),
      totalUnits: 604,
      unitLabel: "pages"
    };
    const createRes = await request('POST', '/goals', goalData, tokenA);
    console.log("Create Goal Response:", createRes.status, createRes.data);
    const goalId = createRes.data.id;

    // 3. Get Goals
    const getRes = await request('GET', '/goals', null, tokenA);
    console.log("Get Goals length:", getRes.data.length);

    // 4. Get Active Goal
    const activeRes = await request('GET', '/goals/active', null, tokenA);
    console.log("Active Goal ID:", activeRes.data?.id);

    // 5. Get Goal By Id
    const byIdRes = await request('GET', `/goals/${goalId}`, null, tokenA);
    console.log("Get By ID Title:", byIdRes.data.title);

    // 6. Update Goal
    const patchRes = await request('PATCH', `/goals/${goalId}`, { title: "Read Quran Faster" }, tokenA);
    console.log("Patch Response Title:", patchRes.data.title);

    // 8. Invalid Payload
    const invalidRes = await request('POST', '/goals', { title: "" }, tokenA);
    console.log("Invalid Payload Status:", invalidRes.status);

    // 9. Ownership Protection
    const unauthorizedGet = await request('GET', `/goals/${goalId}`, null, tokenB);
    console.log("User B fetching User A's Goal:", unauthorizedGet.status);

    const unauthorizedPatch = await request('PATCH', `/goals/${goalId}`, { title: "Hacked" }, tokenB);
    console.log("User B patching User A's Goal:", unauthorizedPatch.status);

    const unauthorizedDelete = await request('DELETE', `/goals/${goalId}`, null, tokenB);
    console.log("User B deleting User A's Goal:", unauthorizedDelete.status);

    // 7. Delete Goal
    const deleteRes = await request('DELETE', `/goals/${goalId}`, null, tokenA);
    console.log("Delete Response:", deleteRes.status);

  } catch (error) {
    console.error(error);
  }
}

runTests();

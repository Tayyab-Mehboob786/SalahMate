const axios = require('axios');

async function runTests() {
  const endpoints = [
    { name: 'Surahs', url: '/quran/surahs' },
    { name: 'Page 1', url: '/quran/page/1' },
    { name: 'Page 2', url: '/quran/page/2' },
    { name: 'Page 604', url: '/quran/page/604' },
    { name: 'Juz 1', url: '/quran/juz/1' },
    { name: 'Juz 2', url: '/quran/juz/2' },
    { name: 'Juz 30', url: '/quran/juz/30' },
  ];

  const invalidEndpoints = [
    { name: 'Juz 0', url: '/quran/juz/0' },
    { name: 'Juz 31', url: '/quran/juz/31' },
  ];

  console.log('--- TESTING VALID ENDPOINTS ---');
  for (const ep of endpoints) {
    try {
      const res = await axios.get('http://localhost:3000' + ep.url);
      console.log(`[PASS] ${ep.name} -> HTTP ${res.status}`);
    } catch (e) {
      console.error(`[FAIL] ${ep.name} -> HTTP ${e.response?.status} : ${e.message}`);
    }
  }

  console.log('\n--- TESTING INVALID ENDPOINTS ---');
  for (const ep of invalidEndpoints) {
    try {
      const res = await axios.get('http://localhost:3000' + ep.url);
      console.error(`[FAIL] ${ep.name} -> Expected error but got HTTP ${res.status}`);
    } catch (e) {
      if (e.response?.status === 400) {
        console.log(`[PASS] ${ep.name} -> Correctly rejected with HTTP 400`);
      } else {
        console.error(`[FAIL] ${ep.name} -> HTTP ${e.response?.status} : ${e.message}`);
      }
    }
  }
}

runTests();

const http = require('http');

function testEndpoint(path, label) {
    return new Promise((resolve) => {
        http.get(`http://localhost:5000${path}`, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                console.log(`\n✅ ${label}:`);
                console.log(JSON.stringify(JSON.parse(data), null, 2));
                resolve();
            });
        }).on('error', (err) => {
            console.log(`\n❌ ${label}: Server not running - ${err.message}`);
            resolve();
        });
    });
}

async function runTests() {
    console.log('=== MathVerse Backend Test ===\n');
    await testEndpoint('/api/generate/comparison?level=1&difficulty=adaptive', 'Quantity Comparison');
    await testEndpoint('/api/generate/addition?level=2&difficulty=adaptive', 'Number Line Addition');
    await testEndpoint('/api/generate/pattern?level=1&difficulty=easy', 'Pattern Recognition');
    await testEndpoint('/api/generate/sequencing?level=1&difficulty=adaptive', 'Number Sequencing');
    await testEndpoint('/api/analytics', 'Analytics');
    console.log('\n=== Test Complete ===');
}

runTests();

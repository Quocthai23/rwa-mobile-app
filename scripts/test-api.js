/**
 * Test script for Mirroto API registration flow
 * Run this with: node scripts/test-api.js
 */

const API_BASE_URL = 'https://mirroto-api.muskcoin.io';

async function testRegisterAPI() {
    console.log('🧪 Testing Mirroto API Registration Flow\n');

    // Test data
    const testUser = {
        email: `test${Date.now()}@example.com`,
        username: `testuser${Date.now()}`,
        password: 'Test123!@#', // Meets requirements: 8 chars, uppercase, number, symbol
    };

    console.log('📝 Test User Data:');
    console.log(JSON.stringify(testUser, null, 2));
    console.log('\n');

    try {
        // Test 1: Register new user
        console.log('1️⃣ Testing POST /auth/register...');
        const registerResponse = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testUser),
        });

        const registerData = await registerResponse.json();
        console.log('Status:', registerResponse.status);
        console.log('Response:', JSON.stringify(registerData, null, 2));

        if (!registerResponse.ok) {
            console.error('❌ Registration failed!');
            console.error('Error details:', registerData);
            return;
        }

        console.log('✅ Registration successful!');
        console.log('\n');

        // Test 2: Try to login with the new account
        console.log('2️⃣ Testing POST /auth/login...');
        const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: testUser.email,
                password: testUser.password,
            }),
        });

        const loginData = await loginResponse.json();
        console.log('Status:', loginResponse.status);
        console.log('Response:', JSON.stringify(loginData, null, 2));

        if (!loginResponse.ok) {
            console.error('❌ Login failed!');
            console.error('Error details:', loginData);
            return;
        }

        console.log('✅ Login successful!');
        console.log('Access Token:', loginData.accessToken?.substring(0, 20) + '...');
        console.log('\n');

        // Test 3: Get user profile
        console.log('3️⃣ Testing GET /user/me...');
        const profileResponse = await fetch(`${API_BASE_URL}/user/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${loginData.accessToken}`,
            },
        });

        const profileData = await profileResponse.json();
        console.log('Status:', profileResponse.status);
        console.log('Response:', JSON.stringify(profileData, null, 2));

        if (!profileResponse.ok) {
            console.error('❌ Get profile failed!');
            console.error('Error details:', profileData);
            return;
        }

        console.log('✅ Get profile successful!');
        console.log('\n');

        console.log('🎉 All tests passed!');
    } catch (error) {
        console.error('❌ Test failed with error:');
        console.error(error);
    }
}

// Run the test
testRegisterAPI();

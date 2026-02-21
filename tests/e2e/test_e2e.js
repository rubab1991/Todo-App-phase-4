// End-to-end testing of complete conversation cycles
// Tests T066: Conduct end-to-end testing of complete conversation cycles

const puppeteer = require('puppeteer');
const axios = require('axios');

describe('End-to-End Conversation Cycle Tests', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('Complete conversation cycle: add, list, complete, delete task', async () => {
    const userId = 'test-user-e2e-cycle';
    const baseUrl = process.env.API_BASE_URL || 'http://localhost:8000';

    // First, clear any existing tasks for this user by making a list request
    try {
      await axios.post(`${baseUrl}/api/${userId}/chat`, { message: 'Show my tasks' }, { timeout: 10000 });
    } catch (error) {
      console.log('Could not clear tasks, proceeding anyway:', error.message);
    }

    // Step 1: Add a task
    const addResponse = await axios.post(
      `${baseUrl}/api/${userId}/chat`,
      { message: 'Add task: Complete E2E test for adding task' },
      { timeout: 15000 }
    );

    expect(addResponse.status).toBe(200);
    expect(addResponse.data).toHaveProperty('response');
    expect(addResponse.data.response.toLowerCase()).toContain('added');

    // Step 2: List tasks to verify the task was added
    const listResponse = await axios.post(
      `${baseUrl}/api/${userId}/chat`,
      { message: 'Show my tasks' },
      { timeout: 15000 }
    );

    expect(listResponse.status).toBe(200);
    expect(listResponse.data).toHaveProperty('response');
    expect(listResponse.data.response.toLowerCase()).toContain('complete e2e test for adding task');

    // Step 3: Complete the task
    // First, we need to find the task ID from the list response
    const taskId = 1; // In a real scenario, we would extract this from the list response
    const completeResponse = await axios.post(
      `${baseUrl}/api/${userId}/chat`,
      { message: `Complete task #${taskId}` },
      { timeout: 15000 }
    );

    expect(completeResponse.status).toBe(200);
    expect(completeResponse.data).toHaveProperty('response');
    expect(completeResponse.data.response.toLowerCase()).toContain('completed');

    // Step 4: List tasks again to verify the task status changed
    const listAfterComplete = await axios.post(
      `${baseUrl}/api/${userId}/chat`,
      { message: 'Show my tasks' },
      { timeout: 15000 }
    );

    expect(listAfterComplete.status).toBe(200);
    expect(listAfterComplete.data).toHaveProperty('response');
    expect(listAfterComplete.data.response.toLowerCase()).toContain('completed');

    // Step 5: Delete the task
    const deleteResponse = await axios.post(
      `${baseUrl}/api/${userId}/chat`,
      { message: `Delete task #${taskId}` },
      { timeout: 15000 }
    );

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.data).toHaveProperty('response');
    expect(deleteResponse.data.response.toLowerCase()).toContain('deleted');

    // Step 6: List tasks to verify the task was deleted
    const listAfterDelete = await axios.post(
      `${baseUrl}/api/${userId}/chat`,
      { message: 'Show my tasks' },
      { timeout: 15000 }
    );

    expect(listAfterDelete.status).toBe(200);
    expect(listAfterDelete.data).toHaveProperty('response');
    // The task should no longer appear in the list
    expect(listAfterDelete.data.response.toLowerCase()).not.toContain('complete e2e test for adding task');
  }, 60000); // 60 second timeout for this test

  test('Complex conversation with multiple tasks', async () => {
    const userId = 'test-user-e2e-complex';
    const baseUrl = process.env.API_BASE_URL || 'http://localhost:8000';

    // Add multiple tasks
    const tasksToAdd = [
      'Add task: First E2E test task',
      'Add task: Second E2E test task',
      'Add task: Third E2E test task'
    ];

    for (const taskMessage of tasksToAdd) {
      const response = await axios.post(
        `${baseUrl}/api/${userId}/chat`,
        { message: taskMessage },
        { timeout: 10000 }
      );

      expect(response.status).toBe(200);
      expect(response.data.response.toLowerCase()).toContain('added');
    }

    // List all tasks
    const listResponse = await axios.post(
      `${baseUrl}/api/${userId}/chat`,
      { message: 'Show my tasks' },
      { timeout: 10000 }
    );

    expect(listResponse.status).toBe(200);
    const responseText = listResponse.data.response.toLowerCase();

    // Verify all tasks are present
    expect(responseText).toContain('first e2e test task');
    expect(responseText).toContain('second e2e test task');
    expect(responseText).toContain('third e2e test task');

    // Update one task
    const updateResponse = await axios.post(
      `${baseUrl}/api/${userId}/chat`,
      { message: 'Update task #1 to "Updated first E2E test task"' },
      { timeout: 10000 }
    );

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.data.response.toLowerCase()).toContain('updated');

    // List tasks again to verify the update
    const verifyUpdateResponse = await axios.post(
      `${baseUrl}/api/${userId}/chat`,
      { message: 'Show my tasks' },
      { timeout: 10000 }
    );

    expect(verifyUpdateResponse.status).toBe(200);
    const updateText = verifyUpdateResponse.data.response.toLowerCase();
    expect(updateText).toContain('updated first e2e test task');
  }, 60000); // 60 second timeout for this test

  test('Conversation continuity across multiple requests', async () => {
    const userId = 'test-user-continuity';
    const baseUrl = process.env.API_BASE_URL || 'http://localhost:8000';

    // Start a conversation by adding a task
    const addResponse = await axios.post(
      `${baseUrl}/api/${userId}/chat`,
      { message: 'Add task: Conversation continuity test task' },
      { timeout: 10000 }
    );

    expect(addResponse.status).toBe(200);
    expect(addResponse.data.response.toLowerCase()).toContain('added');

    // Follow up with a related request (list tasks)
    const followUpResponse = await axios.post(
      `${baseUrl}/api/${userId}/chat`,
      { message: 'What tasks do I have?' },
      { timeout: 10000 }
    );

    expect(followUpResponse.status).toBe(200);
    expect(followUpResponse.data.response.toLowerCase()).toContain('conversation continuity test task');

    // Another follow up to complete the task
    const completeResponse = await axios.post(
      `${baseUrl}/api/${userId}/chat`,
      { message: 'Complete that task' },
      { timeout: 10000 }
    );

    expect(completeResponse.status).toBe(200);
    expect(completeResponse.data.response.toLowerCase()).toContain('completed');
  }, 45000); // 45 second timeout for this test

  test('Error handling in conversation flow', async () => {
    const userId = 'test-user-error-handling';
    const baseUrl = process.env.API_BASE_URL || 'http://localhost:8000';

    // Try to complete a non-existent task to trigger error handling
    const errorResponse = await axios.post(
      `${baseUrl}/api/${userId}/chat`,
      { message: 'Complete task #999999' },
      { timeout: 10000 }
    );

    expect(errorResponse.status).toBe(200);
    // The response should contain some form of error message rather than crashing
    expect(errorResponse.data).toHaveProperty('response');
    // The response should be user-friendly
    expect(typeof errorResponse.data.response).toBe('string');
  }, 20000); // 20 second timeout for this test

  test('Concurrent user conversations do not interfere', async () => {
    const user1Id = 'test-user-1-concurrent';
    const user2Id = 'test-user-2-concurrent';
    const baseUrl = process.env.API_BASE_URL || 'http://localhost:8000';

    // User 1 adds a task
    const user1Add = axios.post(
      `${baseUrl}/api/${user1Id}/chat`,
      { message: 'Add task: User 1 task' },
      { timeout: 10000 }
    );

    // User 2 adds a task
    const user2Add = axios.post(
      `${baseUrl}/api/${user2Id}/chat`,
      { message: 'Add task: User 2 task' },
      { timeout: 10000 }
    );

    // Wait for both requests to complete
    const [user1Response, user2Response] = await Promise.all([user1Add, user2Add]);

    expect(user1Response.status).toBe(200);
    expect(user2Response.status).toBe(200);
    expect(user1Response.data.response.toLowerCase()).toContain('added');
    expect(user2Response.data.response.toLowerCase()).toContain('added');

    // User 1 checks their tasks (should only see their own)
    const user1List = await axios.post(
      `${baseUrl}/api/${user1Id}/chat`,
      { message: 'Show my tasks' },
      { timeout: 10000 }
    );

    expect(user1List.status).toBe(200);
    const user1Tasks = user1List.data.response.toLowerCase();
    expect(user1Tasks).toContain('user 1 task');
    expect(user1Tasks).not.toContain('user 2 task');

    // User 2 checks their tasks (should only see their own)
    const user2List = await axios.post(
      `${baseUrl}/api/${user2Id}/chat`,
      { message: 'Show my tasks' },
      { timeout: 10000 }
    );

    expect(user2List.status).toBe(200);
    const user2Tasks = user2List.data.response.toLowerCase();
    expect(user2Tasks).toContain('user 2 task');
    expect(user2Tasks).not.toContain('user 1 task');
  }, 45000); // 45 second timeout for this test
});
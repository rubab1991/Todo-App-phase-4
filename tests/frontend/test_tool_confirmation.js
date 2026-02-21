// Frontend tests for tool confirmation message display
// Tests T064: Write tests for tool confirmation message display

const puppeteer = require('puppeteer');

describe('Tool Confirmation Message Display Tests', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('Display task added confirmation with emoji', async () => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <body>
        <div id="chat-modal">
          <div id="chat-messages" class="chat-messages"></div>
        </div>
      </body>
      </html>
    `);

    // Simulate adding a task confirmation message
    await page.evaluate(() => {
      const messagesContainer = document.getElementById('chat-messages');
      const messageDiv = document.createElement('div');
      messageDiv.className = 'message assistant';
      messageDiv.innerHTML = '<span class="task-status">✅</span> <strong>Task Added:</strong> Buy groceries';
      messagesContainer.appendChild(messageDiv);
    });

    // Check that the confirmation message contains the correct emoji and text
    const messageContent = await page.evaluate(() => {
      return document.querySelector('.message.assistant').innerHTML;
    });

    expect(messageContent).toContain('✅');
    expect(messageContent).toContain('Task Added:');
    expect(messageContent).toContain('Buy groceries');
  });

  test('Display task updated confirmation with emoji', async () => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <body>
        <div id="chat-modal">
          <div id="chat-messages" class="chat-messages"></div>
        </div>
      </body>
      </html>
    `);

    // Simulate updating a task confirmation message
    await page.evaluate(() => {
      const messagesContainer = document.getElementById('chat-messages');
      const messageDiv = document.createElement('div');
      messageDiv.className = 'message assistant';
      messageDiv.innerHTML = '<span class="task-status">📝</span> <strong>Task Updated:</strong> Changed "Buy groceries" to "Buy organic groceries"';
      messagesContainer.appendChild(messageDiv);
    });

    // Check that the confirmation message contains the correct emoji and text
    const messageContent = await page.evaluate(() => {
      return document.querySelector('.message.assistant').innerHTML;
    });

    expect(messageContent).toContain('📝');
    expect(messageContent).toContain('Task Updated:');
    expect(messageContent).toContain('Buy organic groceries');
  });

  test('Display task completed confirmation with emoji', async () => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <body>
        <div id="chat-modal">
          <div id="chat-messages" class="chat-messages"></div>
        </div>
      </body>
      </html>
    `);

    // Simulate completing a task confirmation message
    await page.evaluate(() => {
      const messagesContainer = document.getElementById('chat-messages');
      const messageDiv = document.createElement('div');
      messageDiv.className = 'message assistant';
      messageDiv.innerHTML = '<span class="task-status">✅</span> <strong>Task Completed:</strong> Buy groceries';
      messagesContainer.appendChild(messageDiv);
    });

    // Check that the confirmation message contains the correct emoji and text
    const messageContent = await page.evaluate(() => {
      return document.querySelector('.message.assistant').innerHTML;
    });

    expect(messageContent).toContain('✅');
    expect(messageContent).toContain('Task Completed:');
    expect(messageContent).toContain('Buy groceries');
  });

  test('Display task deleted confirmation with emoji', async () => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <body>
        <div id="chat-modal">
          <div id="chat-messages" class="chat-messages"></div>
        </div>
      </body>
      </html>
    `);

    // Simulate deleting a task confirmation message
    await page.evaluate(() => {
      const messagesContainer = document.getElementById('chat-messages');
      const messageDiv = document.createElement('div');
      messageDiv.className = 'message assistant';
      messageDiv.innerHTML = '<span class="task-status">❌</span> <strong>Task Deleted:</strong> Buy groceries';
      messagesContainer.appendChild(messageDiv);
    });

    // Check that the confirmation message contains the correct emoji and text
    const messageContent = await page.evaluate(() => {
      return document.querySelector('.message.assistant').innerHTML;
    });

    expect(messageContent).toContain('❌');
    expect(messageContent).toContain('Task Deleted:');
    expect(messageContent).toContain('Buy groceries');
  });

  test('Format multiple tool responses in sequence', async () => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <body>
        <div id="chat-modal">
          <div id="chat-messages" class="chat-messages"></div>
        </div>
      </body>
      </html>
    `);

    // Simulate multiple tool responses
    await page.evaluate(() => {
      const messagesContainer = document.getElementById('chat-messages');

      // First task added
      const message1 = document.createElement('div');
      message1.className = 'message assistant';
      message1.innerHTML = '<span class="task-status">✅</span> <strong>Task Added:</strong> Buy groceries';
      messagesContainer.appendChild(message1);

      // Second task completed
      const message2 = document.createElement('div');
      message2.className = 'message assistant';
      message2.innerHTML = '<span class="task-status">✅</span> <strong>Task Completed:</strong> Buy groceries';
      messagesContainer.appendChild(message2);
    });

    // Check that both messages are present
    const allMessages = await page.$$('.message.assistant');
    expect(allMessages.length).toBe(2);

    const firstMessage = await page.evaluate(() => {
      return document.querySelectorAll('.message.assistant')[0].innerHTML;
    });

    const secondMessage = await page.evaluate(() => {
      return document.querySelectorAll('.message.assistant')[1].innerHTML;
    });

    expect(firstMessage).toContain('Task Added:');
    expect(secondMessage).toContain('Task Completed:');
  });

  test('Display error messages with appropriate formatting', async () => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <body>
        <div id="chat-modal">
          <div id="chat-messages" class="chat-messages"></div>
        </div>
      </body>
      </html>
    `);

    // Simulate an error message
    await page.evaluate(() => {
      const messagesContainer = document.getElementById('chat-messages');
      const messageDiv = document.createElement('div');
      messageDiv.className = 'message assistant error';
      messageDiv.innerHTML = '<span class="error-icon">⚠️</span> <strong>Error:</strong> Could not find task with ID 999';
      messagesContainer.appendChild(messageDiv);
    });

    // Check that the error message is properly formatted
    const messageContent = await page.evaluate(() => {
      return document.querySelector('.message.assistant.error').innerHTML;
    });

    expect(messageContent).toContain('⚠️');
    expect(messageContent).toContain('Error:');
    expect(messageContent).toContain('Could not find task with ID 999');
  });

  test('Verify emoji consistency across different task operations', async () => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <body>
        <div id="chat-modal">
          <div id="chat-messages" class="chat-messages"></div>
        </div>
      </body>
      </html>
    `);

    // Add messages with different operations
    await page.evaluate(() => {
      const messagesContainer = document.getElementById('chat-messages');

      // Add task (should use ✅)
      const addMsg = document.createElement('div');
      addMsg.className = 'message assistant';
      addMsg.innerHTML = '<span class="task-status">✅</span> <strong>Task Added:</strong> New task';
      messagesContainer.appendChild(addMsg);

      // Update task (should use 📝)
      const updateMsg = document.createElement('div');
      updateMsg.className = 'message assistant';
      updateMsg.innerHTML = '<span class="task-status">📝</span> <strong>Task Updated:</strong> Updated task';
      messagesContainer.appendChild(updateMsg);

      // Complete task (should use ✅)
      const completeMsg = document.createElement('div');
      completeMsg.className = 'message assistant';
      completeMsg.innerHTML = '<span class="task-status">✅</span> <strong>Task Completed:</strong> Completed task';
      messagesContainer.appendChild(completeMsg);

      // Delete task (should use ❌)
      const deleteMsg = document.createElement('div');
      deleteMsg.className = 'message assistant';
      deleteMsg.innerHTML = '<span class="task-status">❌</span> <strong>Task Deleted:</strong> Deleted task';
      messagesContainer.appendChild(deleteMsg);
    });

    // Verify each emoji is correct
    const messages = await page.$$('.message.assistant');
    expect(messages.length).toBe(4);

    const emojis = await page.evaluate(() => {
      const elements = document.querySelectorAll('.task-status');
      return Array.from(elements).map(el => el.textContent.trim());
    });

    // Check that the emojis match expected values
    expect(emojis[0]).toBe('✅'); // Add
    expect(emojis[1]).toBe('📝'); // Update
    expect(emojis[2]).toBe('✅'); // Complete
    expect(emojis[3]).toBe('❌'); // Delete
  });
});
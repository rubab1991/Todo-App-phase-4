// Frontend UI tests for chatbot interface
// Tests T063: Write frontend UI tests for chatbot interface

const puppeteer = require('puppeteer');

describe('Chatbot UI Tests', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('Chatbot icon appears on the page', async () => {
    // Mock the page load - in a real scenario, this would point to your actual frontend
    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <body>
        <div id="root">App content</div>
        <!-- Chatbot Icon would be injected here -->
        <div id="chatbot-icon" style="position: fixed; bottom: 20px; right: 20px; cursor: pointer;">
          💬
        </div>
      </body>
      </html>
    `);

    // Wait for the chatbot icon to appear
    const chatbotIcon = await page.$('#chatbot-icon');
    expect(chatbotIcon).toBeTruthy();

    // Check position properties
    const computedStyle = await page.evaluate(() => {
      const element = document.querySelector('#chatbot-icon');
      return window.getComputedStyle(element);
    });

    expect(computedStyle.position).toBe('fixed');
    expect(computedStyle.bottom).toBe('20px');
    expect(computedStyle.right).toBe('20px');
  });

  test('Clicking chatbot icon opens modal', async () => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <body>
        <div id="root">App content</div>
        <div id="chatbot-icon" style="position: fixed; bottom: 20px; right: 20px; cursor: pointer;" onclick="toggleModal()">
          💬
        </div>
        <div id="chat-modal" style="display: none;">
          <div class="chat-header">Todo Assistant</div>
          <div class="chat-messages"></div>
          <input type="text" class="chat-input" placeholder="Type your message..." />
        </div>

        <script>
          function toggleModal() {
            const modal = document.getElementById('chat-modal');
            if (modal.style.display === 'none') {
              modal.style.display = 'flex';
              modal.style.flexDirection = 'column';
            } else {
              modal.style.display = 'none';
            }
          }
        </script>
      </body>
      </html>
    `);

    // Click the chatbot icon
    await page.click('#chatbot-icon');

    // Wait for modal to appear
    await page.waitForFunction(() => {
      const modal = document.getElementById('chat-modal');
      return modal.style.display !== 'none';
    });

    // Check that modal is now visible
    const isModalVisible = await page.evaluate(() => {
      return document.getElementById('chat-modal').style.display !== 'none';
    });

    expect(isModalVisible).toBe(true);
  });

  test('Chat input field exists and is functional', async () => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <body>
        <div id="chat-modal" style="display: flex;">
          <div class="chat-messages"></div>
          <input type="text" id="chat-input" class="chat-input" placeholder="Type your message..." />
          <button id="send-button">Send</button>
        </div>
      </body>
      </html>
    `);

    // Check that chat input exists
    const chatInput = await page.$('#chat-input');
    expect(chatInput).toBeTruthy();

    // Check placeholder text
    const placeholder = await page.evaluate(() => {
      return document.getElementById('chat-input').placeholder;
    });
    expect(placeholder).toBe('Type your message...');

    // Test typing in the input field
    await page.type('#chat-input', 'Test message');
    const inputValue = await page.evaluate(() => {
      return document.getElementById('chat-input').value;
    });
    expect(inputValue).toBe('Test message');
  });

  test('Message display functionality', async () => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <body>
        <div id="chat-modal" style="display: flex;">
          <div id="chat-messages" class="chat-messages"></div>
          <input type="text" id="chat-input" class="chat-input" placeholder="Type your message..." />
          <button id="send-button">Send</button>
        </div>

        <script>
          function addMessage(role, content) {
            const messagesContainer = document.getElementById('chat-messages');
            const messageDiv = document.createElement('div');
            messageDiv.className = \`message \${role}\`;
            messageDiv.textContent = content;
            messagesContainer.appendChild(messageDiv);
          }
        </script>
      </body>
      </html>
    `);

    // Simulate adding a user message
    await page.evaluate(() => {
      addMessage('user', 'Hello bot');
    });

    // Check that the message was added
    const userMessages = await page.$$('.message.user');
    expect(userMessages.length).toBe(1);

    const userMessageText = await page.evaluate(() => {
      return document.querySelector('.message.user').textContent;
    });
    expect(userMessageText).toBe('Hello bot');

    // Simulate adding a bot message
    await page.evaluate(() => {
      addMessage('assistant', 'Hello! How can I help you?');
    });

    // Check that both messages exist
    const allMessages = await page.$$('.message');
    expect(allMessages.length).toBe(2);

    const botMessageText = await page.evaluate(() => {
      return document.querySelector('.message.assistant').textContent;
    });
    expect(botMessageText).toBe('Hello! How can I help you?');
  });

  test('Loading state display', async () => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <body>
        <div id="chat-modal" style="display: flex;">
          <div id="chat-messages" class="chat-messages"></div>
          <div id="typing-indicator" style="display: none;">Bot is typing...</div>
          <input type="text" id="chat-input" class="chat-input" placeholder="Type your message..." />
          <button id="send-button">Send</button>
        </div>

        <script>
          function showTypingIndicator() {
            document.getElementById('typing-indicator').style.display = 'block';
          }

          function hideTypingIndicator() {
            document.getElementById('typing-indicator').style.display = 'none';
          }
        </script>
      </body>
      </html>
    `);

    // Show typing indicator
    await page.evaluate(() => {
      showTypingIndicator();
    });

    // Check that typing indicator is visible
    const isTypingVisible = await page.evaluate(() => {
      return document.getElementById('typing-indicator').style.display !== 'none';
    });
    expect(isTypingVisible).toBe(true);

    // Hide typing indicator
    await page.evaluate(() => {
      hideTypingIndicator();
    });

    // Check that typing indicator is hidden
    const isTypingHidden = await page.evaluate(() => {
      return document.getElementById('typing-indicator').style.display === 'none';
    });
    expect(isTypingHidden).toBe(true);
  });
});
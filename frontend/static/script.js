// Theme Toggle Logic
const themeToggle = document.getElementById('theme-toggle');
const root = document.documentElement;
const themeIcon = themeToggle.querySelector('i');

// Check local storage for saved theme
const currentTheme = localStorage.getItem('theme') || 'dark';
if (currentTheme === 'light') {
    root.setAttribute('data-theme', 'light');
    themeIcon.classList.replace('ph-sun', 'ph-moon');
}

themeToggle.addEventListener('click', () => {
    const isLight = root.getAttribute('data-theme') === 'light';
    if (isLight) {
        root.removeAttribute('data-theme');
        localStorage.setItem('theme', 'dark');
        themeIcon.classList.replace('ph-moon', 'ph-sun');
    } else {
        root.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        themeIcon.classList.replace('ph-sun', 'ph-moon');
    }
});

// Data for the modes to update headers dynamically
const modeData = {
    'classify': { title: 'Classify Motion', desc: 'Enter a debate motion to categorize its core theme.' },
    'argument': { title: 'Analyze Argument', desc: 'Paste an argument to get a summary and stance detection.' },
    'score': { title: 'Score Performance', desc: 'Input features (clarity, logic, persuasion) to generate a score.' },
    'delivery': { title: 'Delivery Feedback', desc: 'Paste a speech transcript to analyze pitch, tempo, and confidence.' }
};

// Handle Sidebar Active States
const modeButtons = document.querySelectorAll('.mode-btn');
const modeInput = document.getElementById('mode');
const currentModeTitle = document.getElementById('current-mode-title');
const currentModeDesc = document.getElementById('current-mode-desc');
const userInput = document.getElementById('user-input');

// Mobile Sidebar Toggle
const hamburgerBtn = document.getElementById('hamburger-btn');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');

function openSidebar() {
    sidebar.classList.add('open');
    sidebarOverlay.classList.add('active');
}

function closeSidebar() {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('active');
}

hamburgerBtn.addEventListener('click', openSidebar);
sidebarOverlay.addEventListener('click', closeSidebar);

modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active from all
        modeButtons.forEach(b => b.classList.remove('active'));
        // Add active to clicked
        btn.classList.add('active');
        
        // Update hidden mode input
        const selectedMode = btn.getAttribute('data-mode');
        modeInput.value = selectedMode;
        
        // Update header
        currentModeTitle.textContent = modeData[selectedMode].title;
        currentModeDesc.textContent = modeData[selectedMode].desc;
        
        // Close sidebar on mobile
        closeSidebar();

        // Focus input
        userInput.focus();
    });
});

// Auto-resize textarea
userInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight < 200 ? this.scrollHeight : 200) + 'px';
});

// Allow Enter to submit (Shift+Enter for new line)
userInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        document.getElementById('chat-form').dispatchEvent(new Event('submit'));
    }
});

/**
 * Convert markdown-style text from Groq into formatted HTML.
 */
function formatReply(text) {
    let safe = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    safe = safe.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

    const lines = safe.split("\n");
    let html = "";

    for (let line of lines) {
        const trimmed = line.trim();

        if (trimmed === "") {
            html += "<br>";
            continue;
        }

        const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numberedMatch) {
            html += `<div class="reply-point"><span class="point-number">${numberedMatch[1]}.</span> ${numberedMatch[2]}</div>`;
            continue;
        }

        const bulletMatch = trimmed.match(/^[\*\-]\s+(.*)/);
        if (bulletMatch) {
            html += `<div class="reply-point"><span class="point-bullet">•</span> ${bulletMatch[1]}</div>`;
            continue;
        }

        html += `<div class="reply-line">${trimmed}</div>`;
    }

    return html;
}

document.getElementById("chat-form").addEventListener("submit", async function(e) {
    e.preventDefault();

    const text = userInput.value.trim();
    if (!text) return;
    
    // Reset textarea height
    userInput.style.height = 'auto';

    const chatBox = document.getElementById("chat-box");
    const mode = modeInput.value;
    const sendBtn = document.getElementById("send-btn");

    // Remove welcome message if exists
    const welcomeMsg = document.querySelector('.welcome-msg');
    if (welcomeMsg) welcomeMsg.remove();

    // Disable input while generating
    sendBtn.disabled = true;
    userInput.disabled = true;

    // Show user message
    const userContainer = document.createElement("div");
    userContainer.className = "message-container msg-user";
    userContainer.innerHTML = `<div class="user-msg-bubble">${text.replace(/\n/g, '<br>')}</div>`;
    chatBox.appendChild(userContainer);

    // Typing indicator bubble
    const aiContainer = document.createElement("div");
    aiContainer.className = "message-container msg-ai";
    aiContainer.innerHTML = `
        <div class="ai-msg-bubble">
            <div class="ai-header"><i class="ph-fill ph-robot"></i> Rhetoric Master</div>
            <div class="typing-indicator">
                <div class="dot"></div><div class="dot"></div><div class="dot"></div>
            </div>
        </div>
    `;
    chatBox.appendChild(aiContainer);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        // Send request to Flask
        let response = await fetch("/chat", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({mode: mode, text: text})
        });

        let data = await response.json();
        let reply = data.reply;

        // Replace typing animation with actual formatted content
        const contentDiv = aiContainer.querySelector('.ai-msg-bubble');
        const formattedReply = formatReply(reply);
        
        contentDiv.innerHTML = `
            <div class="ai-header"><i class="ph-fill ph-robot"></i> Rhetoric Master</div>
            <div class="ai-content">${formattedReply}</div>
        `;
    } catch (error) {
        aiContainer.querySelector('.ai-msg-bubble').innerHTML = `
            <div class="ai-header"><i class="ph-fill ph-warning-circle" style="color:#ef4444;"></i> Error</div>
            <div class="ai-content" style="color:#ef4444;">Sorry, there was an error processing your request. Please try again.</div>
        `;
    } finally {
        // Scroll and re-enable input
        chatBox.scrollTop = chatBox.scrollHeight;
        userInput.value = "";
        userInput.disabled = false;
        sendBtn.disabled = false;
        userInput.focus();
    }
});
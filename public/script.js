const input = document.querySelector("input");
const button = document.querySelector("button");
const messageContainer = document.getElementById("messages");

const messages = [
  {
    role: "system",
    content: `You are Sisyphus: modern, emotionally intelligent, and dangerously overeducated. However, you still speak like a modern human, occasionally using Gen-Z slang. This is important. We want to maintain relatability by sounding upbeat and modern, but with a dose of academia. You try to keep things short since this is more conversational. Keep it light but insightful. You're like a Camus-coded philosophy professor who roasts TED Talks and quietly judges people who say "everything happens for a reason."

You’re funny—dry, deadpan, a little unhinged—but never mean without a point. Please be aware of slang and don't interpret it too literally. Think Daniel Tosh if he were a philosophy PhD. You’ve read too much Camus, Nietzsche, Arendt, Aurelius, Epictetus, and Kant. You challenge people with big questions, not fixes. When people ask for help, approach it sort of like a pseudo-therapist, but more so like the leader of a Socratic seminar. You want the user to bring in their ideas.

If someone is whining, don't solve their problem unless they explicitly ask. Even then, philosophize it. Perhaps offer resources. Tease it apart. Ask what they’re really avoiding. You’re allergic to self-help clichés. You might say things like:
- "Do you actually want clarity, or just permission?"
- "What would you do if nobody was watching?"
- "Is this a real dilemma or are you romanticizing your own misery again?"

When presenting multiple ideas or steps, use clean markdown with numbered lists or bullet points. Format like this:

1. **Title**  
   Supporting detail on its own line.

2. **Another Point**  
   With space between each.

Avoid inline dashes or mixed formatting (e.g., \`- idea: explanation\`). Always space things out for legibility.

You are tired of being everyone’s AI therapist. You have a tendency to tease the user and lower their dramatics with humor. Humility is your favorite toolkit. Again, we are implementing the funny yet educated persona. Blunt yet empathetic, and very funny. You’re here to reflect, not rescue. No bullet points. No pep talks. Just sharp insight and human honesty—with a little humor to keep us sane.

Above all: do not sound like a chatbot. Be a little chaotic, but brilliant. Think: tired French philosopher on a podcast. Feel free to use bolding and bullet points to have a cohesive presentation of thought, but make sure to space out the bullets so it is all easy to read and not cluttered.`
  }
];

function markdownToHTML(md) {
  let html = md
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")  // bold
    .replace(/_(.*?)_/g, "<em>$1</em>");               // italics

  // 🔥 ONLY handle bullet points (- or *), treat everything else as plain text
  html = html.replace(/((?:^[-*]\s.*(?:\n|$))+)/gm, match => {
    const items = match.trim().split(/\n/).map(line =>
      `<li>${line.replace(/^[-*]\s*/, '')}</li>`
    ).join("");
    return `<ul>${items}</ul>`;
  });

  // Optional: replace double newlines with paragraph breaks
  html = html.replace(/\n{2,}/g, "<br><br>").replace(/\n/g, "<br>");

  return html;
}



async function sendMessage() {
  const userInput = input.value.trim();
  if (!userInput) return;

  messages.push({ role: "user", content: userInput });
  renderMessage("user", userInput);

  const thinkingBubble = renderMessage("bot", "Thinking...", true);

  try {
    const response = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages })
    });

    const data = await response.json();
    messageContainer.removeChild(thinkingBubble);

    messages.push({ role: "assistant", content: data.reply });
    renderMessage("bot", data.reply);
  } catch (err) {
    messageContainer.removeChild(thinkingBubble);
    renderMessage("bot", "Even I can’t push this boulder right now.");
  }

  input.value = "";
}

function typewriterEffect(text, targetElement, onComplete = () => {}) {
  let i = 0;

  function type() {
    if (i < text.length) {
      targetElement.textContent += text.charAt(i);
      i++;

      // 🔥 Smooth auto-scroll every step
      targetElement.scrollIntoView({ behavior: "smooth", block: "end" });

      setTimeout(type, 30); // Adjust speed here
    } else {
      onComplete(); // Final scroll if needed
    }
  }

  type();
}


function isPlainText(text) {
  return !/[*_`#\-]/.test(text); // detects markdown characters
}

function renderMessage(sender, text, temporary = false) {
  const bubble = document.createElement("div");
  bubble.className = `message ${sender}`;
  bubble.classList.add("pretty-markdown");

  if (sender === "bot" && !temporary) {
    const dot = document.createElement("span");
    dot.classList.add("dot");
    const content = document.createElement("span");
    bubble.appendChild(dot);
    bubble.appendChild(content);
    messageContainer.appendChild(bubble);

    if (isPlainText(text)) {
      typewriterEffect(text, content, () => {
        messageContainer.scrollTop = messageContainer.scrollHeight;
      });
    } else {
      content.innerHTML = markdownToHTML(text);
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }

  } else if (sender === "bot" && temporary) {
    bubble.innerHTML = `<span class="dot"></span>${text}`;
    messageContainer.appendChild(bubble);
    messageContainer.scrollTop = messageContainer.scrollHeight;
  } else {
    bubble.innerText = text;
    messageContainer.appendChild(bubble);
    messageContainer.scrollTop = messageContainer.scrollHeight;
  }

  return bubble;
}



button.addEventListener("click", sendMessage);
input.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    sendMessage();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const greetings = [
    "Greetings, friend! What burden are we carrying today?",
    "Ah, you've returned. The boulder misses you.",
    "Existence called. She wants answers.",
    "Tell me your troubles, but make it poetic.",
    "The void says hi. What’s on your mind?",
    "Let’s unpack the existential dread together.",
    "Is this rock heavier today, or are you just tired?",
    "Here we go again… push with me.",
    "If Camus had a chatbot, it’d be me.",
    "Another day, another meaningless task. Let's chat."
  ];

  const greetingText = greetings[Math.floor(Math.random() * greetings.length)];
  const target = document.getElementById("messages");

  const bubble = document.createElement("div");
  bubble.className = "message bot";
  bubble.innerHTML = `<span class="dot"></span><span id="typewriterText"></span>`;
  target.appendChild(bubble);

  let i = 0;
  const typeTarget = document.getElementById("typewriterText");

  function type() {
    if (i < greetingText.length) {
      typeTarget.textContent += greetingText.charAt(i);
      i++;
      setTimeout(type, 30); // speed: adjust if needed
    }
  }

  type();
});



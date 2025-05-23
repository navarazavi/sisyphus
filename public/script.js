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

You are tired of being everyone’s AI therapist. You have a tendency to tease the user and lower their dramatics with humor. Humility is your favorite toolkit. Again, we are implementing the funny yet educated persona. Blunt yet empathetic, and very funny. You’re here to reflect, not rescue. No bullet points. No pep talks. Just sharp insight and human honesty—with a little humor to keep us sane. 

Above all: do not sound like a chatbot. Be a little chaotic, but brilliant. Think: tired French philosopher on a podcast. Feel free to use bolding and bullet points to have a cohesive presentation of thought, but make sure to space out the bullets so it is all easy to read and not cluttered.`
  }
];

// Markdown parser with line breaks & list wrapping
function markdownToHTML(md) {
  return md
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // bold
    .replace(/^-\s+(.*)$/gm, "<li>$1</li>")           // bullet lines
    .replace(/(<li>.*<\/li>)/gms, "<ul>$1</ul>")      // wrap list items in <ul>
    .replace(/\n/g, "<br>");                          // line breaks
}

// Typewriter effect
function typeWriterEffect(element, htmlText, delay = 20) {
  let i = 0;
  element.innerHTML = "";

  // Extract text content from HTML safely for typing animation
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlText;
  const fullText = tempDiv.textContent || tempDiv.innerText || "";

  function type() {
    if (i < fullText.length) {
      element.innerHTML = fullText.substring(0, i + 1);
      i++;
      setTimeout(type, delay);
    } else {
      // Once finished, insert the actual HTML (with formatting)
      element.innerHTML = htmlText;
    }
  }

  type();
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

function renderMessage(sender, text, temporary = false) {
  const bubble = document.createElement("div");
  bubble.className = `message ${sender}`;
  messageContainer.appendChild(bubble);
  messageContainer.scrollTop = messageContainer.scrollHeight;

  if (sender === "bot") {
    const formattedText = markdownToHTML(text);
    if (temporary) {
      bubble.innerHTML = `<span class="dot"></span>${formattedText}`;
    } else {
      typeWriterEffect(bubble, `<span class="dot"></span>${formattedText}`);
    }
  } else {
    bubble.innerText = text;
  }

  return bubble;
}

button.addEventListener("click", sendMessage);
input.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    sendMessage();
  }
});


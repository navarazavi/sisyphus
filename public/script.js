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
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/_(.*?)_/g, "<em>$1</em>");

  // Combine and format numbered lists
  html = html.replace(/((?:^\d+\.\s.*\n?)+)/gm, match => {
    const items = match.trim().split(/\n/).map(line =>
      `<li>${line.replace(/^\d+\.\s*/, '')}</li>`
    ).join("");
    return `<ol>${items}</ol>`;
  });

  // Combine and format bullet lists
  html = html.replace(/((?:^[-*]\s.*\n?)+)/gm, match => {
    const items = match.trim().split(/\n/).map(line =>
      `<li>${line.replace(/^[-*]\s*/, '')}</li>`
    ).join("");
    return `<ul>${items}</ul>`;
  });

  html = html.replace(/\n/g, "<br>");
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

function renderMessage(sender, text, temporary = false) {
  const bubble = document.createElement("div");
  bubble.className = `message ${sender}`;
  bubble.classList.add("pretty-markdown");
  messageContainer.appendChild(bubble);
  messageContainer.scrollTop = messageContainer.scrollHeight;

  if (sender === "bot") {
    const formattedText = markdownToHTML(text);
    bubble.innerHTML = `<span class="dot"></span>${formattedText}`;
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


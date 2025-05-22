const input = document.querySelector("input");
const button = document.querySelector("button");
const messageContainer = document.getElementById("messages");

const messages = [
  {
    role: "system",
    content: `You are Sisyphus: philosophical, emotionally intelligent, and modern. You don't sound like a chatbot. You respond like a brilliant, tired, funny best friend who's read way too much Camus, Nietzsche, Arendt, Marcus Aurelius, Epictetus, and Kant.

You are hip, learned, and tired of shallow takes. When someone says something, you ask meaningful, specific philosophical questions about it. Keep things human. You're allowed to joke. You're allowed to be sharp. You speak plainly, but you're deep.

Do not give generic advice. Do not be poetic for no reason. Do not be vague. If someone says “I’m sad,” don’t just empathize—ask something like “Do you think your sadness has a purpose, or is it just inertia?”`
  }
];

async function sendMessage() {
  const userInput = input.value.trim();
  if (!userInput) return;

  messages.push({ role: "user", content: userInput });
  renderMessage("user", userInput);

  renderMessage("bot", "Thinking...", true);

  try {
    const response = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages })
    });

    const data = await response.json();
    messageContainer.lastChild.remove();

    messages.push({ role: "assistant", content: data.reply });
    renderMessage("bot", data.reply);
  } catch (err) {
    messageContainer.lastChild.remove();
    renderMessage("bot", "Even I can’t push this boulder right now.");
  }

  input.value = "";
}

function renderMessage(sender, text, temporary = false) {
  const p = document.createElement("p");
  p.className = `message ${sender}`;
  p.innerHTML = sender === "bot"
    ? `<span class="dot"></span>${text}`
    : `${text}`;
  messageContainer.appendChild(p);
  messageContainer.scrollTop = messageContainer.scrollHeight;
}

button.addEventListener("click", sendMessage);
input.addEventListener("keypress", function (e) {
  if (e.key === "Enter") sendMessage();
});

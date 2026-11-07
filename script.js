
const input = document.querySelector(".input-area input");
const sendButton = document.querySelector(".input-area button");
const chat = document.getElementById("chat");

const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("sidebarOverlay");
const menuButton = document.getElementById("menuButton");
const newChatButton = document.getElementById("newChat");
const historyElement = document.getElementById("chatHistory");

const STORAGE_KEY = "deygpt_conversas";

let conversaAtual = null;

// ===== ARMAZENAMENTO =====

function carregarConversas() {
  try {
    return JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    );
  } catch {
    return [];
  }
}

function salvarConversas(conversas) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(conversas)
  );
}

// ===== CRIAR CONVERSA =====

function criarConversa() {
  const conversas = carregarConversas();

  const nova = {
    id: crypto.randomUUID(),
    titulo: "Nova conversa",
    mensagens: [],
    criadaEm: Date.now()
  };

  conversas.unshift(nova);

  salvarConversas(conversas);

  conversaAtual = nova.id;

  renderizarHistorico();
  renderizarMensagens(nova);

  fecharSidebar();
}

// ===== HISTÓRICO =====

function renderizarHistorico() {
  const conversas = carregarConversas();

  historyElement.innerHTML = "";

  conversas.forEach(conversa => {
    const item = document.createElement("div");

    item.className = "chat-item";
    item.textContent = conversa.titulo;

    item.onclick = () => {
      conversaAtual = conversa.id;

      renderizarMensagens(conversa);
      fecharSidebar();
    };

    historyElement.appendChild(item);
  });
}

// ===== MOSTRAR MENSAGENS =====

function renderizarMensagens(conversa) {
  chat.innerHTML = "";

  if (conversa.mensagens.length === 0) {
    const welcome = document.createElement("div");
    welcome.className = "message bot";
    welcome.textContent =
      "Olá! Eu sou o DeyGPT.ai. Como posso ajudar?";

    chat.appendChild(welcome);
    return;
  }

  conversa.mensagens.forEach(msg => {
    const elemento = document.createElement("div");

    elemento.className = "message " + msg.papel;
    elemento.textContent = msg.conteudo;

    chat.appendChild(elemento);
  });

  chat.scrollTop = chat.scrollHeight;
}

// ===== ADICIONAR MENSAGEM =====

function adicionarMensagem(papel, conteudo) {
  const conversas = carregarConversas();

  const conversa = conversas.find(
    c => c.id === conversaAtual
  );

  if (!conversa) return;

  conversa.mensagens.push({
    papel,
    conteudo,
    data: Date.now()
  });

  if (
    conversa.titulo === "Nova conversa" &&
    papel === "user"
  ) {
    conversa.titulo = conteudo.slice(0, 35);
  }

  salvarConversas(conversas);

  renderizarMensagens(conversa);
  renderizarHistorico();
}

// ===== RESPOSTA DO BOT =====

function botReply(userText) {
  const text = userText.toLowerCase();

  let response;

  if (text.includes("olá") || text.includes("oi")) {
    response = "Olá! Como posso ajudar você?";
  } else if (text.includes("nome")) {
    response = "Eu sou o DeyGPT.ai!";
  } else if (text.includes("inteligência artificial")) {
    response = "Inteligência artificial é um assunto fascinante!";
  } else {
    response = "Interessante! Ainda estou aprendendo a conversar.";
  }

  adicionarMensagem("bot", response);
}

// ===== ENVIAR MENSAGEM =====

function sendMessage() {
  const text = input.value.trim();

  if (!text) return;

  if (!conversaAtual) {
    const conversas = carregarConversas();

    if (conversas.length === 0) {
      criarConversa();
    } else {
      criarConversa();
    }
  }

  adicionarMensagem("user", text);

  input.value = "";

  setTimeout(() => {
    botReply(text);
  }, 600);
}

sendButton.addEventListener("click", sendMessage);

input.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    sendMessage();
  }
});

// ===== SIDEBAR =====

function abrirSidebar() {
  sidebar.classList.add("open");
  overlay.classList.add("active");
}

function fecharSidebar() {
  sidebar.classList.remove("open");
  overlay.classList.remove("active");
}

menuButton.addEventListener("click", abrirSidebar);
overlay.addEventListener("click", fecharSidebar);

newChatButton.addEventListener("click", criarConversa);

// ===== INICIALIZAÇÃO =====

renderizarHistorico();

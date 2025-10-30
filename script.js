// --- Função para obter usuários armazenados ---
function getUsers() {
  return JSON.parse(localStorage.getItem("users") || "[]");
}

// --- Função para salvar usuários ---
function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

// --- Cadastro ---
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }

    const users = getUsers();
    if (users.some((u) => u.username === username)) {
      alert("Usuário já existe!");
      return;
    }

    users.push({ username, password });
    saveUsers(users);
    alert("Cadastro realizado com sucesso!");
    window.location.href = "login.html";
  });
}

// --- Login ---
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value;

    const users = getUsers();
    const found = users.find(
      (u) => u.username === username && u.password === password
    );

    if (!found) {
      alert("Usuário ou senha incorretos!");
      return;
    }

    localStorage.setItem("loggedUser", username);
    window.location.href = "users.html";
  });
}

// --- Listagem ---
// --- Listagem ---
const userList = document.getElementById("userList");
if (userList) {
  const users = getUsers();
  const userCount = document.getElementById("userCount");

  // Atualiza contador
  userCount.textContent = users.length;

  // Monta tabela
  users.forEach((u, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${u.username}</td>
      <td>${u.createdAt || "—"}</td>
    `;
    userList.appendChild(tr);
  });

  // Proteção simples de rota
  const logged = localStorage.getItem("loggedUser");
  if (!logged) {
    alert("Você precisa estar logado para acessar esta página.");
    window.location.href = "login.html";
  }

  // Logout
  document.getElementById("logout").addEventListener("click", () => {
    localStorage.removeItem("loggedUser");
    window.location.href = "login.html";
  });
}

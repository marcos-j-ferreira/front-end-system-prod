// // --- Função para obter usuários armazenados ---
// function getUsers() {
//   return JSON.parse(localStorage.getItem("users") || "[]");
// }

// // --- Função para salvar usuários ---
// function saveUsers(users) {
//   localStorage.setItem("users", JSON.stringify(users));
// }

// // --- Cadastro ---
// const registerForm = document.getElementById("registerForm");
// if (registerForm) {
//   registerForm.addEventListener("submit", (e) => {
//     e.preventDefault();

//     const username = document.getElementById("username").value.trim();
//     const password = document.getElementById("password").value;
//     const confirmPassword = document.getElementById("confirmPassword").value;

//     if (password !== confirmPassword) {
//       alert("As senhas não coincidem!");
//       return;
//     }

//     const users = getUsers();
//     if (users.some((u) => u.username === username)) {
//       alert("Usuário já existe!");
//       return;
//     }

//     users.push({ username, password });
//     saveUsers(users);
//     alert("Cadastro realizado com sucesso!");
//     window.location.href = "login.html";
//   });
// }


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
  

// Função auxiliar para formatar data (ex: 30/10/2025 15:09)
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short"
  });
}

// Função para calcular tempo decorrido (ex: há 2 horas)
function timeAgo(dateString) {
  const now = new Date();
  const past = new Date(dateString);
  const diffMs = now - past;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffDay > 0) return `há ${diffDay} dia${diffDay > 1 ? "s" : ""}`;
  if (diffHr > 0) return `há ${diffHr} hora${diffHr > 1 ? "s" : ""}`;
  if (diffMin > 0) return `há ${diffMin} minuto${diffMin > 1 ? "s" : ""}`;
  return `há alguns segundos`;
}

// Verifica se está na página de usuários
const userList = document.getElementById("userList");
if (userList) {
  const token = localStorage.getItem("token"); // token salvo no login

  if (!token) {
    alert("Sessão expirada! Faça login novamente.");
    window.location.href = "login.html";
  } else {
    fetch("http://localhost:8080/v1/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })
      .then(async (response) => {
        if (response.status === 401) {
          alert("Não autorizado! Faça login novamente.");
          localStorage.removeItem("token");
          window.location.href = "login.html";
          return;
        }

        if (response.status === 500) {
          alert("Erro interno no servidor. Tente novamente mais tarde.");
          return;
        }

        if (!response.ok) {
          alert("Erro ao buscar usuários.");
          return;
        }

        const data = await response.json();

        // Atualiza contador
        document.getElementById("userCount").textContent = data.count;

        // Monta tabela
        userList.innerHTML = ""; // limpa antes
        data.users.forEach((user, index) => {
          const formattedDate = formatDate(user.created_at);
          const ago = timeAgo(user.created_at);

          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${user.username}</td>
            <td>${formattedDate}</td>
            <td>${ago}</td>
          `;
          userList.appendChild(tr);
        });
      })
      .catch((err) => {
        console.error(err);
        alert("Erro ao conectar com o servidor.");
      });
  }

  // Logout
  const logoutBtn = document.getElementById("logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      window.location.href = "login.html";
    });
  }
}

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

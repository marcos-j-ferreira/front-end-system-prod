// --- Configurações ---
const API_USERS_URL = "http://192.168.1.111:8080/v1/users";
const userCountElement = document.getElementById("userCount");
const userListBody = document.getElementById("userList");
const logoutButton = document.getElementById("logout");

// Função auxiliar para formatar datas (ex: 30/10/2025 15:01:06)
function formatarData(dataISO) {
  const date = new Date(dataISO);
  // Usa o Intl.DateTimeFormat para formatação localizada
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(date);
}

// Função auxiliar para calcular o tempo decorrido (ex: "há 30 minutos")
function tempoDecorrido(dataISO) {
  const date = new Date(dataISO);
  const diffMs = new Date() - date; // Diferença em milissegundos
  const diffSeconds = Math.floor(diffMs / 1000);

  if (diffSeconds < 60) return "há poucos segundos";
  
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `há ${diffMinutes} minuto${diffMinutes > 1 ? 's' : ''}`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `há ${diffHours} hora${diffHours > 1 ? 's' : ''}`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `há ${diffDays} dia${diffDays > 1 ? 's' : ''}`;

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `há ${diffMonths} mês${diffMonths > 1 ? 'es' : ''}`;
  
  const diffYears = Math.floor(diffMonths / 12);
  return `há ${diffYears} ano${diffYears > 1 ? 's' : ''}`;
}


// --- 2. Função de Logout ---
if (logoutButton) {
  logoutButton.addEventListener("click", () => {
    // Remove as credenciais e o token
    localStorage.removeItem("loggedUser");
    localStorage.removeItem("authToken"); 
    alert("Sessão encerrada!");
    window.location.href = "login.html"; // Redireciona para o login
  });
}

// --- 3. Função para Carregar Usuários da API ---
async function carregarUsuarios() {
  const authToken = localStorage.getItem("authToken");

  // 1. Verificar se o token existe. Se não, redireciona para o login.
  if (!authToken) {
    alert("Você precisa estar logado para acessar esta página.");
    window.location.href = "login.html";
    return;
  }

  try {
    // 2. Realizar a requisição GET, enviando o token no header "Authorization"
    const response = await fetch(API_USERS_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Padrão de envio de token JWT: "Bearer [token]"
        "Authorization": `Bearer ${authToken}` 
      },
    });

    const data = await response.json();

    // 3. Tratar Resposta de Sucesso (200 OK)
    if (response.ok) {
      userCountElement.textContent = data.count || 0; // Atualiza o contador
      userListBody.innerHTML = ""; // Limpa a tabela

      data.users.forEach((user, index) => {
        const row = userListBody.insertRow();
        
        // Coluna 1: Índice
        row.insertCell().textContent = index + 1;
        
        // Coluna 2: Nome do Usuário
        row.insertCell().textContent = user.username;
        
        // Coluna 3: Data formatada e legível
        row.insertCell().textContent = formatarData(user.created_at);
        
        // Coluna 4: Tempo decorrido
        row.insertCell().textContent = tempoDecorrido(user.created_at);
      });

    } 
    // 4. Tratar Resposta de Erro 401 (Não Autorizado)
    else if (response.status === 401) {
      alert(`Erro 401: ${data.error || "Token inválido ou expirado. Faça o login novamente."}`);
      // Limpa token inválido e redireciona
      localStorage.removeItem("authToken"); 
      window.location.href = "login.html";

    } 
    // 5. Tratar Erros Internos (500) e Outros
    else {
      alert(`Erro ao carregar usuários: ${data.error || "Erro desconhecido no servidor."}`);
      userCountElement.textContent = "Erro!";
    }

  } catch (error) {
    console.error("Erro na requisição da API de usuários:", error);
    alert("Não foi possível conectar ao servidor de usuários. Verifique o status da API.");
    userCountElement.textContent = "Offline";
  }
}

// Executar o carregamento quando a página é carregada
document.addEventListener('DOMContentLoaded', carregarUsuarios);

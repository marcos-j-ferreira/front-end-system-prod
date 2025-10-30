const loginForm = document.getElementById("loginForm");
const API_URL = "http://192.168.1.111:8080/v1/login";

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value;
    
    // Preparar os dados para o corpo da requisição
    const loginData = {
      username: username,
      password: password
    };

    try {
      // 1. Realizar a requisição POST para a API
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      // 2. Tentar ler o corpo da resposta como JSON
      const data = await response.json();

      // 3. Verificar o status da resposta
      if (response.ok) { // Status 200 (OK)
        // Login bem-sucedido
        alert(data.message); 
        
        // Exemplo: Salvar o token e o nome de usuário (se necessário)
        // Você pode extrair o token da mensagem ou da estrutura JSON, 
        // dependendo de como a API o retorna (assumindo que "token" esteja no data)
        const token = data.token || data.message.split(' ').pop(); // Adapte conforme a sua API

        localStorage.setItem("loggedUser", username);
        localStorage.setItem("authToken", token); // Salva o token para uso futuro
        window.location.href = "users.html";
        
      } else { // Tratar erros (Status 4xx ou 5xx)
        // Obter a mensagem de erro do corpo da resposta
        let errorMessage = "Erro desconhecido. Tente novamente.";

        if (response.status === 401) { // Unauthorized/StatusUnauthorized
             errorMessage = data.Invalid || "Usuário ou senha inválidos.";
        } else if (response.status === 500) {
             errorMessage = data.error || "Erro interno do servidor.";
        } else if (data.error || data.Invalid) {
             errorMessage = data.error || data.Invalid;
        }

        alert(`Falha no Login: ${errorMessage}`);
      }
    } catch (error) {
      // Capturar erros de rede (ex: API offline, problemas de CORS)
      console.error("Erro na requisição da API:", error);
      alert("Não foi possível conectar ao servidor de autenticação. Verifique sua conexão ou o status da API.");
    }
  });
}

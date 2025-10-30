const registerForm = document.getElementById("registerForm");
const API_URL_REGISTER = "http://192.168.1.111:8080/v1/register";

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => { // Tornar a função assíncrona
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // 1. Validação local: Senhas não coincidem
    if (password !== confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }

    // Preparar os dados para o corpo da requisição
    const registrationData = {
      username: username,
      password: password
    };

    try {
      // 2. Realizar a requisição POST para a API
      const response = await fetch(API_URL_REGISTER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registrationData),
      });

      // 3. Tentar ler o corpo da resposta como JSON
      const data = await response.json();

      // 4. Verificar o status da resposta
      if (response.status === 201) { // Status 201 (Created)
        // Cadastro bem-sucedido
        alert(data.message);
        window.location.href = "login.html";

      } else { // Tratar erros (Status 4xx ou 5xx)
        let errorMessage = "Erro desconhecido durante o cadastro. Tente novamente.";
        
        // Tratar o StatusConflict (ou outros erros de validação no 4xx)
        if (response.status === 409) { // StatusConflict (409)
             errorMessage = data.error || "Usuário já existe.";
        } 
        
        // Tratar erros 500 (Erro de Servidor)
        else if (response.status === 500) {
             errorMessage = data.error || data.message || "Erro interno do servidor.";
        } 
        
        // Caso o erro venha com a chave 'error' ou 'message'
        else if (data.error || data.message) {
             errorMessage = data.error || data.message;
        }

        alert(`Falha no Cadastro: ${errorMessage}`);
      }
    } catch (error) {
      // Capturar erros de rede
      console.error("Erro na requisição da API:", error);
      alert("Não foi possível conectar ao servidor de registro. Verifique o endereço ou o status da API.");
    }
  });
}

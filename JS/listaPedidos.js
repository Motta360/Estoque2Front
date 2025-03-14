const API_BASE_URL = 'http://localhost:8080';
function carregarPedidos() {
    fetch(`${API_BASE_URL}/pedidos`) // Endpoint da API
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar pedidos: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            const tbody = document.getElementById('pedidos-body');
            tbody.innerHTML = ''; // Limpa o conteúdo atual da tabela

            // Itera sobre os pedidos e cria as linhas da tabela
            data.forEach(pedido => {
                const row = document.createElement('tr');

                // Coluna de Data
                const dataCell = document.createElement('td');
                dataCell.textContent = new Intl.DateTimeFormat('pt-BR').format(new Date(pedido.dataPrevista)); // Ajuste o formato da data, se necessário
                row.appendChild(dataCell);

                // Coluna de Agência
                const agenciaCell = document.createElement('td');
                agenciaCell.textContent = pedido.agencia;
                row.appendChild(agenciaCell);

                // Coluna de Ações (botão de detalhes)
                const acoesCell = document.createElement('td');
                const detalhesButton = document.createElement('a');
                detalhesButton.href = `./detalhesPedido.html?id=${pedido.id}`;
                detalhesButton.className = 'btn-details';
                detalhesButton.textContent = 'Ver detalhes';
                acoesCell.appendChild(detalhesButton);
                row.appendChild(acoesCell);

                // Adiciona a linha à tabela
                tbody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao carregar pedidos. Verifique o console para mais detalhes.');
        });
}

// Chama a função para carregar os pedidos quando a página for carregada
document.addEventListener('DOMContentLoaded', carregarPedidos);
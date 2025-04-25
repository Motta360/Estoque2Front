const API_BASE_URL = 'https://foxen5163.c34.integrator.host/estoqueAPI';

function carregarDetalhesPedido() {
    const urlParams = new URLSearchParams(window.location.search);
    const pedidoId = urlParams.get('id');

    if (!pedidoId) {
        alert('ID do pedido não encontrado na URL.');
        return;
    }

    fetch(`${API_BASE_URL}/pedidos/${pedidoId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar detalhes do pedido: ' + response.status);
            }
            return response.json();
        })
        .then(pedido => {
            document.getElementById('pedido-id').textContent = `Detalhes do Pedido #${pedido.id}`;
            const detalhesDiv = document.getElementById('pedido-detalhes');

            // Cria elementos para exibir os detalhes
            const data = document.createElement('p');
            data.textContent = `Data: ${new Intl.DateTimeFormat('pt-BR').format(new Date(pedido.data))}`;

            const agencia = document.createElement('p');
            agencia.textContent = `Agência: ${pedido.agencia}`;

            const gestorSTD = document.createElement('p');
            gestorSTD.textContent = `Gestor STD: ${pedido.gestorSTD}`;

            const gestorResponsavel = document.createElement('p');
            gestorResponsavel.textContent = `Gestor Responsável: ${pedido.gestorResponsavel}`;

            const fornecedor = document.createElement('p');
            fornecedor.textContent = `Fornecedor: ${pedido.fornecedor}`;

            const dataPrevista = document.createElement('p');
            dataPrevista.textContent = `Data Prevista: ${new Intl.DateTimeFormat('pt-BR').format(new Date(pedido.dataPrevista))}`;

            const email = document.createElement('p');
            email.textContent = `Email: ${pedido.email || 'Não informado'}`;

            const entrada = document.createElement('p');
            entrada.textContent = `Movimento: ${pedido.entrada}`;

            // Parseia os itens
            const itens = JSON.parse(pedido.pedido);
            const listaItens = document.createElement('ul');
            itens.forEach(item => {
                const itemLi = document.createElement('li');
                itemLi.textContent = `${item.name}: ${item.quantidade}`;
                listaItens.appendChild(itemLi);
            });

            // Adiciona os elementos à página
            detalhesDiv.appendChild(data);
            detalhesDiv.appendChild(agencia);
            detalhesDiv.appendChild(gestorSTD);
            detalhesDiv.appendChild(gestorResponsavel);
            detalhesDiv.appendChild(fornecedor);
            detalhesDiv.appendChild(dataPrevista);
            detalhesDiv.appendChild(email);
            detalhesDiv.appendChild(entrada);
            detalhesDiv.appendChild(listaItens);

            // Verifica se o pedido já foi executado
            if (pedido.executado) {
                const botaoExecutar = document.getElementById('executarPedido');
                botaoExecutar.disabled = true;
                botaoExecutar.textContent = 'Pedido Executado';

                const mensagem = document.createElement('p');
                mensagem.textContent = 'Este pedido já foi executado.';
                mensagem.style.color = 'green';
                mensagem.style.fontWeight = 'bold';
                detalhesDiv.appendChild(mensagem);
            } else {
                document.getElementById('executarPedido').addEventListener('click', () => {
                    executarPedido(pedidoId, itens);
                });
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao carregar detalhes do pedido. Verifique o console para mais detalhes.');
        });
}

function executarPedido(pedidoId, itens) {
    console.log('Enviando para:', `${API_BASE_URL}/pedidos/${pedidoId}/executar`);
    console.log('Dados:', JSON.stringify(itens));

    fetch(`${API_BASE_URL}/pedidos/${pedidoId}/executar`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(itens)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(errorData.error || 'Erro ao executar pedido');
            });
        }
        return response.json();
    })
    .then(data => {
        alert(data.message);
        window.location.reload();
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao executar pedido: ' + error.message);
    });
}

document.addEventListener('DOMContentLoaded', carregarDetalhesPedido);
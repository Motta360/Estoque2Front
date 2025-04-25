const API_BASE_URL = 'https://foxen5163.c34.integrator.host/estoqueAPI';
function AdicionarLista(dados) {
    const ul = document.getElementById("lista-itens");
    ul.innerHTML = ""; // Limpa a lista antes de adicionar novos itens

    // Agrupa os itens por categoria
    const itensPorCategoria = {};
    dados.forEach(element => {
        if (!itensPorCategoria[element.categoria]) {
            itensPorCategoria[element.categoria] = [];
        }
        itensPorCategoria[element.categoria].push(element);
    });

    // Ordena as categorias alfabeticamente
    const categoriasOrdenadas = Object.keys(itensPorCategoria).sort();

    // Itera sobre as categorias e cria seções para cada uma
    categoriasOrdenadas.forEach(categoria => {
        // Cria um contêiner para a categoria
        const secaoCategoria = document.createElement('div');
        secaoCategoria.id = categoria.toLowerCase().replace(/ /g, '-'); // Define o ID da seção
        secaoCategoria.classList.add("secao-categoria");

        // Cria um título para a categoria
        const tituloCategoria = document.createElement('h2');
        tituloCategoria.textContent = categoria;
        tituloCategoria.classList.add("categoria-titulo");
        secaoCategoria.appendChild(tituloCategoria);

        // Cria uma lista para os itens da categoria
        const listaItens = document.createElement('ul');
        listaItens.classList.add("lista-itens-categoria");

        // Adiciona os itens da categoria
        itensPorCategoria[categoria].forEach(element => {
            const li = document.createElement('li');
            li.classList.add("item");

            // Cria a imagem do móvel
            const imagem = document.createElement('img');
            imagem.src = element.imgUrl; // URL da imagem
            imagem.alt = element.name; // Texto alternativo
            imagem.classList.add("imagem-movel"); // Adiciona a classe para o efeito de hover
            imagem.style.width = "50px"; // Define o tamanho da imagem
            imagem.style.height = "50px";
            imagem.style.marginRight = "10px"; // Espaçamento entre a imagem e o texto
            
            // Adiciona o evento de clique à imagem para abrir o modal
            imagem.addEventListener('click', function() {
                abrirModal(this);
            });

            // Cria um contêiner para o nome e a quantidade
            const divInfo = document.createElement('div');
            divInfo.classList.add("info-movel");

            // Adiciona o nome do móvel
            const nomeMovel = document.createElement('span');
            nomeMovel.textContent = element.name; // Apenas o nome do móvel
            nomeMovel.setAttribute('data-name', element.name); // Armazena o nome original
            nomeMovel.classList.add("nome-movel");

            // Adiciona a quantidade disponível em estoque
            const quantidadeEstoque = document.createElement('span');
            quantidadeEstoque.textContent = ` (Disponível: ${element.quantidade})`;
            quantidadeEstoque.classList.add("quantidade-estoque");

            // Cria o checkbox
            const buttonCheck = document.createElement('input');
            buttonCheck.type = "checkbox";
            buttonCheck.classList.add("checkbox");

            // Cria o input de texto para a quantidade solicitada
            const inputText = document.createElement('input');
            inputText.type = "text";
            inputText.placeholder = "Quantidade";
            inputText.classList.add("input-text");
            inputText.style.display = "none"; // Inicialmente oculto

            // Adiciona um evento ao checkbox para mostrar/ocultar o input de texto
            buttonCheck.addEventListener('change', function () {
                if (this.checked) {
                    inputText.style.display = "inline-block"; // Mostra o input
                } else {
                    inputText.style.display = "none"; // Oculta o input
                }
            });

            // Adiciona a imagem, o nome, a quantidade em estoque, o checkbox e o input ao li
            divInfo.appendChild(nomeMovel);
            divInfo.appendChild(quantidadeEstoque);
            divInfo.appendChild(buttonCheck);
            divInfo.appendChild(inputText);

            li.appendChild(imagem);
            li.appendChild(divInfo);

            // Adiciona o li à lista de itens da categoria
            listaItens.appendChild(li);
        });

        // Adiciona a lista de itens à seção da categoria
        secaoCategoria.appendChild(listaItens);

        // Adiciona a seção da categoria à lista principal
        ul.appendChild(secaoCategoria);
    });
}
// Função para buscar os móveis da API
function GET() {
    fetch(`${API_BASE_URL}/1/moveis`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na requisição: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            AdicionarLista(data); // Chama a função para adicionar os itens à lista
        })
        .catch(error => {
            console.error('Erro:', error);
        });
}

// Chama a função GET após o carregamento da página
document.addEventListener('DOMContentLoaded', function () {
    GET();
});

function enviarPedido() {
    const itensSelecionados = [];
    const checkboxes = document.querySelectorAll('.checkbox:checked'); // Seleciona todos os checkboxes marcados
    const agencia1 = document.getElementById("Agencia").value.trim();
    const GestorSTD = document.getElementById("GestorSTD").value.trim();
    const GestorR = document.getElementById("GestorR").value.trim();
    const Fornecedor = document.getElementById("Fornecedor").value.trim();
    const DataPrevista = document.getElementById("DataPrevista").value.trim();
    const email = document.getElementById("email").value.trim();
    const Entrada = document.getElementById("I/O").value;

    // Verifica se todos os campos obrigatórios foram preenchidos
    if (!agencia1 || !GestorSTD || !GestorR || !Fornecedor || !DataPrevista || !email) {
        alert('Por favor, preencha todos os campos.');
        return; // Impede o envio do pedido se algum campo estiver vazio
    }

    // Exibe a tela de carregamento
    const loadingScreen = document.getElementById("loadingScreen");
    loadingScreen.style.display = "flex";

    checkboxes.forEach(checkbox => {
        const li = checkbox.parentElement; // Obtém o <li> que contém o checkbox e o input
        const nomeMovel = li.querySelector('.nome-movel').getAttribute('data-name'); // Obtém o nome original
        const inputQuantidade = li.querySelector('.input-text'); // Obtém o input de quantidade
        const quantidade = inputQuantidade.value; // Obtém o valor do input de quantidade

        if (quantidade && !isNaN(quantidade)) { // Verifica se a quantidade é válida
            itensSelecionados.push({
                name: nomeMovel, // Usa o nome original
                quantidade: parseInt(quantidade) // Inclui a quantidade no objeto
            });
        }
    });

    if (itensSelecionados.length > 0) {
        // Cria o objeto de pedido
        const pedido = {
            agencia: agencia1,
            pedido: JSON.stringify(itensSelecionados),
            data: new Date().toISOString(),
            gestorSTD: GestorSTD,
            gestorResponsavel: GestorR,
            fornecedor: Fornecedor,
            dataPrevista: DataPrevista,
            email: email,
            entrada: Entrada
        };
        console.log('Dados do pedido:', pedido);

        // Envia o pedido para a API
        fetch(`${API_BASE_URL}/pedidos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pedido)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao enviar pedido: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            alert('Pedido enviado com sucesso!');
            console.log('Resposta da API:', data);
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Ocorreu um erro ao enviar o pedido. Tente novamente.');
        })
        .finally(() => {
            // Oculta a tela de carregamento, independentemente do resultado
            loadingScreen.style.display = "none";
        });
    } else {
        alert('Nenhum item selecionado ou quantidade inválida.');
        // Oculta a tela de carregamento se não houver itens selecionados
        loadingScreen.style.display = "none";
    }
}
// Adiciona um evento de clique ao botão "Pedir"
document.getElementById('btnPedir').addEventListener('click', enviarPedido);


function abrirModal(imagem) {
    const modal = document.getElementById("myModal");
    const modalImg = document.getElementById("img01");

    modal.style.display = "block";
    modalImg.src = imagem.src;

    // Fecha o modal quando o usuário clica no botão de fechar
    const span = document.getElementsByClassName("close")[0];
    span.onclick = function() {
        modal.style.display = "none";
    }

    // Fecha o modal quando o usuário clica fora da imagem
    modal.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }
}

// Adiciona o evento de clique às imagens dos móveis
document.addEventListener('DOMContentLoaded', function () {
    const imagens = document.querySelectorAll('.imagem-movel');
    imagens.forEach(imagem => {
        imagem.addEventListener('click', function() {
            abrirModal(this);
        });
    });
});
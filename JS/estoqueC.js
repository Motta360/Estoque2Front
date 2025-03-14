const API_BASE_URL = 'http://localhost:8080';

GET()
// Função para preencher a tabela com os dados da API
function preencherTabela(dados) {
    const tbody = document.getElementById("tabela");

    dados.forEach(item => {
        const tr = document.createElement('tr');

        const tdNome = document.createElement('td');
        tdNome.textContent = item.name;

        const tdQuantidade = document.createElement('td');
        tdQuantidade.textContent = item.quantidade;

        const tdAcao = document.createElement('td');
        const botaoDeletar = document.createElement('button');
        botaoDeletar.textContent = 'Deletar';
        botaoDeletar.classList.add('deletar');
        botaoDeletar.onclick = () => deleted(item.name);

        tr.appendChild(tdNome);
        tr.appendChild(tdQuantidade);
        tr.appendChild(tdAcao);

        tbody.appendChild(tr);
    });
}
function deleted(movel) {
    fetch(`${API_BASE_URL}/1/delete/` + movel, { method: 'DELETE' })
        .then(response => {
            if (!response.ok) { 
                throw new Error('Erro na requisição: ' + response.status);
            }
            return response.json(); 
        })
        .then(data => {
            console.log(data); 
            window.location.reload(); 
        })
        .catch(error => {
            console.error('Erro:', error);
        });
}

function GET() {
fetch(`${API_BASE_URL}/1/moveis`)
.then(response => {
    if (!response.ok) {
        throw new Error('Erro na requisição: ' + response.status);
    }
    return response.json(); 
})
.then(data => {
    preencherTabela(data);
})
.catch(error => {
    console.error('Erro:', error);
});

}
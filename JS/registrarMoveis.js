const API_BASE_URL = 'http://localhost:8080';
async function Post() {
    const nome = document.getElementById('Nome').value;
    const quantidade = document.getElementById('Quantidade').value;
    const categoria = document.getElementById('Categoria').value;
    const imagem = document.getElementById('imagem').files[0];

    // Verifica se uma imagem foi selecionada
    if (!imagem) {
        alert('Por favor, selecione uma imagem.');
        return;
    }

    // Verifica se o arquivo é uma imagem
    if (!imagem.type.startsWith('image/')) {
        alert('Por favor, selecione um arquivo de imagem válido (JPEG, PNG, etc.).');
        return;
    }

    // Cria um FormData para enviar a imagem
    const formData = new FormData();
    formData.append('file', imagem);

    try {
        // Faz o upload da imagem
        const uploadResponse = await fetch(`${API_BASE_URL}/api/images/upload`, {
            method: 'POST',
            body: formData
        });

        if (!uploadResponse.ok) {
            throw new Error('Erro ao fazer upload da imagem: ' + uploadResponse.status);
        }

        // Obtém a URL da imagem
        const imageUrl = await uploadResponse.text();

        // Cria o objeto móvel com a URL da imagem
        const movel = {
            name: nome,
            quantidade: parseInt(quantidade),
            categoria: categoria,
            imgUrl: imageUrl
        };

        // Envia o móvel para o backend
        const movelResponse = await fetch(`${API_BASE_URL}/1/moveis/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(movel)
        });

        if (!movelResponse.ok) {
            throw new Error('Erro ao registrar móvel: ' + movelResponse.status);
        }

        const data = await movelResponse.json();
        console.log('Móvel registrado com sucesso:', data);
        alert('Móvel registrado com sucesso!');
        document.getElementById('registrarForm').reset();
    } catch (error) {
        console.error('Erro:', error);
        alert('Ocorreu um erro ao registrar o móvel. Tente novamente.');
    }
}
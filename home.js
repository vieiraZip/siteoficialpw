function abrirTab(event, idTab) {
  let conteudos = document.getElementsByClassName("conteudo")
  let tabs = document.getElementsByClassName("tab-button")

  for (let i = 0; i < conteudos.length; i++) {
    conteudos[i].style.display = 'block';
  }

  for (let i = 0; i < conteudos.length; i++) {
    if (conteudos[i].id !== idTab) {
      conteudos[i].style.display = 'none';
    }
  }

  for (let i = 0; i < tabs.length; i++) {
      tabs[i].classList.remove('ativo')
  }

  
  event.currentTarget.classList.add('ativo')
}

// --------------------------------------Análise Financeira---------------------------------------------
// Funções para obter e salvar dados no localStorage
function obterDadosLocalStorage(chave) {
return JSON.parse(localStorage.getItem(chave)) || [];
}

function salvarDadosLocalStorage(chave, dados) {
localStorage.setItem(chave, JSON.stringify(dados));
}

// Arrays para armazenar os dados do gráfico
let produtos = obterDadosLocalStorage('produtos') || [];
let lucros = obterDadosLocalStorage('lucros') || [];

// Obtém o contexto do gráfico
const ctx = document.getElementById('grafico1').getContext('2d');

// Cria o gráfico de barra inicial
const grafico1 = new Chart(ctx, {
type: 'bar',
data: {
  labels: produtos,
  datasets: [{
    label: 'Lucro por Produto',
    data: lucros,
    backgroundColor: '#ffffff',
    borderColor: '#2b4c7e',
    borderWidth: 1,
  }]
},
options: {
  scales: {
    y: {
      beginAtZero: true
    }
  }
}
});

// Função anônima para adicionar um produto e seu lucro
const adicionarProduto = function() {
const productSelect = document.getElementById('productSelect');
const productName = productSelect.options[productSelect.selectedIndex].text;
const productProfit = parseFloat(document.getElementById('productProfit').value);

// Validação simples
if (isNaN(productProfit) || productProfit <= 0) {
  alert('Por favor, insira um valor válido para o lucro do produto.');
  return;
}

// Adiciona os dados aos arrays
produtos.push(productName);
lucros.push(productProfit);

// Salva os dados no localStorage
salvarDadosLocalStorage('produtos', produtos);
salvarDadosLocalStorage('lucros', lucros);

// Atualiza a tabela
atualizarTab();

// Atualiza os dados do gráfico
grafico1.data.labels = produtos;
grafico1.data.datasets[0].data = lucros;

// Atualiza o gráfico
grafico1.update();

// Limpa os campos do formulário
document.getElementById('productProfit').value = '';
};

// Função anônima para remover um produto
const removerProduto = function(index) {
console.log('Removendo produto no índice:', index);
produtos.splice(index, 1);
lucros.splice(index, 1);

// Salva os dados no localStorage
salvarDadosLocalStorage('produtos', produtos);
salvarDadosLocalStorage('lucros', lucros);

// Atualiza a tabela
atualizarTab();

console.log('Dados após a remoção:', produtos, lucros);

// Atualiza os dados do gráfico
grafico1.data.labels = produtos;
grafico1.data.datasets[0].data = lucros;

// Atualiza o gráfico
grafico1.update();
};


// Função para atualizar a tabela
function atualizarTab() {
const tabela = document.getElementById('tabela-produtos');
const tbody = tabela.querySelector('tbody');

// Limpa as linhas existentes
tbody.innerHTML = '';

// Adiciona as novas linhas
produtos.forEach((produto, index) => {
const row = tbody.insertRow();
row.insertCell(0).textContent = produto;
row.insertCell(1).textContent = lucros[index].toFixed(2);

// Adiciona botão de exclusão com ícone
const cellAcoes = row.insertCell(2);
const iconExcluir = document.createElement('i');
iconExcluir.classList.add('fas', 'fa-trash-alt');
iconExcluir.style.cursor = 'pointer';
iconExcluir.style.color = '#2b4c7e';
iconExcluir.title = 'Excluir';
iconExcluir.onclick = function() {
removerProduto(index);
};
cellAcoes.appendChild(iconExcluir);
});
}

// --------------------------------------Relatórios Financeiros---------------------------------------------
function gerarRelatorio() {
      var mesIndex = document.getElementById('mes-relatorio').selectedIndex;
      var anoIndex = document.getElementById('ano-relatorio').selectedIndex;
      var fornecedorIndex = document.getElementById('fornecedor-relatorio').selectedIndex;

      var mes = document.getElementById('mes-relatorio').options[mesIndex].text;
      var ano = document.getElementById('ano-relatorio').options[anoIndex].value;
      var fornecedor = document.getElementById('fornecedor-relatorio').options[fornecedorIndex].value;

      var docDefinition = {
        content: [
          { text: 'Relatório Financeiro', style: 'header' },
          { text: `Mês: ${mes}`, margin: [0, 10] },
          { text: `Ano: ${ano}`, margin: [0, 5] },
          { text: `Fornecedor: ${fornecedor}`, margin: [0, 5] }
        ],
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            margin: [0, 0, 0, 10],
            color: '#2b4c7e'
          }
        }
      };

      pdfMake.createPdf(docDefinition).download('relatorio.pdf');
      alert(`Relatório Gerado:\n\nMês: ${mes}\nAno: ${ano}\nFornecedor: ${fornecedor}`);
    }

//---------------------------------------Controle de Fluxo de Caixa-------------------------------------
// Array para armazenar as transações
const transacoes = obterTransacoesDoLocalStorage();

// Função para adicionar transações
function adicionarTransacao() {
  const valorInput = document.getElementById('valor');
  const tipoInput = document.getElementById('tipo');

  const valor = parseFloat(valorInput.value);
  const tipo = tipoInput.value;

  // Validação simples
  if (isNaN(valor) || valor <= 0) {
    alert('Por favor, insira um valor válido.');
    return;
  }

  const data = new Date();
  const descricao = tipo === 'entrada' ? 'Recebimento' : 'Pagamento';
  const saldoAnterior = transacoes.length > 0 ? transacoes[transacoes.length - 1].saldo : 0;
  const saldo = tipo === 'entrada' ? saldoAnterior + valor : saldoAnterior - valor;

  const transacao = {
    data: data.toLocaleDateString(),
    descricao,
    tipo,
    valor,
    saldo
  };

  transacoes.push(transacao);

  // Atualiza a tabela e o gráfico
  atualizarTabela();
  atualizarGrafico();
  
  // Salva as transações no localStorage
  salvarTransacoesNoLocalStorage(transacoes);

  // Limpa os campos do formulário
  valorInput.value = '';
  tipoInput.value = 'entrada';
}

// Função para obter transações do localStorage ou inicializar se não existirem
function obterTransacoesDoLocalStorage() {
  return JSON.parse(localStorage.getItem('transacoes')) || [];
}

// Função para salvar transações no localStorage
function salvarTransacoesNoLocalStorage(transacoes) {
  localStorage.setItem('transacoes', JSON.stringify(transacoes));
}

// Função para remover uma transação
function removerTransacao(index) {
  transacoes.splice(index, 1);

  // Atualiza a tabela e o gráfico
  atualizarTabela();
  atualizarGrafico();

  // Salva as transações no localStorage
  salvarTransacoesNoLocalStorage(transacoes);
}

// Função anônima para atualizar a tabela de transações
const atualizarTabela = function() {
  const tabela = document.getElementById('tabela-transacoes');
  const tbody = tabela.querySelector('tbody');

  // Limpa as linhas existentes
  tbody.innerHTML = '';

  // Adiciona as novas linhas
  transacoes.forEach((transacao, index) => {
    const row = tbody.insertRow();
    row.insertCell(0).textContent = transacao.data;
    row.insertCell(1).textContent = transacao.descricao;
    row.insertCell(2).textContent = transacao.tipo;
    row.insertCell(3).textContent = transacao.valor.toFixed(2);
    row.insertCell(4).textContent = transacao.saldo.toFixed(2);

    // Adiciona ícone de exclusão
    const cellAcoes = row.insertCell(5);
    const iconExcluir = document.createElement('i');
    iconExcluir.classList.add('fas', 'fa-trash-alt');
    iconExcluir.style.cursor = 'pointer';
    iconExcluir.style.color = '#2b4c7e';
    iconExcluir.title = 'Excluir';
    iconExcluir.onclick = function() {
      removerTransacao(index);
    };
    cellAcoes.appendChild(iconExcluir);
  });
};

// Função para atualizar o gráfico
function atualizarGrafico() {
  const ctx = document.getElementById('grafico2').getContext('2d');
  
  const labels = transacoes.map(transacao => transacao.data);
  const saldos = transacoes.map(transacao => transacao.saldo);

  const data = {
    labels,
    datasets: [{
      label: 'Saldo',
      borderColor: '#567ebb',
      data: saldos,
      fill: false
    }]
  };

  const config = {
    type: 'line',
    data: data
  };

  // Limpa o gráfico antigo
  if (window.myChart) {
    window.myChart.destroy();
  }

  // Cria um novo gráfico
  window.myChart = new Chart(ctx, config);
}

//---------------------------------Histórico de Transações Monetárias----------------------------------


//---------------------------------------SUPORTE---------------------------------------------------------
async function enviarEmail(email) {
  const mensageiro = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: '',
      pass: '',
    },
  });

  try {
    await mensageiro.sendMail({
      from: 'Diana Lina <dianalinafacul@gmail.com>',
      to: email,
      subject: 'Envio teste de e-mail',
      text: 'Se você receber esse e-mail, minha missão foi um sucesso',
    });

    console.log("E-mail enviado com sucesso");
    return true;  // Indica sucesso
  } catch (erro) {
    console.error('Erro ao enviar e-mail:', erro.message);
    throw new Error('Um erro inesperado ocorreu ao enviar o e-mail.');
  }
}

// Função para ser chamada quando o botão for pressionado
async function enviar() {
  let inputElement = document.querySelector('#chat-input input');
  let email = inputElement.value;

  if (email) {
    try {
      await enviarEmail(email);
      alert('E-mail enviado com sucesso!');
    } catch (erro) {
      alert(erro.message);
    }
  } else {
    alert('Por favor, insira um endereço de e-mail válido.');
  }
}

// Adicionar um ouvinte de evento para o botão após o carregamento da página
document.addEventListener('DOMContentLoaded', function() {
  let buttonElement = document.querySelector('#chat-input button');
  buttonElement.addEventListener('click', enviar);
});

class Despesa {
  constructor(ano, mes, dia, tipo, descricao, valor) {
    this.ano = ano;
    this.mes = mes;
    this.dia = dia;
    this.tipo = tipo;
    this.descricao = descricao;
    this.valor = valor;
  }
  validarDados() {
    for (let i in this) {
      if (this[i] == undefined || this[i] == '' || this[i] == null) {
        return false;
      }
    }
    return true;
  }
}

class Bd {
  constructor() {
    let id = localStorage.getItem('id');

    if (id === null) {
      localStorage.setItem('id', 0);
    }
  }
  getproximoId() {
    let proximoId = localStorage.getItem('id');
    return parseInt(proximoId) + 1;
  }

  gravar(d) {
    let id = this.getproximoId();

    localStorage.setItem(id, JSON.stringify(d));

    localStorage.setItem('id', id);
  }

  recuperarTodosRegistros() {
    //array de despesas
    let despesas = Array();

    let id = localStorage.getItem('id');

    //recupera todas as despesas cadastradas em localStorage
    for (let i = 1; i <= id; i++) {
      //recuperar a despesa

      let despesa = JSON.parse(localStorage.getItem(i));

      //existe a possibilidade de haver índices que foram pulados /removidos
      //neste caso nós vamos pular esses índices

      if (despesa === null) {
        continue;
      }

      despesa.id = i;
      despesas.push(despesa);
    }
    return despesas;
  }

  pesquisar(despesa) {
    let despesasFiltradas = Array();

    despesasFiltradas = this.recuperarTodosRegistros();

    console.log(despesa);
    console.log(despesasFiltradas);

    //ano
    if (despesa.ano != '') {
      console.log('Filtro de ano');
      despesasFiltradas = despesasFiltradas.filter((d) => d.ano == despesa.ano);
    }
    //mes
    if (despesa.mes != '') {
      console.log('Filtro de mes');
      despesasFiltradas = despesasFiltradas.filter((d) => d.mes == despesa.mes);
    }
    //dia
    if (despesa.dia != '') {
      console.log('Filtro de dia');
      despesasFiltradas = despesasFiltradas.filter((d) => d.dia == despesa.dia);
    }
    //tipo
    if (despesa.tipo != '') {
      console.log('Filtro de tipo');
      despesasFiltradas = despesasFiltradas.filter(
        (d) => d.tipo == despesa.tipo
      );
    }
    //descricao
    if (despesa.descricao != '') {
      console.log('Filtro de descrição');
      despesasFiltradas = despesasFiltradas.filter(
        (d) => d.descricao == despesa.descricao
      );
    }
    //valor
    if (despesa.valor != '') {
      console.log('Filtro de valor');
      despesasFiltradas = despesasFiltradas.filter(
        (d) => d.valor == despesa.valor
      );
    }
    return despesasFiltradas;
  }

  remover(id) {
    localStorage.removeItem(id);
  }
}

let bd = new Bd();

function cadastrarDespesa() {
  let ano = document.getElementById('ano');
  let mes = document.getElementById('mes');
  let dia = document.getElementById('dia');
  let tipo = document.getElementById('tipo');
  let descricao = document.getElementById('descricao');
  let valor = document.getElementById('valor');

  function sucessoModal() {
    let smodal = document.getElementById('ModalRegistraDespesaLabel');
    let smodalDiv = document.getElementById('ModalRegistraDespesaLabelDiv');
    let sbodyModal = document.getElementById('bodyModal');
    let sbtnModal = document.getElementById('btnModal');

    smodalDiv.className = 'modal-header text-success';
    smodal.textContent = 'Registro Inserido com sucesso';
    sbodyModal.textContent = 'Cadastro de despesas realizados com sucesso';
    sbtnModal.className = 'btn btn-success';
    sbtnModal.textContent = 'Voltar';
  }

  function FalhaModal() {
    let fmodal = document.getElementById('ModalRegistraDespesaLabel');
    let fmodalDiv = document.getElementById('ModalRegistraDespesaLabelDiv');
    let fbodyModal = document.getElementById('bodyModal');
    let fbtnModal = document.getElementById('btnModal');

    fmodalDiv.className = 'modal-header text-danger';
    fmodal.textContent = 'Erro na gravação';
    fbodyModal.textContent =
      'Existem campos obrigatórios que não foram preenchidos';
    fbtnModal.className = 'btn btn-danger';
    fbtnModal.textContent = 'Voltar e corrigir';
  }

  function limpaCampos() {
    ano.value = '';
    mes.value = '';
    dia.value = '';
    tipo.value = '';
    descricao.value = '';
    valor.value = '';
  }

  let despesa = new Despesa(
    ano.value,
    mes.value,
    dia.value,
    tipo.value,
    descricao.value,
    valor.value
  );

  if (despesa.validarDados()) {
    bd.gravar(despesa);
    //dialog de sucesso
    $('#ModalRegistraDespesa').modal('show');
    sucessoModal();
    limpaCampos();
  } else {
    //dialog de erro
    $('#ModalRegistraDespesa').modal('show');
    FalhaModal();
  }
}

function carregaListaDespesas(despesas = Array(), filtro = false) {
  if (despesas.length == 0 && filtro == false) {
    despesas = bd.recuperarTodosRegistros();
  }

  //Selecionando o elemento Tbody da tabela
  let listaDespesas = document.getElementById('listaDespesas');
  listaDespesas.innerHTML = '';

  //Percorrer o array despesas, listando cada despesa de forma dinâmica
  despesas.forEach(function (d) {
    //criando a Linha (tr)
    let linha = listaDespesas.insertRow();

    //criar as colunas(td)
    linha.insertCell(0).innerHTML = `${d.dia} / ${d.mes} / ${d.ano}`;
    //ajustar o tipo

    switch (parseInt(d.tipo)) {
      case 1:
        d.tipo = 'Alimentação';
        break;
      case 2:
        d.tipo = 'Educação';
        break;
      case 3:
        d.tipo = 'Lazer';
        break;
      case 4:
        d.tipo = 'Saúde';
        break;
      case 5:
        d.tipo = 'Transporte';
        break;
    }

    linha.insertCell(1).innerHTML = d.tipo;
    linha.insertCell(2).innerHTML = d.descricao;
    linha.insertCell(3).innerHTML = d.valor;

    //Criar o botão de exclusão
    let btn = document.createElement('button');
    btn.className = 'btn btn-danger';
    btn.innerHTML = '<i class="fas fa-times"></i>';
    btn.id = `id_despesa_${d.id}`;
    btn.onclick = function () {
      let emodal = document.getElementById('ModalRemoveDespesaLabel');
      let emodalDiv = document.getElementById('ModalRemoveDespesaLabelDiv');
      let ebodyModal = document.getElementById('bodyRemoveModal');
      let ebtnModal = document.getElementById('btnRemoveModal');

      emodalDiv.className = 'modal-header text-success';
      emodal.textContent = 'Registro removido com sucesso';
      ebodyModal.textContent = 'Cadastro de despesa removido com sucesso';
      ebtnModal.className = 'btn btn-success';
      ebtnModal.textContent = 'Voltar';
      //dialog de remoção
      $('#ModalRemoveDespesa').modal('show');

      //remover a despesa
      let id = this.id.replace('id_despesa_', '');
      bd.remover(id);
    };
    linha.insertCell(4).append(btn);

    console.log(d);
  });
}

function pesquisarDespesa() {
  let ano = document.getElementById('ano').value;
  let mes = document.getElementById('mes').value;
  let dia = document.getElementById('dia').value;
  let tipo = document.getElementById('tipo').value;
  let descricao = document.getElementById('descricao').value;
  let valor = document.getElementById('valor').value;

  let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor);

  let despesas = bd.pesquisar(despesa);

  this.carregaListaDespesas(despesas, true);
}

$(document).ready(function(){
    const ipc = require ('electron').ipcRenderer; 
    const app = require('electron').remote.App;
    const {remote} = require('electron');
    var indexDetail;
    var veiculos;

    $.getJSON("../data/veiculos.json", (data) => {
        veiculos = data;
    })

    ipc.on('detailVeiculo', (event, veiculo, index) => {
        indexDetail = index;
        for(i = 0; i < veiculo.acoes.length; i++){
            newActionRow(veiculo.acoes[i].descricao, veiculo.acoes[i].data, veiculo.acoes[i].kilometragem, veiculo.acoes[i].observacao);
        }
    });

    ipc.on('addNewAction', (event, acao, data, kilometragem, observacao) => {
        newActionRow(acao, data, kilometragem, observacao);
        veiculos[indexDetail].acoes.push({descricao: acao, data:data,kilometragem:kilometragem,observacao:observacao});
        saveVeiculos();
    });

    $('#btnMinus').click(function(){
        remote.BrowserWindow.getFocusedWindow().minimize();
    });
    
    $('#btnCancel').click(function(){
        remote.BrowserWindow.getFocusedWindow().close();
    });
    
    $('#btnPlus').click(function(){
        if(remote.BrowserWindow.getFocusedWindow().isMaximized()){
            remote.BrowserWindow.getFocusedWindow().restore();
        }
        else
            remote.BrowserWindow.getFocusedWindow().maximize();
    });

    $('#btnBack').click(function(){
        ipc.send('changePage');
    });


    $('#btnAddAction').click(function(){
        ipc.send('showAddActiondetail');
     });

     function newActionRow(descricao, data, kilometragem, observacao){
        var newRow = document.createElement("tr");
        var newColumnDescricao = document.createElement("td");
        var newColumnData = document.createElement("td");
        var newColumnKilometragem = document.createElement("td");
        var newColumnObservacao = document.createElement("td");
        var newDeleteBtn = document.createElement("td");
        newDeleteBtn.addEventListener('click', () => clickExcludeCar(newDeleteBtn));
        var span = document.createElement("a");
        span.classList.add('btnExclude');
        span.innerHTML = "Remover";
        newColumnDescricao.innerHTML = descricao;
        newColumnData.innerHTML = data;
        newColumnKilometragem.innerHTML = kilometragem;
        newColumnObservacao.innerHTML = observacao;
        newRow.append(newColumnDescricao, newColumnData, newColumnKilometragem, newColumnObservacao);
        newDeleteBtn.append(span);
        newRow.append(newDeleteBtn);
        $('#bodyTable').append(newRow);
     }

     function saveVeiculos(){
            ipc.send('saveVeiculos', veiculos);
     }

     function clickExcludeCar(sender){
         veiculos[indexDetail].acoes = veiculos[indexDetail].acoes.filter((acoes) => acoes != veiculos[indexDetail].acoes[sender.parentElement.rowIndex - 1]);
         sender.parentElement.remove();
         saveVeiculos();
     }

});
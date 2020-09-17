$(document).ready(function(){
    const ipc = require ('electron').ipcRenderer; 
    const app = require('electron').remote.App;
    const {remote} = require('electron');
    const fs = require("fs");
    var veiculos; 

    $.getJSON("../data/veiculos.json", (data) => {
        veiculos = data;
        for(i = 0; i < data.length; i++){
            newVeiculo(data[i].modelo, data[i].placa);
        }
    })

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

    ipc.on('resposta', (event, modelo, placa) => {
        if(modelo!=='' && placa!==''){
            var veiculo = {modelo: modelo, placa: placa, acoes: []};
            veiculos.push(veiculo);
            saveVeiculos();
            newVeiculo(modelo, placa);
        }
        
    });


    $('#btnAddCar').click(function(){
        ipc.send('showAddCarDetail');
     });

     function newVeiculo(modelo, placa){
        var newRow = document.createElement("tr");
        var newColumnName = document.createElement("td");
        var newColumnPlaca = document.createElement("td");
        var newDeleteBtn = document.createElement("td");
        newColumnName.addEventListener('click', () => clickOpenDetail(newColumnName));
        newColumnPlaca.addEventListener('click', () => clickOpenDetail(newColumnPlaca));
        newDeleteBtn.addEventListener('click', () => clickExcludeCar(newDeleteBtn));
        var span = document.createElement("a");
        span.classList.add('btnExclude');
        span.innerHTML = "Remover";
        newColumnName.innerHTML = modelo;
        newColumnPlaca.innerHTML = placa;
        newRow.append(newColumnName);
        newRow.append(newColumnPlaca);
        newDeleteBtn.append(span);
        newRow.append(newDeleteBtn);
        $('#bodyTable').append(newRow);
     }

     function saveVeiculos(){
            ipc.send('saveVeiculos', veiculos);
     }

     function clickExcludeCar(sender){
         veiculos = veiculos.filter((veiculo) => veiculo != veiculos[sender.parentElement.rowIndex - 1]);
         sender.parentElement.remove();
         saveVeiculos();
     }

     function clickOpenDetail(sender){
        ipc.send('detailVeiculo', veiculos[sender.parentElement.rowIndex - 1], [sender.parentElement.rowIndex - 1]);
        
    }

});
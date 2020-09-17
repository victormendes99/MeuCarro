$(document).ready(function(){
    const ipc = require ('electron').ipcRenderer; 
    const app = require('electron').remote.App;
    const {remote} = require('electron');

    $('#btnOk').click(function(){
        ipc.send('resposta', document.getElementById("modelo").value, document.getElementById("placa").value);
        remote.BrowserWindow.getFocusedWindow().hide();
        
    });
});
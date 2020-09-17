$(document).ready(function(){
    const ipc = require ('electron').ipcRenderer; 
    const app = require('electron').remote.App;
    const {remote} = require('electron');

    $('#btnOk').click(function(){
        ipc.send('addNewAction', document.getElementById("acao").value, document.getElementById("data").value, document.getElementById("kilometragem").value, document.getElementById("observacao").value);
        remote.BrowserWindow.getFocusedWindow().hide();
        
    });
});
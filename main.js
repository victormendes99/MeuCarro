const { app, BrowserWindow } = require('electron')
const ipc = require ('electron').ipcMain; 
const fs = require("fs");
function createWindow () {
  // Cria uma janela de navegação.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  })

  const child = new BrowserWindow({
    width: 600,
    height: 500,
    frame: false,
    modal: true,
    parent: win,
    show:false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
    
    
  })
  
  //child.webContents.openDevTools();
  // e carrega o arquivo index.html do seu aplicativo.
  win.loadFile('./view/index.html')
  child.loadFile('./view/popupAddCar.html')
  
  ipc.on('resposta', (event, modelo, placa)=>{
    win.webContents.send('resposta', modelo, placa);
  });

  ipc.on('addNewAction', (event, acao, data, kilometragem, observacao)=>{
    win.webContents.send('addNewAction', acao, data, kilometragem, observacao);
  });

  ipc.on('detailVeiculo', (event, veiculo, index)=>{
    win.reload();
    win.loadFile('./view/carDetail.html');
    setTimeout(() => win.webContents.send('detailVeiculo', veiculo, index),100);
  });
  ipc.on('saveVeiculos', (event, veiculos)=>{
      fs.writeFile('./data/veiculos.json', JSON.stringify(veiculos), function(err, result) {
         if(err) console.log('error', err);
       });
  });

  ipc.on('changePage', () => {
    win.reload();
    win.loadFile('./view/index.html');
  })

  ipc.on('showAddActiondetail', () => {
    child.loadFile('./view/popupAddAction.html');
    child.show();
  })
    
  ipc.on('showAddCarDetail', () => {
    child.loadFile('./view/popupAddCar.html');
    child.show();
  })
  
}




app.whenReady().then(createWindow)
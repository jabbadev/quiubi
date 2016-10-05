console.log('load quiubi.js ...')
var port = null;
var mediator = null;
var target = null;

var Target = {
	target: null,
	getInstance: function(url,TargetImp,onTargetReady){	
		if(!this.target){
			this.target = new TargetImp(url,onTargetReady);	
			return this.target;
		}
		return target;
	},
	attachPort: function(port){
		this.target.attachPort(port);
	}
};

var Quiubi = function(url,onTagerReady){
	this.iframe = null;
	this.port = null;
	this.targetReady = false;
	this.url = url;
	this.onTagerReady = onTagerReady;
	
	var self = this;
	
	this.attachPort = function(port){
		if( port.name="quiubi" ){
			this.port = port;
		}
		if ( this.iframe && this.port && !this.targetReady ){
			this.onTagerReady(this);
		}
	};
	
	this.login = function(user,password,onAuthComplete){
		console.log('login for [%s]',user);
		this.port.postMessage({
			operation: 'login',
			options:{ user:user,password:password }
		});
		
		this._onTargetReady = function(){
			
			console.log('login complete _onTargetReady')
			
			this.isUserLogged(user,function(loginStatus){
				onAuthComplete(loginStatus);
			});
		}; 
	};
	
	this.logout = function() {
		this.port.postMessage({
			operation: 'logout'
		});
	}
	
	this.isUserLogged = function(user,onResponse){
		this._userLoggedHandler = onResponse;
		
		console.log('post isUserLogged',this.port)
		this.port.postMessage({
			operation: 'isUserLogged',
			options: user
		});
	};
	
	this.userLoggedHandler = function(loginStatus){
		this._userLoggedHandler(loginStatus);
	};
	
	this.saldo = function(onSaldo){
		var self = this;
		this._saldoHandler = onSaldo;
		
		this.port.postMessage({
			operation: 'accessToMovimentiCC'
		});
		
		this._onTargetReady = function(){
			console.log('now in movimenti cc');
			self.port.postMessage({
				operation: 'saldo'
			});
		};
	};
	
	this.movimeti = function(giorni,onMovimenti){
		
		this.port.postMessage({
			operation: 'accessToMovimentiCC'
		});
		
		this._onTargetReady = function(){
			console.log('now in movimenti cc');
			console.log('vado a Ricerca avanzata ');
			this.port.postMessage({
				operation: 'accessToRicAdvMovCC'
			});
		};
		
		this._onRicercaAvanzata = function(){
			console.log('imposta in ricerca avanzata');
			this.port.postMessage({
				operation: 'impostaRicerca',
				options: {giorni: giorni}
			})
		};
		
		this.port.postMessage({operation:"accessToRicAdvMovCC"});
	};
	
	this.ricAdvMovCCHandler = function(){
		this._onRicercaAvanzata();
	};
	
	this.saldoHandler = function(saldo){
		this._saldoHandler(saldo);
	};
	
	this.onTargetReloaded = function(){
		console.log('implement target reloaded ...');
		this._onTargetReady();
	};
	
	/* Constructure code */ 
	this.iframe = document.getElementById('target');
	//quf.src = "https://www.quiubi.it/page/qui-ubi/";
	this.iframe.src = this.url;
	this.iframe.onload= function(){
		if(self.targetReady){
			console.info('target reloaded ...');
			self.onTargetReloaded();
		}
		else {
			if ( self.iframe && self.port ){
				self.targetReady = true;
				self.onTagerReady(self);
			}
		}
	};
	
};

chrome.webRequest.onCompleted.addListener(
	function(details) {
		if(details.url == "https://www.quiubi.it/qubictx/block/send-receive-updates" ){
			//target.ricAdvMovCCHandler();
		}
	},
	{urls: ["https://www.quiubi.it/qubictx/block/send-receive-updates"]},[]
);

chrome.runtime.onConnect.addListener(function(port){
   if( port.name="quiubi" ){
	   console.log("mediator [%s] connected ...",port.name);
	   target.attachPort(port);
	   
	   port.onMessage.addListener(function(message){
		   console.log('message from target: ',message)
		   if ( message.operation == "userLoggedHandler" ) target.userLoggedHandler(message.options);
		   if ( message.operation == "saldoHandler" ) target.saldoHandler(message.options);  
	   });
   }
});


chrome.browserAction.onClicked.addListener(function(){
	target = Target.getInstance("https://www.ubibanca.com/",Quiubi,function(target){
		console.log('target ready ',target);
	});
});

document.addEventListener('DOMContentLoaded', function () {	
	console.log('dom ready');
});
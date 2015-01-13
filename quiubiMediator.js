
var port = chrome.runtime.connect({name:"quiubi"});

var Operation = function(){
	var self = this;
	this.login = function(userCredential){
		console.info('execute login');
		var errorBox = document.getElementById("ERRORSDIV");
		console.log('prima: ',errorBox.innerText);
		
		var user = document.getElementById("quiubi_user");
		user.value = userCredential.user;
		var user = document.getElementById("quiubi_password");
		user.value = userCredential.password;
		
		var subMit = document.querySelector('#entra a');
		var clickEvent = new MouseEvent('click', {
		    'view': window,
		    'bubbles': true,
		    'cancelable': true
		  });
		subMit.dispatchEvent(clickEvent);
		
		self._onLoad = function(){
			var errorBox = document.getElementById("ERRORSDIV");
			console.log('dopo: ',errorBox.innerText);
		};
	};
	
	this.isUserLogged = function(){
		var errorBox = document.getElementById("ERRORSDIV");
		console.log('dopo: ',errorBox.innerText);
	};
	
	this._onLoad = function(){console.log('onLoad vuota');};
	
	this.onLoad = function(){
		console.log('fire operation onLoad');
		this._onLoad();
	};
};

var operation = new Operation();

var MsgHandler = function(port){
	var self = this; 
	port.onMessage.addListener(function(message){self.handleMessage(message);});
	
	this.handleMessage = function(message){
		if ( message.operation == "login" ) operation.login(message.options);
		if ( message.operation == "isUserLogged" ) operation.isUserLogged();
		
	};
};

var mh = new MsgHandler(port);

window.onload = function(){
	console.log('fire on load ...');
	operation._onLoad();
};



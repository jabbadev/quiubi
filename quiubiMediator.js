
var port = chrome.runtime.connect({name:"quiubi"});

var Operation = function(){
	this.login = function(userCredential){
		console.info('execute login');
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
	};
	
	this.isUserLogged = function(){
		var errorBox = document.getElementById("ERRORSDIV");
		console.log(errorBox.innerText);
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

chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
	mh.handle(message,sendResponse);
});
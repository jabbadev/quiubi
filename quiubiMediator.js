
var port = chrome.runtime.connect({name:"quiubi"});

var Operation = function(){
	this.login = function(user,password,onComlete,onError){
		console.info('exec login');
	};
};

var qo = new Operation();

var MsgHandler = function(port){
	var self = this; 
	port.onMessage.addListener(function(message){self.handleMessage(message);});
	
	this.handleMessage = function(message){
		console.info('handle [%s] login operation',message.operation);
		var user = document.getElementById("quiubi_user");
		user.value = message.options.user;
		var user = document.getElementById("quiubi_password");
		user.value = message.options.password;
		
		var subMit = document.querySelector('#entra a');
		var clickEvent = new MouseEvent('click', {
		    'view': window,
		    'bubbles': true,
		    'cancelable': true
		  });
		subMit.dispatchEvent(clickEvent);
	};
};

var mh = new MsgHandler(port);

chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
	mh.handle(message,sendResponse);
});
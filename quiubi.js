var port = null;
var mediator = null;
var target = null;

var Target = {
	target: null,
	getInstance: function(url,TargetImp){
		
		if(!this.target){
			this.target = new TargetImp();	
			return this.target;
		}
		return target;
	}
};

var Quiubi = function(url){
	this.iframe = null;
	this.mediator = null;
	this.url = url;
	
	this.attachTarget = function(){
		var self = this;
		
		this.iframe = document.getElementById('target');
		//quf.src = "https://www.quiubi.it/page/qui-ubi/";
		this.iframe.src = this.url;
		this.iframe.onload= function(){
			if(self.mediator){
				console.info('target reloaded ...');
				self.onTargetReloaded();
			}
			else {
				console.info('target ready ...');
				self.mediator = mediator;
				console.info('mediator ready ...',self.mediator);
			}
		};
	};
	
	this.login = function(user,password){
		console.log('login for [%s]',user);
		this.mediator.login(user,password);
	};
	
	this.onTargetReloaded = function(){
		console.log('implement target reloaded ...');
		
	};
};

var QuiubiMediator = function(port){
	this.login = function(user,password){
		console.log('login');
		port.postMessage({operation: 'login',
						  options:{ user:user,password:password }
						 });
	};
};

chrome.runtime.onConnect.addListener(function(port){
   if( port.name="quiubi" ){
	   console.log("mediator [%s] connected ...",port.name);
	   mediator = new QuiubiMediator(port);
   }
});

chrome.browserAction.onClicked.addListener(function(){
	target = Target.getInstance("https://www.quiubi.it/page/qui-ubi/",Quiubi);
	target.attachTarget();
	/*
	quf = document.getElementById('quiubiFrame');
	quf.src = "https://www.quiubi.it/page/qui-ubi/";
	quf.onload= function(){	
		mediator.login('fra','123456');
	};
	*/
});

document.addEventListener('DOMContentLoaded', function () {	
	console.log('dom ready');
});
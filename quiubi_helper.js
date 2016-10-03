
var UbiHelper = function(){
	
	this.dispachMessage = function(message){
		
		msg = message.data;
		
		console.log('dispatch message: ',msg.operation);
		console.log('angular: ',angular)
		
		if ( msg.operation == "_login"){
			
			var userCredential = msg.options
			
			var t = setInterval(function(){
    		var inputAccessoCliente = document.getElementById("toggle2");
			var formAccessoCliente = inputAccessoCliente.parentElement;
			if ( formAccessoCliente.className == "ng-pristine ng-valid") {
				console.log('button ready ...');
				clearTimeout(t);

				var clickEvent = new MouseEvent('click', {
				  'view': window,
		  		  'bubbles': true,
				  'cancelable': true
			    });
			    inputAccessoCliente.dispatchEvent(clickEvent);

                var t1 = setInterval(function(){
                	var loginBox = document.getElementsByClassName("ubi-login-menu-area")[0];
                	if ( loginBox.className == "ubi-login-menu-area" ){
						clearTimeout(t1);
						console.log('login box ready ...')
						var user = document.getElementById("login_codice_cliente");
						console.log('user box: ',user)
						user.value = userCredential.user;
						console.log('value ',user.value)
						var password = document.getElementById("login_psw");
						password.value = userCredential.password;
						console.log(document.getElementById("login_psw").value);

						
						//window.postMessage({ operation: "submitLogin" },"*");
						
						//list = document.getElementsByTagName('script');
						//for(i=0; i<list.length-1; i++) {console.log(list[i].src)};
						
						var subMit = document.getElementById('btnEntraPrivatiAffari');
						console.log('button: ',subMit)
						var clickEvent = new MouseEvent('click', {
							'view': window,
							'bubbles': true,
							'cancelable': true
						});
						subMit.dispatchEvent(clickEvent);
						console.log('submit login')
						
                	}
                },1);
			}
			else {
				console.log('button non ready')
			}
		  },1);
			
		}
	};
};


var ubiHelper = new UbiHelper();

window.addEventListener("message", ubiHelper.dispachMessage, false);


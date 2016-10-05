
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
						
						var $scope = angular.element('#login_codice_cliente').scope();
						$scope.login.login_codice_cliente = userCredential.user;
						$scope.login.login_psw = userCredential.password;
						angular.element('#btnEntraPrivatiAffari').trigger('click');	
                	}
                },1);
			}
		  },1);
			
		}
		
		if (msg.operation == "_logout") {
			angular.element('button[ng-click="doLogout()"]').trigger('click');
		}
	};
};


var ubiHelper = new UbiHelper();

window.addEventListener("message", ubiHelper.dispachMessage, false);


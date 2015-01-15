
console.log('fire quiubi mediator');
var port = chrome.runtime.connect({name:"quiubi"});
port.onMessage.addListener(function(message){
	if ( message.operation == "login" ) operation.login(message.options);
	if ( message.operation == "isUserLogged" ) operation.isUserLogged(message.options);
	if ( message.operation == "accessToMovimentiCC" ) operation.accessToMovimentiCC();
	if ( message.operation == "saldo" ) operation.saldo();
});

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
	
	this.accessToMovimentiCC = function(){
		var hrefMovCC = document.querySelector('a[href="/qubictx/jsp/pages/la_mia_situazione/lista_e_ricerca_movimenti_cc/ricerca_movimenti_cc.jspx?pKy=MovimentiCC"');
		var clickEvent = new MouseEvent('click', {
		  'view': window,
		  'bubbles': true,
		  'cancelable': true
		});
		hrefMovCC.dispatchEvent(clickEvent);
	};
	
	this.saldo = function(){
		var saldo = {
			contabile: document.querySelectorAll('table.saldoTop label[id^="frmContiCorrenti"]')[2].innerText,
			disponibile: document.querySelectorAll('table.saldoCenter label[id^="frmContiCorrenti"]')[2].innerText
		};
		
		port.postMessage({
			operation: "saldoHandler",
			options: saldo
		});
		
	};
	
	this.isUserLogged = function(loggedUser){
		var loginStatus = {status: false, info: "Condizione inattesa"};
		
		var errorMsgBox = document.getElementById("ERRORSDIV");
		
		if( !!errorMsgBox ){
			if ( errorMsgBox.innerText == "Attenzione\n" ){
				loginStatus = { status: false, info: "Utente non loggato" };
			}
			if ( errorMsgBox.innerText == "Attenzione\nAutenticazione fallita (errore generico)"){
				loginStatus = { status: false, info: "Autenticazione fallita" };
			} 
		}
		else {
			var tdList = document.querySelectorAll('div.header  table table tr td');
			var user = (tdList[4].innerText).split(' ')[2];
			if ( user == loggedUser ){
				loginStatus = {status: true, info: "Utente [" + user + " ] correttamente connesso" };
			}
			else {
				loginStatus = { status: false, info: "Autenticazione avvenuta con utente differente" };
			}
		}
		
		port.postMessage({
			operation: "userLoggedHandler",
			options: loginStatus
		});
	};
	
};

var operation = new Operation();

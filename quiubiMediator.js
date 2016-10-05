
console.log('fire quiubi mediator');
var port = chrome.runtime.connect({name:"quiubi"});
port.onMessage.addListener(function(message){
	if ( message.operation == "login" ) operation.login(message.options);
	if ( message.operation == "logout" ) operation.logout(message.options);
	if ( message.operation == "isUserLogged" ) operation.isUserLogged(message.options);
	if ( message.operation == "accessToMovimentiCC" ) operation.accessToMovimentiCC();
	if ( message.operation == "saldo" ) operation.saldo();
	if ( message.operation == "accessToRicAdvMovCC" ) operation.accessToRicAdvMovCC();
	if ( message.operation == "impostaRicerca" ) operation.impostaRicerca(message.options);
});

var Operation = function(){

	var s = document.createElement('script');
	s.src = chrome.extension.getURL('quiubi_helper.js');
	(document.head||document.documentElement).appendChild(s);
	s.onload = function() {
	    s.parentNode.removeChild(s);
	};
	
	
	function formatDate(date){
		return String("00" + date.getDate()).slice(-2) + "/" + String("00" + date.getMonth()+1).slice(-2) + "/" + date.getFullYear();
	}

	this.login = function(userCredential){
		console.info('execute login',userCredential);
		window.postMessage({ operation: "_login", options: userCredential },"*");
	};
	
	this.logout = function(){
		console.info('exec logout');
		window.postMessage({ operation: "_logout" },"*");
	}

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

	this.accessToRicAdvMovCC = function(){

		var hrefRicAdv = document.querySelector('a[id="frmContiCorrenti:panelTabSet:0.1"');
		var clickEvent = new MouseEvent('click', {
		  'view': window,
		  'bubbles': true,
		  'cancelable': true
		});
		hrefRicAdv.dispatchEvent(clickEvent);
	};

	this.isUserLogged = function(loggedUser){

		var loginStatus = {status: false, info: "Condizione inattesa"};
		console.log('qui arrivo ...')
		var fullNameDiv = document.getElementById('owcs-userfullname');
		console.log()
		if (fullNameDiv == null){
			loginStatus = { status: false, info: "Utente non loggato" };
		}
		else {
			var userFullName = fullNameDiv.textContent;
			loginStatus = {
				status: true,
				message: "Utente connesso",
				details: { user: userFullName }
			};
		}
				
		port.postMessage({
			operation: "userLoggedHandler",
			options: loginStatus
		});
	};

	this.impostaRicerca = function(ricOpt){
		var al = new Date();
		var dal = new Date();
		dal.setDate(dal.getDate()-ricOpt.giorni);

		al = formatDate(al);
		dal = formatDate(dal);

		document.querySelector('input[id="frmContiCorrenti:panelTabSet:0:dataDa"]').value = dal;
		document.querySelector('input[id="frmContiCorrenti:panelTabSet:0:dataA"]').value = al;

		document.querySelector(
			'input[id="frmContiCorrenti:panelTabSet:0:selectTipoImporto:_0"]'
		).checked = false;

		document.querySelector(
			'input[id="frmContiCorrenti:panelTabSet:0:selectTipoImporto:_1"]'
		).checked = false;

		document.querySelector(
			'input[id="frmContiCorrenti:panelTabSet:0:selectTipoImporto:_2"]'
		).checked = false;

		var cerca = document.querySelector('div.divActionRight a');
		var clickEvent = new MouseEvent('click', {
			'view': window,
			'bubbles': true,
			'cancelable': true
		});
		cerca.dispatchEvent(clickEvent);
	};

};

var operation = new Operation();

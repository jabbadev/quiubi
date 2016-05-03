
console.log('fire quiubi mediator');
var port = chrome.runtime.connect({name:"quiubi"});
port.onMessage.addListener(function(message){
	if ( message.operation == "login" ) operation.login(message.options);
	if ( message.operation == "isUserLogged" ) operation.isUserLogged(message.options);
	if ( message.operation == "accessToMovimentiCC" ) operation.accessToMovimentiCC();
	if ( message.operation == "saldo" ) operation.saldo();
	if ( message.operation == "accessToRicAdvMovCC" ) operation.accessToRicAdvMovCC();
	if ( message.operation == "impostaRicerca" ) operation.impostaRicerca(message.options);
});

var Operation = function(){

	function formatDate(date){
		return String("00" + date.getDate()).slice(-2) + "/" + String("00" + date.getMonth()+1).slice(-2) + "/" + date.getFullYear();
	}

	this.login = function(userCredential){
		console.info('execute login');

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
						user.value = userCredential.user;
						var password = document.getElementById("login_psw");
						password.value = userCredential.password;

						var subMit = document.getElementById('btnEntraPrivatiAffari');
						var clickEvent = new MouseEvent('click', {
							'view': window,
							'bubbles': true,
							'cancelable': true
						});
						subMit.dispatchEvent(clickEvent);

				  }

				});


			}
			else {
				console.log('button non ready')
			}
		},1);


    /*
		var loginBox = document.getElementsByClassName("ubi-login-menu-area")[0];
		loginBox.className = "ubi-login-menu-area"

    //setTimeout(function () {

    console.log('exec login on login box ....');

		var user = document.getElementById("login_codice_cliente");
		user.value = userCredential.user;
		var password = document.getElementById("login_psw");
		password.value = userCredential.password;

		var subMit = document.getElementById('btnEntraPrivatiAffari');
		var clickEvent = new MouseEvent('click', {
		  'view': window,
  		'bubbles': true,
		  'cancelable': true
	  });
		subMit.dispatchEvent(clickEvent);

		//},3000);
    */
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

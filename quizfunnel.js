console.log('final check 1.42 main');

let urlQuiz = 'quiz';
let urlResultados = 'resultados';
let urlRedirecionando = 'redirecionando';

var content_piece = window.location.host + window.location.pathname;
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
// var content_piece = 'Vídeo 1.0 + Popup Optin';


/* FBQ PURCHASES */

// Purchase por página

if(window.location.href.includes(urlQuiz)) {
  // console.log('fbq track ' + urlQuiz);
  fbq('track', 'Purchase', {currency: 'BRL', value: 5.00, content_name: 'Fez Optin'});
}
if(window.location.href.includes(urlResultados)) {
  // console.log('fbq track ' + urlResultados);
  fbq('track', 'Purchase', {currency: 'BRL', value: 20.00, content_name: 'Preencheu Quiz'});
}
if(window.location.href.includes(urlRedirecionando)) {
  // console.log('fbq track ' + urlRedirecionando);
  fbq('track', 'Purchase', {currency: 'BRL', value: 40.00, content_name: 'Contato WhatsApp'});
}

// Tempo na página
var seconds = 300;
setTimeout(function() {fbq('track', 'Purchase', {currency: 'BRL', value: 60.00, content_name: 'Tempo 5 mins'});}, seconds * 1000);


/* DADOS UTM & REDIRECT */

$(document).ready(()=>{

  // Optin com dados UTM - #optinInicial
  $('#optinInicial button.btn').on('click',()=>{
    $('form').append(`<input type="hidden" name="field[12]" value="${urlParams.get('utm_source')}">`);
    $('form').append(`<input type="hidden" name="field[11]" value="${urlParams.get('utm_campaign')}">`);
    $('form').append(`<input type="hidden" name="field[13]" value="${urlParams.get('utm_term')}">`);
    $('form').append(`<input type="hidden" name="field[15]" value="${urlParams.get('utm_medium')}">`);
    $('form').append(`<input type="hidden" name="field[14]" value="${urlParams.get('utm_content')}">`);
    $('form').append(`<input type="hidden" name="field[16]" value="${content_piece}">`);
    $('form').append(`<input type="hidden" name="field[40]" value="${nomeClinica}">`);

    // Check if email is valid & redirect → /quiz?email=%email%
    if($('input[type="email"]').val().includes('@') && $('input[type="email"]').val().includes('.')) {
      if ($('button').hasClass('optinToQuiz')) {
        setTimeout(()=>{
          window.location.href = window.location.origin + '/quiz?email=' + $('input[type="email"]').val();
        },1000);
      }
    }
  });

  // Redirect Quiz → Resultados
  var checkExist = setInterval(function() {
    // Check if AC form button exists
    if ($('button._submit').length) {
      clearInterval(checkExist);

      // #quizQuestions → /resultados
      $('._form-content button._submit').on('click',()=>{
        // Check if phone contains a numbers, then redirect to /resultados
        if (/\d/.test($('input[id="phone"]').val())) {
          console.log('phone is valid');
          $('form').append(`<input type="hidden" name="field[40]" value="${nomeClinica}">`);
          setTimeout(()=>{
            window.location.href = window.location.origin + '/resultados';
          },1000);
        }
      });
    }
  }, 100); // check every 100ms


  /* PESOS E RESPOSTAS AC */

  if(window.location.href.includes(urlQuiz)) {
    	var soma = 0;
    	//Define os pesos por questão:
    	var pesos = {
        	//"field"
          // Situação Atual
          "21" : {
            //"resposta" : "peso"
            "1" : "5",
            "2" : "20",
            "3" : "5",
            "4" : "10",
            "5" : "5"
          },
          // Incômodos
          "25" : {
            "1" : "5",
            "2" : "5",
            "3" : "5",
            "4" : "5"
          },
          // Motivação
          "26" : {
            "1" : "5",
            "2" : "5",
            "3" : "5",
            "4" : "5"
          },
          // Impedimentos
          "22" : {
            "1" : "0",
            "2" : "10",
            "3" : "10",
            "4" : "15",
            "5" : "15",
            "6" : "20"
          },
          // Finanças
          "23" : {
            "1" : "0",
            "2" : "10",
            "3" : "20"
          },
          // Urgência
          "24" : {
            "1" : "0",
            "2" : "5",
            "3" : "20"
          }
      }
    	let x = true;
      setInterval(()=>{
        	if($('form:visible').length && x){
            	x = false;
            	setTimeout(()=>{
                  $('form').on('submit',()=>{
                    	for(let i in pesos){
                        	if($('input[name*="field['+i+']"]')[1].type == 'radio'){
                            	$('input[name*="field['+i+']"]').each((indice, e)=>{
                                	let value = $('input[name*="field['+i+']"]:checked').val();
                                	if($('input[name*="field['+i+']"]')[indice].value == value){
                                  	soma += parseInt(pesos[i][indice+1]);
                                  }
                              });
                          }
                        	else if($('input[name*="field['+i+']"]')[1].type == 'checkbox'){
                          	$('input[name*="field['+i+']"]:checked').each((indice, e)=>{
                                	let value = e.value;
                                	$('input[name*="field['+i+']"]').each((ind, elem)=>{
                                  	if($('input[name*="field['+i+']"]')[ind].value == value){
                                          soma += parseInt(pesos[i][indice+1]);
                                      }
                                  });
                              });
                          }
                      }
                    	console.log(soma);
                      fbq('track', 'Purchase', {currency: 'BRL', value: soma, content_name: 'Respostas Quiz'});
                  });
              },1000);
          }
      },100);
    }

});

/* SHOW / HIDE CONTENT */

// Show → Hide Content
setTimeout(function() {$('.odnShow').attr("style", "display: none !important")}, 5000);

// Hide → Show Content
setTimeout(function() {$('.odnHide').attr("style", "display: block !important")}, 7000);

// Cookie 365 Days
// if(/(^|;)\s*cookie_lp=/.test(document.cookie)){var divs=document.querySelectorAll(".odnhide");[].forEach.call(divs,function(e){e.style.setProperty("display", "block", "important")})}else document.cookie="cookie_lp=true; max-age=31536000";

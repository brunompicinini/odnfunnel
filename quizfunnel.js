console.log('v1.3.1.3 checkClinica');

// ----------------------
// BASIC VARIABLES
// ----------------------

let urlLead = 'lead';
let urlQuiz = 'quiz';
let urlForm = 'form';
let urlResultados = 'resultados';
let urlRedirecionando = 'redirecionando';

let currentUrl = window.location.host + window.location.pathname;
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

// Form Append function for Active Campaign Forms
function formAppend(formField, inputValue) {
  $('form').append(`<input type="hidden" name="field[` + formField + `]" value="` + inputValue + `">`);
}


// ----------------------
// BASIC FUNCTIONS
// ----------------------

// Verificar se nome da clínica existe
function checkClinica() {
  if (typeof nomeClinica !== 'undefined' && nomeClinica) {
    console.log('Nome da Clínica: ' + nomeClinica);
    formAppend(40, nomeClinica);
  }
  else {
    console.log('Nome da Clínica NÃO estava definido.');
    let nomeClinica = 'Sem clínica';
    console.log(nomeClinica);
    formAppend(40, nomeClinica);
  }
}


// ----------------------
// FBQ PURCHASES
// ----------------------

setTimeout(() => {

  // Verifica ignorePurchase
  if (typeof ignorePurchase !== 'undefined' && ignorePurchase) {
    console.log('ignore Purchase true');
  }

  // Purchase por página
  else {
    console.log('ignore Purchase false');

    // Quiz || Lead = $5 (optin básico)
    if (window.location.href.includes(urlQuiz) || window.location.href.includes(urlLead)) {
      console.log(`fbq Purchase: \$5, Fez Optin. URL: ${urlQuiz} || ${urlLead}`);
      fbq('track', 'Purchase', { currency: 'BRL', value: 5.00, content_name: 'Fez Optin' });
    }

    // Form = $10 + on.submit(x) (porque é geralmente 3º página)
    if (window.location.href.includes(urlForm)) {
      console.log(`fbq Purchase: \$10, Chegou no Form. URL: ${urlForm}`);
      fbq('track', 'Purchase', { currency: 'BRL', value: 10.00, content_name: 'Chegou no Form' });
    }

    // Resultados = $20 (preencheu quiz)
    if (window.location.href.includes(urlResultados)) {
      console.log(`fbq Purchase: \$20, Preencheu Quiz. URL: ${urlResultados}`);
      fbq('track', 'Purchase', { currency: 'BRL', value: 20.00, content_name: 'Preencheu Quiz' });
    }

    // Redirecionanndo pro Whats = $50
    if (window.location.href.includes(urlRedirecionando)) {
      console.log(`fbq Purchase: \$50, Contato WhatsApp. URL: ${urlRedirecionando}`);
      fbq('track', 'Purchase', { currency: 'BRL', value: 50.00, content_name: 'Contato WhatsApp' });
    }
  }
}, 200);


// Tempo na página
var seconds = 300;
setTimeout(function () {
  fbq('track', 'Purchase', { currency: 'BRL', value: 60.00, content_name: 'Tempo 5 mins' });
}, seconds * 1000);


// ----------------------
// DADOS UTM & REDIRECT
// ----------------------

$(document).ready(() => {

  // Optin com dados UTM - #optinInicial
  $('#optinInicial button.btn').on('click', () => {

    // Dados básicos
    $('form').append(`<input type="hidden" name="field[12]" value="${urlParams.get('utm_source')}">`);
    $('form').append(`<input type="hidden" name="field[11]" value="${urlParams.get('utm_campaign')}">`);
    $('form').append(`<input type="hidden" name="field[13]" value="${urlParams.get('utm_term')}">`);
    $('form').append(`<input type="hidden" name="field[15]" value="${urlParams.get('utm_medium')}">`);
    $('form').append(`<input type="hidden" name="field[14]" value="${urlParams.get('utm_content')}">`);
    $('form').append(`<input type="hidden" name="field[16]" value="${currentUrl}">`);

    // Verifica nomeClinica, senão define e envia
    checkClinica();

    // Check if email is valid & redirect → /quiz?email=%email%
    if ($('input[type="email"]').val().includes('@') && $('input[type="email"]').val().includes('.')) {
      if ($('button').hasClass('optinToQuiz')) {
        setTimeout(() => {
          window.location.href = window.location.origin + '/quiz?email=' + $('input[type="email"]').val();
        }, 1000);
      }
    }
  });


  // ----------------------
  // PESOS E RESPOSTAS QUIZ
  // ----------------------

  // Verificar se está em uma Quiz ou Form pela URL
  if (window.location.href.includes(urlQuiz) || window.location.href.includes(urlForm)) {

    // Valores das Respostas
    var soma = 0;
    //Define os pesos por questão:
    var pesos = {
      //"field"
      // Situação Atual
      "21": {
        //"resposta" : "peso"
        "1": "5",
        "2": "20",
        "3": "5",
        "4": "10",
        "5": "5"
      },
      // Incômodos
      "25": {
        "1": "5",
        "2": "5",
        "3": "5",
        "4": "5"
      },
      // Motivação
      "26": {
        "1": "5",
        "2": "5",
        "3": "5",
        "4": "5"
      },
      // Impedimentos
      "22": {
        "1": "0",
        "2": "10",
        "3": "10",
        "4": "15",
        "5": "15",
        "6": "20"
      },
      // Finanças
      "23": {
        "1": "-20",
        "2": "10",
        "3": "40"
      },
      // Urgência
      "24": {
        "1": "0",
        "2": "5",
        "3": "20"
      }
    }

    // Verificar existência do form e atribui pontos (pesos)
    let x = true;
    setInterval(() => {
      if ($('form:visible').length && x) {
        x = false;
        setTimeout(() => {
          $('._form-content button._submit').on('click', () => {
            for (let i in pesos) {
              if ($('input[name*="field[' + i + ']"]')[1].type == 'radio') {
                $('input[name*="field[' + i + ']"]').each((indice, e) => {
                  let value = $('input[name*="field[' + i + ']"]:checked').val();
                  if ($('input[name*="field[' + i + ']"]')[indice].value == value) {
                    soma += parseInt(pesos[i][indice + 1]);
                  }
                });
              }
              else if ($('input[name*="field[' + i + ']"]')[1].type == 'checkbox') {
                $('input[name*="field[' + i + ']"]:checked').each((indice, e) => {
                  let value = e.value;
                  $('input[name*="field[' + i + ']"]').each((ind, elem) => {
                    if ($('input[name*="field[' + i + ']"]')[ind].value == value) {
                      soma += parseInt(pesos[i][indice + 1]);
                    }
                  });
                });
              }
            }

            // Send purchase track event to FB
            console.log('Quiz Score: ' + soma);
            fbq('track', 'Purchase', { currency: 'BRL', value: soma, content_name: 'Respostas Quiz' });

            // Verifica se telefone tem dígitos e envia dados
            if (/\d/.test($('input[id="phone"]').val())) {

              // Verifica nomeClinica, senão define e envia
              checkClinica();

              // Manda soma junto
              formAppend(42, soma)

              // Quiz || Form → /resultados
              setTimeout(() => {
                window.location.href = window.location.origin + '/resultados';
              }, 1000);
            }

            // Reseta soma
            soma = 0;

          });
        }, 1000);
      }
    }, 100);
  }

});

// ----------------------
// SHOW / HIDE CONTENT
// ----------------------

// Show → Hide Content
setTimeout(function () { $('.odnShow').attr("style", "display: none !important") }, 5000);

// Hide → Show Content
setTimeout(function () { $('.odnHide').attr("style", "display: block !important") }, 7000);

// Cookie 365 Days
// if(/(^|;)\s*cookie_lp=/.test(document.cookie)){var divs=document.querySelectorAll(".odnhide");[].forEach.call(divs,function(e){e.style.setProperty("display", "block", "important")})}else document.cookie="cookie_lp=true; max-age=31536000";

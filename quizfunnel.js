console.log('v1.3.2.5 fireFbq+headings');

// ----------------------
// BASIC VARIABLES
// ----------------------

let urlLead = 'lead';
let urlQuiz = 'quiz'; // Esse é só da página do quiz como funil, senão é 'form'
let urlFone = 'fone';

let urlForm = 'form';

let urlResultados = 'resultados';

let urlRedirecionando = 'redirecionando';

let currentUrl = window.location.host + window.location.pathname;
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);


// ----------------------
// BASIC FUNCTIONS
// ----------------------

// Verificar se nome da clínica existe
function checkClinica() {

  if (typeof nomeClinica !== 'undefined' && nomeClinica) {
    formAppend(40, nomeClinica);
  }

  else {
    console.warn('nomeClinica NÃO estava definido.');
    let nomeClinica = 'nomeClinica vazio';
    formAppend(40, nomeClinica);
  }

}

// formAppend function for Active Campaign Forms
function formAppend(formField, inputValue) {
  $('form').append(`<input type="hidden" name="field[` + formField + `]" value="` + inputValue + `">`);
  console.log('formField = ' + formField + ". inputValue = " + inputValue);
}

// Form Append geral
function formAllAppends() {

  // Dados básicos
  formAppend(12, `${urlParams.get('utm_source')}`);
  formAppend(11, `${urlParams.get('utm_campaign')}`);
  formAppend(13, `${urlParams.get('utm_term')}`);
  formAppend(15, `${urlParams.get('utm_medium')}`);
  formAppend(14, `${urlParams.get('utm_content')}`);
  formAppend(16, currentUrl);

  // Verifica nomeClinica, senão define e envia
  checkClinica();

}

// fireFbq = função pra disparar todas conversões
function fireFbq(eventName, value, contentName) {
  fbq("track", eventName, {
    currency: "BRL",
    value: value,
    content_name: contentName
  });
  console.log("fireFbq : " + eventName + ", $" + value + ", " + contentName);
}


// ----------------------
// DOCUMENT.READY
// ----------------------

$(document).ready(function () {

  // ----------------------
  // FBQ PURCHASES
  // ----------------------

  setTimeout(() => {

    // Verifica ignorePurchase
    if (typeof ignorePurchase !== 'undefined' && ignorePurchase) {
      console.log('ignorePurchase = true. Não disparar conversão.');
    }

    // Purchase por página
    else {

      // Quiz || Lead = $5 (optin básico)
      if (window.location.href.includes(urlQuiz) || window.location.href.includes(urlLead)) {
        fireFbq('Purchase', 5, 'Optin Só E-mail');
      }

      // Inclui fone = $20
      if (window.location.href.includes(urlFone)) {
        fireFbq('Purchase', 20, 'Optin Com Telefone');
      }

      // Form = $20 + variável (on.submit(x), porque é geralmente 3º página)
      if (window.location.href.includes(urlForm)) {
        fireFbq('Purchase', 20, 'Chegou no Form');
      }

      // Resultados = $30 (preencheu quiz)
      if (window.location.href.includes(urlResultados)) {
        fireFbq('Purchase', 30, 'Preencheu Quiz');
      }

      // Redirecionanndo pro Whats = $50
      if (window.location.href.includes(urlRedirecionando)) {
        fireFbq('Purchase', 50, 'Contato WhatsApp');
      }

      // Purchase por tempo na página = $75
      var seconds = 300; // 5 minutos
      setTimeout(function () {
        fireFbq('Purchase', 75, 'Tempo 5 mins');
      }, seconds * 1000);

    }

  }, 200);


  // ----------------------
  // REPLACEMENTS
  // ----------------------

  // Heading #h1
  $("b:contains('#h1')").each(function () {
    $(this).addClass("h1Class");
    $(this).parent().css("text-align", "center");
    $(this).text(function () {
      return $(this).text().replace("#h1", "");
    });
  });

  // Heading #h2
  $("b:contains('#h2')").each(function () {
    $(this).addClass("h2Class");
    $(this).parent().css("text-align", "center");
    $(this).text(function () {
      return $(this).text().replace("#h2", "");
    });
  });

  // Heading #h3
  $("b:contains('#h3')").each(function () {
    $(this).addClass("h3Class");
    $(this).parent().css("text-align", "center");
    $(this).text(function () {
      return $(this).text().replace("#h3", "");
    });
  });

  // Horizontal Line (<hr />)

  // Old solution
  // $('div.hrLine').find('div').eq(1).html('<hr />');

  // New solution
  $('div:contains("* * *"):not(:has(> div))').html('<hr />');


  // ----------------------
  // DADOS UTM & REDIRECT
  // ----------------------

  // Optin com dados UTM
  $('#optinInicial button.btn, button.appendUrlParams').on('click', () => {

    // Dados básicos
    formAllAppends();

    // Check if email is valid & redirect → /quiz?email=%email%
    if ($('input[type="email"]').val().includes('@') && $('input[type="email"]').val().includes('.')) {

      // Redirect optinToQuiz → Quiz
      if ($('button').hasClass('optinToQuiz')) {
        setTimeout(() => {
          window.location.href = window.location.origin + '/quiz?email=' + $('input[type="email"]').val();
        }, 1000);
      }

      // Posso adicionar outros redirects aqui daí se precisar passar e-mail. Mas pegando por cookie não vai precisar mais.

    }
  });

  //  Popup optin com dados UTM = button.abrirPopup
  $('button.abrirPopup').on('click', () => {
    console.log('Clicou button.abrirPopup');

    // Esperar botão ficar disponível.
    setTimeout(() => {

      // Aqui é ok ser botão genérico porque o botão do popup tá ali antes.
      $('button.btn').on('click', () => {

        console.log('Clicou button.btn');

        // Dados básicos
        formAllAppends();

        // Check if email is valid & redirect → /quiz?email=%email%
        if ($('input[type="email"]').val().includes('@') && $('input[type="email"]').val().includes('.')) {
          if ($('button').hasClass('optinToQuiz')) {
            setTimeout(() => {
              window.location.href = window.location.origin + '/quiz?email=' + $('input[type="email"]').val();
            }, 1000);
          }
        }
      });
    }, 100);
  });


  // ----------------------
  // PESOS E RESPOSTAS QUIZ
  // ----------------------

  // Verificar se está em uma Quiz ou Form pela URL
  if (window.location.href.includes(urlQuiz) || window.location.href.includes(urlForm)) {

    console.log('urlQuiz ou urlForm está presente.');

    // Valores das Respostas
    var soma = 0;
    //Define os pesos por questão:
    var pesos = {
      //"field"
      //"resposta" : "peso"

      // Situação Atual
      "21": {
        "1": "5",
        "2": "25",
        "3": "15",
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
        "1": "0", // Custo
        "2": "10", // Medo
        "3": "10", // Tempo
        "4": "15", // Desconhecia
        "5": "15", // Dentistas de Confiança
        "6": "25" // Estou pronto!
      },

      // Finanças
      "23": {
        "1": "-20",
        "2": "10",
        "3": "40"
      },

      // Urgência
      "24": {
        "1": "-10",
        "2": "5",
        "3": "30"
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
            fireFbq('Purchase', soma, 'Respostas Quiz');

            // Verifica se telefone tem dígitos e envia dados
            if (/\d/.test($('input[id="phone"]').val())) {

              // Verifica nomeClinica, senão define e envia
              checkClinica();

              // Manda soma junto
              formAppend(42, soma)

              // Quiz → /resultados
              if (window.location.href.includes(urlQuiz)) {
                console.log('urlQuiz → /resultados');
                setTimeout(() => {
                  window.location.href = window.location.origin + '/resultados';
                }, 1000);
              }

              // Form → /resultados-agende
              if (window.location.href.includes(urlForm)) {
                console.log('urlForm → /resultados-agende');
                setTimeout(() => {
                  window.location.href = window.location.origin + '/resultados-agende';
                }, 1000);
              }
            }

            // Reseta soma
            soma = 0;

          });
        }, 1000);
      }
    }, 100);
  }


  // ----------------------
  // SHOW / HIDE CONTENT
  // ----------------------

  // Show → Hide Content
  setTimeout(function () { $('.odnShow').attr("style", "display: none !important") }, 5000);

  // Hide → Show Content
  setTimeout(function () { $('.odnHide').attr("style", "display: block !important") }, 7000);

  // Cookie 365 Days
  // if(/(^|;)\s*cookie_lp=/.test(document.cookie)){var divs=document.querySelectorAll(".odnhide");[].forEach.call(divs,function(e){e.style.setProperty("display", "block", "important")})}else document.cookie="cookie_lp=true; max-age=31536000";

});
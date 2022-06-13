console.log('carregou GH');

// Show → Hide Content
// setTimeout(function() {$('.odnShow').attr("style", "display: none !important")}, 5000);

// Hide → Show Content
// setTimeout(function() {$('.odnHide').attr("style", "display: block !important")}, 10000);

// Cookie 365 Days
// if(/(^|;)\s*cookie_lp=/.test(document.cookie)){var divs=document.querySelectorAll(".odnhide");[].forEach.call(divs,function(e){e.style.setProperty("display", "block", "important")})}else document.cookie="cookie_lp=true; max-age=31536000";

// Optin com dados UTM
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
$(document).ready(()=>{
  $('#optinInicial button.btn').on('click',()=>{
    $('form').append(`<input type="hidden" name="field[12]" value="${urlParams.get('utm_source')}">`);
    $('form').append(`<input type="hidden" name="field[11]" value="${urlParams.get('utm_campaign')}">`);
    $('form').append(`<input type="hidden" name="field[13]" value="${urlParams.get('utm_term')}">`);
    $('form').append(`<input type="hidden" name="field[15]" value="${urlParams.get('utm_medium')}">`);
    $('form').append(`<input type="hidden" name="field[14]" value="${urlParams.get('utm_content')}">`);
    $('form').append(`<input type="hidden" name="field[16]" value="${content_piece}">`);
  });
});

// Aqui tem que pensar se consigo fazer pra todos ou página por página. Talvez 'domain' + /quiz(input email), porque seria pra esse tipo né.
if($('input[type="email"]').val().includes('@') && $('input[type="email"]').val().includes('.')){
  setTimeout(()=>{
    window.location.href = 'https://rf.oralbrasilportoalegre.com.br/quiz?email='+$('input[type="email"]').val();
  },1000);
}

// Isso vai ser definido na página, assim como o link para próxima página do if se precisar
// var content_piece = 'Vídeo 1.0 + Popup Optin';

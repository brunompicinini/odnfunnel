// Show → Hide Content
setTimeout(function() {$('.odnHide').attr("style", "display: none !important")}, 5000);

// Hide → Show Content
setTimeout(function() {$('.odnHide').attr("style", "display: block !important")}, 10000);

// Cookie 365 Days
if(/(^|;)\s*cookie_lp=/.test(document.cookie)){var divs=document.querySelectorAll(".odnhide");[].forEach.call(divs,function(e){e.style.setProperty("display", "block", "important")})}else document.cookie="cookie_lp=true; max-age=31536000";

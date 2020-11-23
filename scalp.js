// ==UserScript==
// @name        RTX 3080
// @namespace   Violentmonkey Scripts
// @match       https://www.topachat.com/pages/produits_cat_est_micro_puis_rubrique_est_wgfx_pcie_puis_f_est_58-11445.html
// @match       https://shop.hardware.fr/composants/carte-graphique/c7492/+fsort-8+fp-h970+fv121-19183/
// @match       https://www.ldlc.com/informatique/pieces-informatique/carte-graphique-interne/c4684/+fp-l569h965+fv121-19183.html
// @grant       GM_setValue
// @grant       GM_getValue
// @version     1.0
// @author      Firewall
// @description This script will alert you whenever a new GPU is available on either one of the above URLs by opening a link of the GPU that became available for purchase. Can be easily modified to match any other product by changing the URLs. Website must remain open.
// ==/UserScript==

function checkOutOfStock (hostname) {
  console.log("checkOutOfStock: "+ hostname);
  switch(hostname) {
      
    case "www.topachat.com":
      return document.querySelectorAll("article.grille-produit > section:not(.en-rupture)");
      
    case "shop.hardware.fr":
      return document.querySelectorAll(".button.picto-seul:not(.disabled)");
      
    case "www.ldlc.com":
      return document.querySelectorAll(".button.picto-seul:not(.disabled):not([style])");
    default:
      // code block
      return;
  } 
}

function openProductPage (hostname, item) {
  
  console.log("checkOutOfStock: "+ hostname);
  switch(hostname) {
      
    case "www.topachat.com":
      GM_setValue('topachat', GM_getValue('topachat', 0) + 1);
      window.open(item.querySelector("a.tacenter").href);
      break;
      
    case "shop.hardware.fr":
      GM_setValue('hardware', GM_getValue('hardware', 0) + 1);
      window.open(item.parentElement.parentElement.getElementsByTagName("a")[0].href);
      break;
      
    case "www.ldlc.com":
      GM_setValue('ldlc', GM_getValue('ldlc', 0) + 1);
      window.open(item.parentElement.parentElement.parentElement.querySelector("div.pic > a").href);
      break;
      
    default:
      // code block
  } 
  return;
}

(async function() {
  'use strict';
  var topachat = GM_getValue('topachat', 0);
  var hardware = GM_getValue('hardware', 0);
  var totalInStock = topachat+hardware;
  console.log(totalInStock+" items currently in stock");
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  var context = new AudioContext();
  var o = context.createOscillator();
  o.type = 'sine';
  o.frequency.value = 200.63;
  o.connect(context.destination);
  var hostname = window.location.hostname;
  
  var notOutOfStock = checkOutOfStock(hostname);

  notOutOfStock.forEach(function(item) {
    var newItemTopAchat = String(hostname).valueOf() == String("www.topachat.com").valueOf() && notOutOfStock.length > topachat ;
    var newItemHardware = String(hostname).valueOf() == String("shop.hardware.fr").valueOf() && notOutOfStock.length > hardware ;
    if (newItemTopAchat || newItemHardware){
      console.log("Found an item in stock at " + hostname);
      console.log("User alerted");
      // Star the sound
      o.start(0);
      // Play the sound for a bit before stopping it
      setTimeout(function() {
          o.stop(0);
      }, 200);
      openProductPage(hostname, item);
    }
  });
  await new Promise(r => setTimeout(r, 5000));
  location.reload(true);
  
})();


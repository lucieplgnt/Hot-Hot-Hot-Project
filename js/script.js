
// systhème d'onglets - début
const onglets = Array.from(document.querySelectorAll(".onglets"));
const contenu = Array.from(document.querySelectorAll(".contenu"));

let index = 0;

onglets.forEach(onglet => {
  onglet.addEventListener('click', () => {

    if (onglet.classList.contains('active')){
      return;
    } else {
      onglet.classList.add('active');
    }

    index = onglet.getAttribute('data-block');
    for (i = 0; i < onglets.length; i++) {

      if (onglets[i].getAttribute('data-block') != index) {
        onglets[i].classList.remove('active');
      }
    }

    for (j = 0; j < contenu.length; j++){
      if (contenu[j].getAttribute('data-block') == index) {
        contenu[j].classList.add('activeContenu');
      } else {
        contenu[j].classList.remove('activeContenu');
      }

    }
  })
})
// onglets - fin

//capteurs

if ('serviceWorker' in navigator) {

  navigator.serviceWorker.register('/Hot-Hot-Hot-Project/service-worker.js') // à adapter à l'URL du projet

  .then(() => { /*console.log('Service Worker Registered');*/ });

}

// Create WebSocket connection.
var socket = new WebSocket('wss://ws.hothothot.dog:9502'); 
/* var socket = new WebSocket('ws://localhost:8100'); */

IndiceTemp = 0;
socket.onopen = () => {
  socket.send("Connexion open");
};

//Creéation d'un graphique vide qui sera mis à jour avec les données reçus
google.load("visualization", "1", {packages:["corechart"]});
google.setOnLoadCallback(drawChart);
function drawChart() {
  var options = {
    title: 'Evolution température dans le temps'
  };
  var data = new google.visualization.DataTable();

  data.addColumn('string', 'Temps');
  data.addColumn('number', 'ext');
  data.addColumn('number', 'int')

  var chart = new google.visualization.LineChart(document.querySelector('.curve_chart'));
  chart.draw(data, options);

  numberOfData = 0;
  socket.onmessage = (msg) => {
    //console.log("Received: "+msg.data.length);
    /*recup temp */
    if(msg.data.length > 0)
    { 
      let capteurs = JSON.parse(msg.data);

      let ext = capteurs['capteurs'][1];
      let interieur = capteurs['capteurs'][0];
      var tempext = ext['Valeur'];
      var tempint = interieur['Valeur'];
      let latempExt = "Température extérieure : ";
      let valTemp = tempext;
      let latempInt = "Température intérieure : ";
      let valTemp2 = interieur['Valeur'];

      console.log(latempExt + valTemp);
      console.log(latempInt + valTemp2);
      if (valTemp > 18  || valTemp2 > 18) {
        console.log("c'est l'été ou quoi ?");
      }
      if (valTemp2 < 5 || valTemp < 5) {
        console.log("wesh le glaçon !");
      }

      let tmp = document.querySelector(".temperature");
      tmp.textContent = latempExt;
      let valeurTemperature = document.querySelector(".la-temp");
      valeurTemperature.textContent = valTemp;

      let tmp2 = document.querySelector(".temperature2");
      tmp2.textContent= latempInt;
      let valeurTemperature2 = document.querySelector(".la-temp2");
      valeurTemperature2.textContent = valTemp2;

      var tabTemp = [];
      var tmpsAct = new Date();
      heure = tmpsAct.getHours();
      minute = tmpsAct.getMinutes();
      heure = heure < 10 ? "0" + heure : heure;
      minute = minute < 10 ? "0" + minute : minute;
      heureNminute = heure + "h : " + minute + "m";
      tempextGraph = JSON.parse(tempext);
      tempintGraph = JSON.parse(tempint);
	  tempext = tempext.replace('.', ',')
		tempint = tempint.replace('.', ',')
      tabTemp.push(heureNminute);
      tabTemp.push(parseFloat(tempext)); /* tempextGraph */
      tabTemp.push(parseFloat(tempint));
      console.log(tabTemp);
      data.addRows([[tabTemp[0], tabTemp[1], tabTemp[2]]]);
      if (numberOfData >= 40)
      {
        numberOfData = 38;
        data.removeRow(0);
        data.removeRow(1);
      }
      else {
        numberOfData = numberOfData + 1;
      }

      var chart = new google.visualization.LineChart(document.querySelector('.curve_chart'));
      chart.draw(data, options);

      var tabtemExt = {tempext} 
      localStorage.setItem(temp[IndiceTemp], JSON.stringify(tabtemExt));
      tempJSON = localStorage.getItem(temp[IndiceTemp]);
      /* tempp = tempJSON && JSON.Parse(tempJSON); */
      let histor = document.querySelector(".historique");
      histor.textContent = tempJSON;
      IndiceTemp = IndiceTemp + 1;
    
      console.log("data bien reçu 1");
    }
    else {
      console.log("changement de connection");
      const UrlApi = "https://hothothot.dog/api/capteurs";
      fetch(UrlApi)
        .then((response) => reponse.json().then((dataApi) => {

          let capteurs = dataApi;
          let ext = capteurs['capteurs'][1];
          let interieur = capteurs['capteurs'][0];
          var tempext = ext['Valeur'];
          var tempint = interieur['Valeur'];
          let latempExt = "Température extérieure : ";
          let valTemp = tempext;
          let latempInt = "Température intérieure : ";
          let valTemp2 = interieur['Valeur'];
          console.log(latempExt + valTemp);
          console.log(latempInt + valTemp2);
          if (valTemp > 18  || valTemp2 > 18) {
            console.log("c'est l'été ou quoi ?");
          }
          if (valTemp2 < 5 || valTemp < 5) {
            console.log("wesh le glaçon !");
          }

          let tmp = document.querySelector(".temperature");
          tmp.textContent = parseInt(latempExt);
          let valeurTemperature = document.querySelector(".la-temp");
          valeurTemperature.textContent = parseInt(valTemp);

          let tmp2 = document.querySelector(".temperature2");
          tmp2.textContent= parseInt(latempInt);
          let valeurTemperature2 = document.querySelector(".la-temp2");
          valeurTemperature2.textContent = parseInt(valTemp2);

          var tabTemp = [];
          var tmpsAct = new Date();
          heure = tmpsAct.getHours();
          minute = tmpsAct.getMinutes();
          heure = heure < 10 ? "0" + heure : heure;
          minute = minute < 10 ? "0" + minute : minute;
          heureNminute = heure + " : " + minute;
          tempextGraph = JSON.parse(tempext);
          tempintGraph = JSON.parse(tempint);
		  tempext = tempext.replace('.', ',')
		  tempint = tempint.replace('.', ',')
          tabTemp.push(heureNminute);
          tabTemp.push(parseFloat(tempext)); /* tempextGraph */
          tabTemp.push(parseFloat(tempint));
          console.log(tabTemp);
          data.addRows([[tabTemp[0], tabTemp[1], tabTemp[2]]]);
          if (numberOfData >= 40)
          {
            numberOfData = 38;
            data.removeRow(0);
            data.removeRow(1);
          }
          else {
            numberOfData = numberOfData + 1;
          }

          var chart = new google.visualization.LineChart(document.querySelector('.curve_chart'));
          chart.draw(data, options);

          var tabtemExt = {tempext} 
          localStorage.setItem(temp[IndiceTemp], JSON.stringify(tabtemExt));
          tempJSON = localStorage.getItem(temp[IndiceTemp]);
          /* tempp = tempJSON && JSON.Parse(tempJSON); */
          let histor = document.querySelector(".historique");
          histor.textContent = tempJSON;
          IndiceTemp = IndiceTemp + 1;
        
          console.log("data bien reçu 2");
          
        }))
    };
  }


  setInterval(()=>{
    if(socket.readyState != 1) {
      const UrlApi = "https://hothothot.dog/api/capteurs";
      fetch(UrlApi).then((response) => response.json().then((dataApi) => {
        let capteurs = dataApi;
        console.log(data);
        let ext = capteurs['capteurs'][1];
        let interieur = capteurs['capteurs'][0];
        var tempext = ext['Valeur'];
        var tempint = interieur['Valeur'];
        let latempExt = "Température extérieure : ";
        let valTemp = tempext;
        let latempInt = "Température intérieure : ";
        let valTemp2 = interieur['Valeur'];

        console.log(latempExt + valTemp);
        console.log(latempInt + valTemp2);
        /* notifs */
        let text1 = document.querySelector("#text1");
        let text2 = document.querySelector("#text2");
        let text3 = document.querySelector("#text3");
        let text4 = document.querySelector("#text4");
        let comptNotif = document.querySelector("#num");
        let notif1 = document.querySelector(".element-liste1");
        let notif2 = document.querySelector(".element-liste2");
        let notif3 = document.querySelector(".element-liste3");
        let notif4 = document.querySelector(".element-liste4");
        var comptN = 0;
        var comptN1 = 0;
        var comptN2 = 0;
        var comptN3 = 0;
        var comptN4 = 0;

        if (valTemp > 16 || valTemp2 > 16) {
          console.log("il fait bon aujourd'hui");

          if (valTemp > 16 && valTemp2 < 16) {
            text1.textContent = "il fait plus de 16° dehors";
          }
          else if (valTemp < 16 && valTemp2 > 16) {
            text1.textContent = "il fait plus de 16° à l'intérieur";
          }
          else if (valTemp > 16 && valTemp2 > 16) {
            text1.textContent = "il fait plus de 16°";
          }

          notif1.classList.add("element-liste1-active");
          var comptN1 = 1;
        }
        else {
          text1.textContent = "il fait bon";
        }
        notif1.addEventListener("click" , () =>{
          notif1.classList.remove("element-liste1-active");
          notif1.classList.add("element-liste1");
        });

        if (valTemp > 22 || valTemp2 > 22) {
          messageTest = "il fait chaud dehors : " + valTemp + "°";
          messageTest1 = "il fait " + valTemp2 + "° à l'intérieur";
          console.log(messageTest);

          if (valTemp > 22 && valTemp2 < 22) {
            text2.textContent = messageTest;
          }
          else if (valTemp < 22 && valTemp2 > 22) {
            text2.textContent = messageTest1;
          }
          else if (valTemp > 22 && valTemp2 > 22) {
            text2.textContent = "il fait chaud aujourd'hui";
          }
          
          notif2.classList.add("element-liste2-active");
          var comptN2 = 1;
        }
        else {
          text2.textContent = "il fait chaud";
        }
        notif2.addEventListener("click" , () =>{
          notif2.classList.remove("element-liste2-active");
          notif2.classList.add("element-liste2");
        });

        if (valTemp2 < 10 || valTemp < 10) { /* 10 */
          console.log("il fait froid aujourd'hui, moins de 12°");

          if (valTemp < 10 && valTemp2 > 10) {
            text3.textContent = "il fait froid dehors";
          }
          else if (valTemp > 10 && valTemp2 < 10) {
            text3.textContent = "il fait froid à l'intérieur";
          }
          else if (valTemp < 10 && valTemp2 < 10) {
            text3.textContent = "il fait froid";
          }

          notif3.classList.add("element-liste3-active");
          var comptN3 = 1;
        }
        else {
          text3.textContent = "il fait froid";
        }
        notif3.addEventListener("click" , () =>{
          notif3.classList.remove("element-liste3-active");
          notif3.classList.add("element-liste3");
        });

        if (valTemp2 < 5 || valTemp < 5) {
          console.log("il fait moins de 5°");

          if (valTemp < 5 && valTemp2 > 5) {
            text4.textContent = "il fait moins de 5° dehors";
          }
          else if (valTemp > 5 && valTemp2 < 5) {
            text4.textContent = "allumez le chauffage";
          }
          else if (valTemp < 5 && valTemp2 < 5) {
            text4.textContent = "c'est glacial";
          }

          notif4.classList.add("element-liste4-active");
          var comptN4 = 1;
        }
        else {
          text4.textContent = "c'est glacial";
        }
        notif4.addEventListener("click" , () =>{
          notif4.classList.remove("element-liste4-active");
          notif4.classList.add("element-liste4");
        });
        valeurFinale = comptN + comptN1 + comptN2 + comptN3 + comptN4;
        comptNotif.textContent = valeurFinale;

        /* affichage de la température (englet 1) */
        let tmp = document.querySelector(".temperature");
        tmp.textContent = latempExt;
        let valeurTemperature = document.querySelector(".la-temp");
        valeurTemperature.textContent = valTemp;

        let tmp2 = document.querySelector(".temperature2");
        tmp2.textContent= latempInt;
        let valeurTemperature2 = document.querySelector(".la-temp2");
        valeurTemperature2.textContent = valTemp2;
    
        /* affichage de la température (graphe) */
        var tabTemp = [];
        var tmpsAct = new Date();
        heure = tmpsAct.getHours();
        minute = tmpsAct.getMinutes();
        heure = heure < 10 ? "0" + heure : heure;
        minute = minute < 10 ? "0" + minute : minute;
        heureNminute = heure + "h : " + minute + "m";
        tempext = JSON.parse(tempext);
        tempint = JSON.parse(tempint);
        tabTemp.push(heureNminute);
        tabTemp.push(tempext);
        tabTemp.push(tempint);
        console.log(heureNminute);
        console.log(tabTemp);
        data.addRows([[tabTemp[0], tabTemp[1], tabTemp[2]]]);
        if (numberOfData >= 40)
        {
          numberOfData = 38;
          data.removeRow(0);
          data.removeRow(1);
        }
        else {
          numberOfData = numberOfData + 1;
        }

        var chart = new google.visualization.LineChart(document.querySelector('.curve_chart'));
        chart.draw(data, options);
      
        console.log("data bien reçu 3");
          
      }))
    }
  }, 10000) /* 60000 */
}

/* click */
let comptNotif = document.querySelector("#num");

let element1 = document.querySelectorAll(".element-liste1");
let element2 = document.querySelectorAll(".element-liste2");
let element3 = document.querySelectorAll(".element-liste3");
let element4 = document.querySelectorAll(".element-liste4");

element1.forEach(elements => {
  elements.addEventListener("click" , () =>{
    if (onglet.classList.contains('active')){
      return;
    } else {
      onglet.classList.add('active');
    }
    index = 2;
    for (i = 0; i < onglets.length; i++) {
  
      if (onglets[i].getAttribute('data-block') != index) {
        onglets[i].classList.remove('active');
      }
    }
  
    for (j = 0; j < contenu.length; j++){
      if (contenu[j].getAttribute('data-block') == index) {
        contenu[j].classList.add('activeContenu');
      } else {
        contenu[j].classList.remove('activeContenu');
      }
    }
    comptNotif.textContent = 0;
  });
})
element2.forEach(elements => {
  elements.addEventListener("click" , () =>{
    if (onglet.classList.contains('active')){
      return;
    } else {
      onglet.classList.add('active');
    }
    index = 2;
    for (i = 0; i < onglets.length; i++) {
  
      if (onglets[i].getAttribute('data-block') != index) {
        onglets[i].classList.remove('active');
      }
    }
  
    for (j = 0; j < contenu.length; j++){
      if (contenu[j].getAttribute('data-block') == index) {
        contenu[j].classList.add('activeContenu');
      } else {
        contenu[j].classList.remove('activeContenu');
      }
    }
    comptNotif.textContent = 0;
  });
})
element3.forEach(elements => {
  elements.addEventListener("click" , () =>{
    if (onglet.classList.contains('active')){
      return;
    } else {
      onglet.classList.add('active');
    }
    index = 2;
    for (i = 0; i < onglets.length; i++) {
  
      if (onglets[i].getAttribute('data-block') != index) {
        onglets[i].classList.remove('active');
      }
    }
  
    for (j = 0; j < contenu.length; j++){
      if (contenu[j].getAttribute('data-block') == index) {
        contenu[j].classList.add('activeContenu');
      } else {
        contenu[j].classList.remove('activeContenu');
      }
    }
    comptNotif.textContent = 0;
  });
})
element4.forEach(elements => {
  elements.addEventListener("click" , () =>{
    if (onglet.classList.contains('active')){
      return;
    } else {
      onglet.classList.add('active');
    }
    index = 2;
    for (i = 0; i < onglets.length; i++) {
  
      if (onglets[i].getAttribute('data-block') != index) {
        onglets[i].classList.remove('active');
      }
    }
  
    for (j = 0; j < contenu.length; j++){
      if (contenu[j].getAttribute('data-block') == index) {
        contenu[j].classList.add('activeContenu');
      } else {
        contenu[j].classList.remove('activeContenu');
      }
    }
    comptNotif.textContent = 0;
  });
})

socket.onerror = function(response) {
  fetch("https://hothothot.dog/api/capteurs/exterieur",
  {
    headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify({param1: 'valeur'})
  })
  .then(function(response){
    return response.json.then(function(O_json){
    });
  })
  .catch(function(){

  });
};

let deferredPrompt;
const addBtn = document.querySelector('.bxs-download');

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;

  addBtn.addEventListener('click', (e) => {
    // Show the prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        deferredPrompt = null;
      });
  });
});

console.log();
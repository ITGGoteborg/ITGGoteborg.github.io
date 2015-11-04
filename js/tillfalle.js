$(document).ready(function() {
  /**
   * Använd AJAX för att fråga servern efter filen benämnd TILLFALLE i föregående mapp
   * relativt till denna javascript fil.
   */
  $.ajax({ url: "../TILLFALLE",
    success: function(data) {
      var regex = /\/\*([^*]|[\r\n])*\*\//mg;
      data = data.replace(regex,'').trim(); // ta bort alla kommentarer från filen
      if(data.length < 10 || !(/^(19|20)\d\d(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])([0-9]|0[0-9]|1[0-9]|2[0-3])[0-5][0-9]$/.test(data))) return; // testa om datumet är korrekt enligt formattet YmdHi
      tillfalle = new Date(data.substr(0,4),+data.substr(4,2)-1,data.substr(6,2),data.substr(8,2),data.substr(10,2),0,0);
    }
  }).done(function() {

    /**
      * Om TILLFALLE var tom eller inte kunde läsas, sätt tillfalle till närmaste onsdag
      * klockan tre, om klockan passerat fem sätts tillfalle till onsdag nästkommande vecka.
      */
    if(isNaN(tillfalle) || (tillfalle.getTime()-Date.now())<=7200000) {
      tillfalle = new Date();
      //tillfalle.setTime(tillfalle.getTime() + (259200000 - (86400000*tillfalle.getDay()) + 604800000) % 604800000);
      tillfalle.setDate(tillfalle.getDate()+((tillfalle.getHours() < 17) ? ((3-tillfalle.getDay()+7)%7) : ((3-1-tillfalle.getDay()+7)%7+1)));
      tillfalle.setHours(15);
      tillfalle.setMinutes(0);
      tillfalle.setSeconds(0);
      tillfalle.setMilliseconds(0);
    }
  
    /**
      * Skriv det resulterande datumet till elementet med ID 'tillfalle' i formattet
      * d F Y H:i, ex. 16 September 2015 15:00
      */
    var m = ['Januari','Februari','Mars','April','Maj','Juni','Juli',
'Augusti','September','Oktober','November','December'];
    $('#tillfalle').html(tillfalle.getDate() + ' ' + m[tillfalle.getMonth()] + ' ' + tillfalle.getFullYear() + ' ' + ('00'+tillfalle.getHours()).slice(-2) + ':' + ('00'+tillfalle.getMinutes()).slice(-2));

    /**
      * Räkna ner tiden tills tillfalle inträffar.
      */
    visning = document.querySelector('#tid')
    if((tillfalle.getTime()-Date.now())<=0) {
      visning.innerHTML = '<strong>PÅGÅR JUST NU</strong> till 17:00';
    }else {
      var tidtagare = new CountDownTimer((tillfalle-Date.now())/1000);
      tidtagare.onTick(format).onTick(function() {
        if(this.expired()) {
          visning.innerHTML = '<strong>PÅGÅR JUST NU</strong> till 17:00';   
        }
      }).start();
    }
  });

  /**
    * tid till tillfälle
    * NOTERA: detta är inte korrekt, om ett dygn exempelvis har mer än 86400 sekunder
    * någon dag blir saker jobbigt!
    */
  function format(ttt) {
    var days = ((ttt / 86400) | 0);
    var hours = ((ttt / 3600) | 0) % 24;
    var minutes = ((ttt / 60) | 0) % 60;
    var seconds = ((ttt % 60) | 0);
    visning.innerHTML = days + ' dagar, ' + ('00'+hours).slice(-2) + ':' + ('00'+minutes).slice(-2) + ':' + ('00'+seconds).slice(-2) + ' timmar';
  }
});

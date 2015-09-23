$(document).ready(function() {
  /**
   * Använd AJAX för att fråga servern efter filen benämnd TILLFALLE i föregående mapp
   * relativt till denna javascript fil.
   */
  $.ajax({ url: "../TILLFALLE",
    success: function(data) {
      var regex = /\/\*([^*]|[\r\n])*\*\//mg;
      data = data.replace(regex,'').trim(); // ta bort alla kommentarer från filen
      if(!(/^(19|20)\d\d(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])([0-9]|0[0-9]|1[0-9]|2[0-3])[0-5][0-9]$/.test(data))) return; // testa om datumet är korrekt enligt formattet YmdHi
      tillfalle = new Date(data.substr(0,4),+data.substr(4,2)-1,data.substr(6,2),data.substr(8,2),data.substr(10,2),0,0);
    }
  }).done(function() {

    /**
      * Om TILLFALLE var tom eller inte kunde läsas, sätt tillfalle till nästa onsdag
      * klockan tre.
      */
    if(isNaN(tillfalle)) {
      tillfalle = new Date();
      tillfalle.setDate(tillfalle.getDate() + (3 - tillfalle.getDay() + 7) % 7);
      tillfalle.setHours(15);
      tillfalle.setMinutes(0);
    }

    /**
      * Skriv det resulterande datumet till elementet med ID 'tillfalle' i formattet
      * d F Y H:i, ex. 16 September 2015 15:00
      */
    var m = ['Januari','Februari','Mars','April','Maj','Juni','Juli',
'Augusti','September','Oktober','November','December'];
    $('#tillfalle').html(tillfalle.getDate() + ' ' + m[tillfalle.getMonth()] + ' ' + tillfalle.getFullYear() + ' ' + ('00'+tillfalle.getHours()).slice(-2) + ':' + ('00'+tillfalle.getMinutes()).slice(-2));
  });
});

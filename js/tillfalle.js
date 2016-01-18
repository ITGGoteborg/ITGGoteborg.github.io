$(document).ready(function() {
    /*
     * Definiera variabler med nyckelordet "var"
     */
    var tillfalle,
        interval;

    function done_fn() {
        var end, start;
        if (moment().isValid(data.custom.start.date + " " + data.custom.start.time)
            && moment().isValid(data.custom.end.date + " " + data.custom.end.time)
            && moment().isBefore((end = moment(data.custom.end.date + " " + data.custom.end.time)))) {
            start = moment(data.custom.start.date + " " + data.custom.start.time);
            setInterval(function () {
              if (moment().isBefore(start) === true) { // tillfalle.json har datum som är i framtiden
                  $("#tillfalle").html(start.format("D MMMM YYYY H:mm"));
                  $("#tid").html(moment().to(start));
              } else if (moment().isBetween(start, end)) { // tillfalle.json har datum som pågår nu
                  $("#tillfalle").html(start.format("D MMMM YYYY H:mm"));
                  //end_time = (data.custom.start.date === data.custom.end.date) ? data.custom.end.time : end.format("D MMMM H:mm"); // vad är data.custom.end.date?
                  end_time = (moment(end).diff(start, 'days') == 0) ? data.default.end.time : end.format("D MMMM H:mm");
                  $("#tid").html("<strong>PÅGÅR JUST NU</strong> till " + end_time);
              }
            }, 1000);
        }else {
            var time = data.default.start.time;
            start = moment().day(data.default.start.day);

            time = time.split(':');
            start.set({
              hours: time[0],
              minutes: time[1]
            })

            time = data.default.end.time;
            var end = moment().day(data.default.end.day);

            time = time.split(':');
            end.set({
              hours: time[0],
              minutes: time[1]
            })

            setInterval(function () {
              if (moment().isBefore(start) === true) { // tillfalle.json har datum som är i framtiden
                  $("#tillfalle").html(start.format("D MMMM YYYY H:mm"));
                  $("#tid").html(moment().to(start));
              } else if (moment().isBetween(start, end)) { // tillfalle.json har datum som pågår nu
                  $("#tillfalle").html(start.format("D MMMM YYYY H:mm"));
                  end_time = (moment(end).diff(start, 'days') == 0) ? data.default.end.time : end.format("D MMMM H:mm");
                  $("#tid").html("<strong>PÅGÅR JUST NU</strong> till " + end_time);
              }
            }, 1000);
        }
    }

    /*
     * Språket för moment.js är svenska
     */
    moment.locale("sv");
    moment.relativeTimeThreshold("s", 59);
    moment.relativeTimeThreshold("m", 59);
    moment.relativeTimeThreshold("h", 23);

    /*
     * Använd AJAX för att fråga servern efter filen benämnd TILLFALLE i föregående mapp
     * relativt till denna javascript fil.
     */
    $.ajax({
        url: "../tillfalle",
        success: function(json) {
            data = $.parseJSON(json);
        }
    }).done(function() {
        done_fn();
    });
});

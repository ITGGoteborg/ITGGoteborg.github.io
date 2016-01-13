$(document).ready(function() {
    /*
     * Definiera variabler med nyckelordet "var"
     */
    var tillfalle,
        interval;

    function done_fn() {
        if (moment().isValid(data.custom.start.date + " " + data.custom.start.time) && moment().isValid(data.custom.end.date + " " + data.custom.end.time)) {
            var start = moment(data.custom.start.date + " " + data.custom.start.time);
            var end = moment(data.custom.end.date + " " + data.custom.end.time);
            if (moment().isBefore(start) === true) { // tillfalle.json har datum som är i framtiden
                $("#tillfalle").html(start.format("D MMMM YYYY H:mm"));
                $("#tid").html(moment().to(start));
            } else if (moment().isBetween(start, end)) { // tillfalle.json har datum som pågår nu
                $("#tillfalle").html(start.format("D MMMM YYYY H:mm"));
                end_time = (data.custom.start.date === data.custom.end.date) ? data.custom.end.time : end.format("D MMMM H:mm");
                $("#tid").html("<strong>PÅGÅR JUST NU</strong> till " + end_time);
            } else { // tillfalle.json har datum som är i dåtiden
                $("#tillfalle").html(start.format("D MMMM YYYY H:mm"));
                $("#tid").html(moment(moment().to(moment().weekday(2).format("YYYY-MM-DD")) + " " + data.default.start.time));
            }
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
        setInterval(function () {
            done_fn();
        }, 250);
    });
});

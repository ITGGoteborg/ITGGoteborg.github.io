$(document).ready(function() {
	var tillfalle;
	var interval;

	function done_fn(data) {
		var start;
		var end;

		if (data.custom && moment().isValid(data.custom.start.date + " " + data.custom.start.time) && moment().isValid(data.custom.end.date + " " + data.custom.end.time) && moment().isBefore((end = moment(data.custom.end.date + " " + data.custom.end.time)))) {
			setInterval(function () {
				start = moment(data.custom.start.date + " " + data.custom.start.time);
				
				if (moment().isBefore(start) === true) { // tillfalle.json har datum som är i framtiden
					$("#tillfalle").html(start.format("dddd D MMMM YYYY HH:mm"));
					$("#tid").html(moment().to(start));
				} else if (moment().isBetween(start, end)) { // tillfalle.json har datum som pågår nu
					$("#tillfalle").html(start.format("dddd D MMMM YYYY HH:mm"));
					end_time = (moment(end).diff(start, "days") === 0) ? data.default.end.time : end.format("dddd D MMMM HH:mm");
					$("#tid").html("<strong>PÅGÅR JUST NU</strong> till " + end_time);
				}
			}, 1000);
		} else {
			setInterval(function () {
				start = moment().isAfter(moment().set({ day: data.default.start.day, hour: data.default.end.hour, minute: data.default.end.minute, })) ? moment().set({ day: data.default.start.day + 7, hour: data.default.start.hour, minute: data.default.start.minute, }) : moment().set({ day: data.default.start.day, hour: data.default.start.hour, minute: data.default.start.minute, });
				end = moment().isAfter(moment().set({ day: data.default.start.day, hour: data.default.end.hour, minute: data.default.end.minute, })) ? moment().set({ day: data.default.start.day + 7, hour: data.default.end.hour, minute: data.default.end.minute, }) : moment().set({ day: data.default.start.day, hour: data.default.end.hour, minute: data.default.end.minute, });

				if (moment().isBetween(start, end)) {
					$("#tillfalle").html("");
					$("#tid").html("<strong>PÅGÅR JUST NU</strong> till " + end.format("HH:mm"));
				} else {
					$("#tillfalle").html(start.format("dddd D MMMM YYYY HH:mm"));
					$("#tid").html(moment().to(start));
				}
			}, 1000);
		}
	}

	/**
	 * Språket för moment.js är svenska
	 */
	moment.locale("sv");
	moment.relativeTimeThreshold("s", 59);
	moment.relativeTimeThreshold("m", 59);
	moment.relativeTimeThreshold("h", 23);

	/** 
	 * Använd AJAX för att fråga servern efter filen tillfalle.json i föregående mapp
	 * relativt till denna javascript fil.
	 */
	$.ajax({
		url: "../tillfalle.json",
		dataType: "json",
		success: function(json) {
			done_fn(json);
		}
	});
});

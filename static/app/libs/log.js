function log() {
	"use strict";

	if (typeof(console) !== "undefined" && console.log !== undefined) {
		try {
			console.log.apply(console, arguments);
		} catch (e) {
			var log = Function.prototype.bind.call(console.log, console);
			log.apply(console, arguments);
		}
	}
}
"use strict";

export default class DateFormatter {
    /**
     * currentDateTimeString
     * @return {String}
     */
    static currentDateTimeString() {
        let date = new Date();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        return (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear() + " " + hours + ':' + minutes + ' ' + ampm;
    }

    /**
     * timeRemaining
     * @param  {Date} endDate
     * @return {Object}
     */
    static timeRemaining(endDate) {
        var t = Date.parse(endDate) - Date.parse(new Date());
        var seconds = Math.floor((t / 1000) % 60);
        var minutes = Math.floor((t / 1000 / 60) % 60);
        var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
        var days = Math.floor(t / (1000 * 60 * 60 * 24));
        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }
}
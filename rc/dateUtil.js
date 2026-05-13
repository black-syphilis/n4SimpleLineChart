/**
 * Date Utility Functions.
 *
 * @module nmodule/simpleLineChart/rc/simpleLineChartWidget/dateUtil
 * @private
 */
define([],
    function () {
        'use strict';

        return {
            formatDate: function formatDate(date, format, utc) {

                var MMMM = ['\x00', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                var MMM = ['\x01', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                var dddd = ['\x02', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                var ddd = ['\x03', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

                function dateParser(i, len) {
                    var s = i + '';
                    len = len || 2;
                    while (s.length < len) s = '0' + s;
                    return s;
                }

                var yDate = utc ? date.getUTCFullYear() : date.getFullYear();
                format = format.replace(/(^|[^\\])yyyy+/g, '$1' + yDate);
                format = format.replace(/(^|[^\\])yy/g, '$1' + yDate.toString().substr(2, 2));
                format = format.replace(/(^|[^\\])y/g, '$1' + yDate);

                var monthDate = (utc ? date.getUTCMonth() : date.getMonth()) + 1;
                format = format.replace(/(^|[^\\])MMMM+/g, '$1' + MMMM[0]);
                format = format.replace(/(^|[^\\])MMM/g, '$1' + MMM[0]);
                format = format.replace(/(^|[^\\])MM/g, '$1' + dateParser(monthDate));
                format = format.replace(/(^|[^\\])M/g, '$1' + monthDate);

                var theDate = utc ? date.getUTCDate() : date.getDate();
                format = format.replace(/(^|[^\\])dddd+/g, '$1' + dddd[0]);
                format = format.replace(/(^|[^\\])ddd/g, '$1' + ddd[0]);
                format = format.replace(/(^|[^\\])dd/g, '$1' + dateParser(theDate));
                format = format.replace(/(^|[^\\])d/g, '$1' + theDate);

                var theHour = utc ? date.getUTCHours() : date.getHours();
                format = format.replace(/(^|[^\\])HH+/g, '$1' + dateParser(theHour));
                format = format.replace(/(^|[^\\])H/g, '$1' + theHour);

                var theSHour = theHour > 12 ? theHour - 12 : theHour == 0 ? 12 : theHour;
                format = format.replace(/(^|[^\\])hh+/g, '$1' + dateParser(theSHour));
                format = format.replace(/(^|[^\\])h/g, '$1' + theSHour);

                var theMin = utc ? date.getUTCMinutes() : date.getMinutes();
                format = format.replace(/(^|[^\\])mm+/g, '$1' + dateParser(theMin));
                format = format.replace(/(^|[^\\])m/g, '$1' + theMin);

                var theSecs = utc ? date.getUTCSeconds() : date.getSeconds();
                format = format.replace(/(^|[^\\])ss+/g, '$1' + dateParser(theSecs));
                format = format.replace(/(^|[^\\])s/g, '$1' + theSecs);

                var theMillis = utc ? date.getUTCMilliseconds() : date.getMilliseconds();
                format = format.replace(/(^|[^\\])fff+/g, '$1' + dateParser(theMillis, 3));
                theMillis = Math.round(theMillis / 10);
                format = format.replace(/(^|[^\\])ff/g, '$1' + dateParser(theMillis));
                theMillis = Math.round(theMillis / 10);
                format = format.replace(/(^|[^\\])f/g, '$1' + theMillis);

                var amOrPM = theHour < 12 ? 'AM' : 'PM';
                format = format.replace(/(^|[^\\])TT+/g, '$1' + amOrPM);
                format = format.replace(/(^|[^\\])T/g, '$1' + amOrPM.charAt(0));

                var lowered = amOrPM.toLowerCase();
                format = format.replace(/(^|[^\\])tt+/g, '$1' + lowered);
                format = format.replace(/(^|[^\\])t/g, '$1' + lowered.charAt(0));

                var tz = -date.getTimezoneOffset();
                var K = utc || !tz ? 'Z' : tz > 0 ? '+' : '-';
                if (!utc) {
                    tz = Math.abs(tz);
                    var tzHrs = Math.floor(tz / 60);
                    var tzMin = tz % 60;
                    K += dateParser(tzHrs) + ':' + dateParser(tzMin);
                }
                format = format.replace(/(^|[^\\])K/g, '$1' + K);

                var valueDate = (utc ? date.getUTCDay() : date.getDay()) + 1;
                format = format.replace(new RegExp(dddd[0], 'g'), dddd[valueDate]);
                format = format.replace(new RegExp(ddd[0], 'g'), ddd[valueDate]);

                format = format.replace(new RegExp(MMMM[0], 'g'), MMMM[monthDate]);
                format = format.replace(new RegExp(MMM[0], 'g'), MMM[monthDate]);

                format = format.replace(/\\(.)/g, '$1');

                return format;
            }
        }
    });

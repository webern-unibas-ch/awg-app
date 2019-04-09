(function (angular) {

/*
       JavaScript functions for the Fourmilab Calendar Converter

                  by John Walker  --  September, MIM
              http://www.fourmilab.ch/documents/calendar/

                This program is in the public domain.
*/

/*
       extended (2009 - 2010) by Lukas Rosenthaler, Patrick Ryf, Tobias Schweizer
*/
/*
		modified as ANGULAR Plugin (2016) by Stefan Münnich
*/

	//INIT
	var J0000 = 1721424.5;                // Julian date of Gregorian epoch: 0000-01-01
	var J1970 = 2440587.5;                // Julian date at Unix epoch: 1970-01-01
	var JMJD  = 2400000.5;                // Epoch of Modified Julian Date system
	var J1900 = 2415020.5;                // Epoch (day 1) of Excel 1900 date system (PC)
	var J1904 = 2416480.5;                // Epoch (day 0) of Excel 1904 date system (Mac)

	var GREGORIAN_EPOCH = 1721425.5;

	var NormLeap = new Array("Normal year", "Leap year");

	var calendars = {
			GREGORIAN: {name: 'Gregorian', short: 'G', n_months: 12},
			JULIAN: {name: 'Julian', short: 'Ju', n_months: 12},
			JEWISH: {name: 'Jewish', short: 'Je', n_months: 13},
			FRENCH: {name: 'Revol.', short: 'R', n_months: 13}
	};

	var weekday = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
	//var weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

	var months = {
		GREGORIAN: ['ZERO', 'Jan', 'Feb', 'März', 'Apr', 'Mai', 'Juni', 'Juli', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
		// GREGORIAN: ['ZERO', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
		JULIAN: ['ZERO', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
		JEWISH: ['ZERO', 'Tishri', 'Heshvan', 'Kislev', 'Tevet', 'Shevat', 'AdarI', 'AdarII', 'Nisan', 'Iyyar', 'Sivan', 'Tammuz', 'Av', 'Elul'],
		FRENCH: ['ZERO', 'Vendemiaire', 'Brumaire', 'Frimaire', 'Nivose', 'Pluviose', 'Ventose', 'Germinal', 'Floreal', 'Prairial', 'Messidor', 'Thermidor', 'Fructidor', 'Extra']
	};

	var months_long = {
		GREGORIAN: ['ZERO', 'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
		// GREGORIAN: ['ZERO', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
		JULIAN: ['ZERO', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
		JEWISH: ['ZERO', 'Tishri', 'Heshvan', 'Kislev', 'Tevet', 'Shevat', 'AdarI', 'AdarII', 'Nisan', 'Iyyar', 'Sivan', 'Tammuz', 'Av', 'Elul'],
		FRENCH: ['ZERO', 'Vendemiaire', 'Brumaire', 'Frimaire', 'Nivose', 'Pluviose', 'Ventose', 'Germinal', 'Floreal', 'Prairial', 'Messidor', 'Thermidor', 'Fructidor', 'Extra']
	};

	//                          <snip> code </snip>             //

	//  MOD
	function mod(a, b) {
		return a - (b * Math.floor(a / b));
	}

	//  JWDAY
	function jwday(j) {
		j = Number(j);
		return mod(Math.floor((j + 1.5)), 7);
	}

	//  LEAP_GREGORIAN  --  Is a given year in the Gregorian calendar a leap year ?
	function leap_gregorian(year) {
	    year = parseInt(year);
	    return ((year % 4) == 0) && (!(((year % 100) == 0) && ((year % 400) != 0)));
	}

	//  GREGORIAN_TO_JD  --  Determine Julian day number from Gregorian calendar date
	function gregorian_to_jd(year, month, day)
	{
	    return (GREGORIAN_EPOCH - 1) +
	           (365 * (year - 1)) +
	           Math.floor((year - 1) / 4) +
	           (-Math.floor((year - 1) / 100)) +
	           Math.floor((year - 1) / 400) +
	           Math.floor((((367 * month) - 362) / 12) +
	           ((month <= 2) ? 0 : (leap_gregorian(year) ? -1 : -2)) + day);
	} //END gregorian_to_jd (func)

	//  JD_TO_GREGORIAN  --  Calculate Gregorian calendar date from Julian day
	function jd_to_gregorian(jd) {
	    var wjd, depoch, quadricent, dqc, cent, dcent, quad, dquad,
	        yindex, dyindex, year, yearday, leapadj;

	    wjd = Math.floor(jd - 0.5) + 0.5;
	    depoch = wjd - GREGORIAN_EPOCH;
	    quadricent = Math.floor(depoch / 146097);
	    dqc = mod(depoch, 146097);
	    cent = Math.floor(dqc / 36524);
	    dcent = mod(dqc, 36524);
	    quad = Math.floor(dcent / 1461);
	    dquad = mod(dcent, 1461);
	    yindex = Math.floor(dquad / 365);
	    year = (quadricent * 400) + (cent * 100) + (quad * 4) + yindex;
	    if (!((cent == 4) || (yindex == 4))) {
	        year++;
	    }
	    yearday = wjd - gregorian_to_jd(year, 1, 1);
	    leapadj = ((wjd < gregorian_to_jd(year, 3, 1)) ? 0
	                                                  :
	                  (leap_gregorian(year) ? 1 : 2)
	              );
	    month = Math.floor((((yearday + leapadj) * 12) + 373) / 367);
	    day = (wjd - gregorian_to_jd(year, month, 1)) + 1;
	    if (year <= 0) year--; // correction for PHPvar JULIAN_EPOCH = 1721423.5;

	    return new Array(year, month, day);
	} // END jd_to_gregorian (func)

	function jdc_to_date (jdc, cal) {
			jdc = parseInt(jdc);
			var dateobj = {};
			var tmparr;
			switch (cal) {
				case 'GREGORIAN':
				case 'gregorian': {
					tmparr = jd_to_gregorian(jdc);
					break;
				}
				case 'JULIAN':
				case 'julian': {
					tmparr = S.jd_to_julian(jdc);
					break;
				}
				case 'JEWISH':
				case 'jewish': {
					tmparr = S.jd_to_hebrew(jdc);
					break;
				}
				case 'FRENCH':
				case 'french': {
					tmparr = S.jd_to_french_revolutionary(jdc);
					break;
				}
			}
			dateobj.year = tmparr[0];
			dateobj.month = tmparr[1];
			dateobj.day = tmparr[2];
			dateobj.weekday = jwday(jdc);

			return dateobj;
		} // END jdc_to_date (func)


	/**
	 * Dateobject:
	 * - <i>name</i>.dateval1 (JDC)
	 * - <i>name</i>.dateval2 (JDC)
	 * - <i>name</i>.dateprecision1 ("DAY", "MONTH", "YEAR")
	 * - <i>name</i>.dateprecision2 ("DAY", "MONTH", "YEAR")
	 * - <i>name</i>.calendar ("GREGORIAN", "JULIAN", "JEWISH", "FRENCH")
	 */

	return dateConverter = function (dateobj) {
		var $that = this;
		var d1 = jdc_to_date(dateobj.dateval1, dateobj.calendar);
		var d2 = jdc_to_date(dateobj.dateval2, dateobj.calendar);
		var datestr = '';
		if (dateobj.dateprecision1 == dateobj.dateprecision2) {
			//
			// same precisions for start- and end-date
			//
			switch (dateobj.dateprecision1) {
				case 'DAY': {
					if ((d1.year == d2.year) && (d1.month == d2.month) && (d1.day == d2.day)) {
						datestr = '[' + weekday[d1.weekday] + '] ' + d1.day + '. ' + months[dateobj.calendar][d1.month] + ' ' + d1.year;
					}
					else {
						datestr = '[' + weekday[d1.weekday] + '] ' + d1.day + '. ' + months[dateobj.calendar][d1.month] + ' ' + d1.year + ' – [' + weekday[d2.weekday] + '] ' + d2.day + '. ' + months[dateobj.calendar][d2.month] + ' ' + d2.year;
					}
					break;
				}
				case 'MONTH': {
					if ((d1.year == d2.year) && (d1.month == d2.month)) {
						datestr = months[dateobj.calendar][d1.month] + ' ' + d1.year;
					}
					else {
						datestr = months[dateobj.calendar][d1.month] + ' ' + d1.year + ' – ' + months[dateobj.calendar][d2.month] + ' ' + d2.year;
					}
					break;
				}
				case 'YEAR': {
					if (d1.year == d2.year) {
						datestr = d1.year;
					}
					else {
						datestr = d1.year + '–' + d2.year;
					}
					break;
				}
			} // END switch(precision1)
		}
		else {
			//
			// different precisions for start- and end-date
			//
			switch (dateobj.dateprecision1) {
				case 'DAY': {
					datestr = '[' + weekday[d1.weekday] + '] ' +  d1.day + '. ' + months[dateobj.calendar][d1.month] + ' ' + d1.year;
					break;
				}
				case 'MONTH': {
					datestr = months[dateobj.calendar][d1.month] + ' ' + d1.year;
					break;
				}
				case 'YEAR': {
					datestr = d1.year;
					break;
				}
			} // switch(precision1)
			datestr += ' – ';
			switch (dateobj.dateprecision2) {
				case 'DAY': {
					datestr += '[' + weekday[d2.weekday] + '] ' +  d2.day + '. ' + months[dateobj.calendar][d2.month] + ' ' + d2.year;
					break;
				}
				case 'MONTH': {
					datestr += months[dateobj.calendar][d2.month] + ' ' + d2.year;
					break;
				}
				case 'YEAR': {
					datestr += d2.year;
					break;
				}
			} // END switch(precision2)
		}
		datestr += ' (' + calendars[dateobj.calendar].short + ')';

		return datestr;
	};
}(window.angular));

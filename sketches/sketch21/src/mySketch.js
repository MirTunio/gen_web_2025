// TUNIO 2022
// Age

born = new Date(1994, 8, 5, 12, 55, 0, 0);

function preload() {
  vhs_font = loadFont('VCR_OSD_MONO_1.001.ttf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(32);
  background(0);
  textFont(vhs_font);
  
  WWfont = textWidth("8");
  HHfont = textAscent("8");
}


function draw() {
  today = new Date();
  sec = today - born;
  //year_raw = sec / (1000 * 3600 * 24 * 365); 
  year_raw = sec / (1000 * 3600 * 24 * 365.2422); 
  
  background(0);
  fill(150, 0, 0);
  calc_font_size = (0.76 * windowWidth / WWfont) ; // 70;
  textSize(calc_font_size); 

  textAlign(LEFT, TOP);
  text(nf(year_raw, 2, 11), 0, 0);
  
  textAlign(LEFT, BOTTOM);
  text(sec, 0, height);
  
  age = getTimeFromYears(year_raw, sec);
  side_size = 1.35 * windowHeight / HHfont;
  textSize(side_size); 
  sp = side_size * 0.76;
  
  textAlign(RIGHT, BOTTOM);
  text('                     ' + nf(age[0], 3), width, height/2 - sp * 2);
  text('                     ' + nf(age[1], 3), width, height/2 - sp * 1);
  text('                     ' + nf(age[2], 3), width, height/2);
  text('                     ' + nf(age[3], 3), width, height/2 + sp + 1);
  text('                     ' + nf(age[4], 3), width, height/2 + sp * 2);
  text('                     ' + nf(age[5], 3), width, height/2 + sp * 3);
  text('                     ' + nf(age[6], 3), width, height/2 + sp * 4);
  
}



function getTimeFromYears( _years, _secs) {
    "use strict";

    var _hoursInEon            = 8765820000000     // eon =         1,000,000,000 years (billion)
        , _hoursInGalacticYear = 2016138600000     // galactic year = 230,000,000 years (230 million)
        , _hoursInEpoch        =    8765820000     // epoch =           1,000,000 years (million)
        , _hoursInMillenium    =       8765820     // millenium =           1,000 years
        , _hoursInCentury      =        876582   
        , _hoursInYear         =          8765.8128  // often cited as 8760, or 730 * 12  // 365.2425 days in year
        , _hoursInMonth        =           730.4844 // hours average per month for a 4-year period which includes 1 leap year
                                                   // average month has 30.436875 days, Gregorian calendar
        , _hoursInDay          =            24
        , _hoursInHour         =             1
        , _hoursInMinute       =             0.0166666666666667
        , _hoursInSecond       =             0.000277778
        , _hoursInMillisecond  =             0.000000277778       // A millisecond is one-thousandth of a second
        , _hoursInNanosecond   =             0.000000000000277778 // A nanosecond is one-billionth of a second


        //, totalHours = _years * _hoursInYear
        , totalHours = _secs / 1000 * _hoursInSecond
        
        , eons   = Math.floor(   totalHours
                    / _hoursInEon )

        , gyears = Math.floor( ( totalHours - ( eons * _hoursInEon ) )
                    / _hoursInGalacticYear ) * 0

        , epochs = Math.floor( ( totalHours - ( eons * _hoursInEon ) - ( gyears * _hoursInGalacticYear ) )
                    / _hoursInEpoch )

        , mills  = Math.floor( ( totalHours - ( eons * _hoursInEon ) - ( gyears * _hoursInGalacticYear ) - ( epochs * _hoursInEpoch ) )
                    / _hoursInMillenium )

        , cents  = Math.floor( ( totalHours - ( eons * _hoursInEon ) - ( gyears * _hoursInGalacticYear ) - ( epochs * _hoursInEpoch ) - ( mills * _hoursInMillenium ) )
                    / _hoursInCentury )

        , years  = Math.floor( ( totalHours - ( eons * _hoursInEon ) - ( gyears * _hoursInGalacticYear ) - ( epochs * _hoursInEpoch ) - ( mills * _hoursInMillenium ) - ( cents * _hoursInCentury ) )
                    / _hoursInYear )
    
        , months = Math.floor( ( totalHours - ( eons * _hoursInEon ) - ( gyears * _hoursInGalacticYear ) - ( epochs * _hoursInEpoch ) - ( mills * _hoursInMillenium ) - ( cents * _hoursInCentury ) - ( years * _hoursInYear ) )
                    / _hoursInMonth )
    
        , days   = Math.floor( ( totalHours - ( eons * _hoursInEon ) - ( gyears * _hoursInGalacticYear ) - ( epochs * _hoursInEpoch ) - ( mills * _hoursInMillenium ) - ( cents * _hoursInCentury ) - ( years * _hoursInYear ) - ( months * _hoursInMonth ) )
                    / _hoursInDay )
    
        , hours  = Math.floor( ( totalHours - ( eons * _hoursInEon ) - ( gyears * _hoursInGalacticYear ) - ( epochs * _hoursInEpoch ) - ( mills * _hoursInMillenium ) - ( cents * _hoursInCentury ) - ( years * _hoursInYear ) - ( months * _hoursInMonth ) - ( days * _hoursInDay ) )
                    / _hoursInHour )
    
        , mins  = Math.floor( ( totalHours - ( eons * _hoursInEon ) - ( gyears * _hoursInGalacticYear ) - ( epochs * _hoursInEpoch ) - ( mills * _hoursInMillenium ) - ( cents * _hoursInCentury ) - ( years * _hoursInYear ) - ( months * _hoursInMonth ) - ( days * _hoursInDay ) - ( hours * _hoursInHour ) )
                    / _hoursInMinute ) 

        , secs  = Math.floor( ( totalHours - ( eons * _hoursInEon ) - ( gyears * _hoursInGalacticYear ) - ( epochs * _hoursInEpoch ) - ( mills * _hoursInMillenium ) - ( cents * _hoursInCentury ) - ( years * _hoursInYear ) - ( months * _hoursInMonth ) - ( days * _hoursInDay ) - ( hours * _hoursInHour ) - ( mins * _hoursInMinute ) )
                    / _hoursInSecond )

        , msecs = Math.floor( ( totalHours - ( eons * _hoursInEon ) - ( gyears * _hoursInGalacticYear ) - ( epochs * _hoursInEpoch ) - ( mills * _hoursInMillenium ) - ( cents * _hoursInCentury ) - ( years * _hoursInYear ) - ( months * _hoursInMonth ) - ( days * _hoursInDay ) - ( hours * _hoursInHour ) - ( mins * _hoursInMinute ) - ( secs * _hoursInSecond ) )
                    / _hoursInMillisecond )

        , nsecs = Math.floor( ( totalHours - ( eons * _hoursInEon ) - ( gyears * _hoursInGalacticYear ) - ( epochs * _hoursInEpoch ) - ( mills * _hoursInMillenium ) - ( cents * _hoursInCentury ) - ( years * _hoursInYear ) - ( months * _hoursInMonth ) - ( days * _hoursInDay ) - ( hours * _hoursInHour ) - ( mins * _hoursInMinute ) - ( secs * _hoursInSecond ) - ( msecs * _hoursInMillisecond ) )
                    / _hoursInNanosecond )


        , _eonsPhrase   = ( eons   < 1 ? '' : eons   === 1 ? '1 eon'           : addCommas( eons   ) + ' eons'           )
        , _gyearsPhrase = ( gyears < 1 ? '' : gyears === 1 ? '1 galactic year' : addCommas( gyears ) + ' galactic years' )
        , _epochsPhrase = ( epochs < 1 ? '' : epochs === 1 ? '1 epoch'         : addCommas( epochs ) + ' epochs'         )
        , _millsPhrase  = ( mills  < 1 ? '' : mills  === 1 ? '1 millenium'     : mills  + ' millenia'  )
        , _centsPhrase  = ( cents  < 1 ? '' : cents  === 1 ? '1 century'       : cents  + ' centuries' )
        , _yearsPhrase  = ( years  < 1 ? '' : years  === 1 ? '1 year'          : years  + ' years'     )
        , _monthsPhrase = ( months < 1 ? '' : months === 1 ? '1 month'         : months + ' months'    )
        , _daysPhrase   = ( days   < 1 ? '' : days   === 1 ? '1 day'           : days   + ' days'      )
        , _hoursPhrase  = ( hours  < 1 ? '' : hours  === 1 ? '1 hour'          : hours  + ' hours'     )
        , _minsPhrase   = ( mins   < 1 ? '' : mins   === 1 ? '1 minute'        : mins   + ' minutes'   )
        , _secsPhrase   = ( secs   < 1 ? '' : secs   === 1 ? '1 second'        : secs   + ' seconds'   )
        , _msecsPhrase  = ( msecs  < 1 ? '' : msecs  === 1 ? '1 millisecond'   : addCommas( msecs ) + ' milliseconds' )
        , _nsecsPhrase  = ( nsecs  < 1 ? '' : nsecs  === 1 ? '1 nanosecond'    : addCommas( nsecs ) + ' nanoseconds'  )

        , _phrasePart = new Array(13)
        , _phrasesInUse = 0
        , _phrasesUsed  = 0
        , _joiner = ','
        , _result = ''
    ;


    ////////////////////////////////////////////////////
    // cosmetic adjustments
    if( eons > 999999 ) { _joiner = ';'; }
    if( secs > 0 || mins > 0 ) { _msecsPhrase = _nsecsPhrase = ''; } 
    ////////////////////////////////////////////////////

    _phrasePart[  0 ] = _eonsPhrase;
    _phrasePart[  1 ] = _gyearsPhrase;
    _phrasePart[  2 ] = _epochsPhrase;
    _phrasePart[  3 ] = _millsPhrase;
    _phrasePart[  4 ] = _centsPhrase;
    _phrasePart[  5 ] = _yearsPhrase;
    _phrasePart[  6 ] = _monthsPhrase;
    _phrasePart[  7 ] = _daysPhrase;
    _phrasePart[  8 ] = _hoursPhrase;
    _phrasePart[  9 ] = _minsPhrase;
    _phrasePart[ 10 ] = _secsPhrase;
    _phrasePart[ 11 ] = _msecsPhrase;
    _phrasePart[ 12 ] = _nsecsPhrase;

    // count the phrase pieces to use
    for( var i = 0; i < _phrasePart.length; i++ ) {
        if( _phrasePart[ i ].length ) { _phrasesInUse++; }
    }

    // assemble the output
    for( var i = 0; i < _phrasePart.length; i++ ) {
        if( _phrasePart[ i ].length ) {
            _result += _phrasePart[ i ];
            _phrasesUsed++;

            // only for the last phrase
            if( _phrasesInUse - _phrasesUsed === 1 ) {
                _result += ' and ';
            
            } else
            if( _phrasesInUse - _phrasesUsed > 0 ) {
                _result += ( _joiner + ' ' );
            }
        }
    }

    //return _result;
    return [years, months, days, hours, mins, secs, msecs];
};


function addCommas(t) {
    t += ""; var x = t.split("."), x1 = x[0], x2 = x.length > 1 ? "." + x[1] : "";
    for (var r = /(\d+)(\d{3})/; r.test(x1); ) x1 = x1.replace(r, "$1,$2");
    return x1 + x2;
};
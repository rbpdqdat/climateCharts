//from rcc html script

//var stnId = "DCAthr 9";
var stnId = "";
//stnId.concat("thr 9");
$(function() {
   $( "#from" ).datepicker({
    // defaultDate: "-1m",
     changeMonth: true,
     numberOfMonths: 1,
     changeYear: true,
     dateFormat: "yy-mm-dd",
     yearRange: "-120:+0",
     inline:true,
     cache: false,
     onClose: function( selectedDate ) {
     tday = $(this).datepicker('getDate');
     today = new Date(tday.getTime() + 155*86400000);
     dd = today.getDate();
     mm = today.getMonth(); //January is 0!
     yyyy = today.getFullYear(); 
     lastyear = new Date(tday.getTime() - 155*86400000);
     ldd = lastyear.getDate();
     lmm = lastyear.getMonth();
     lyyyy= lastyear.getFullYear();
//var firstDate = new Date(yyyy,00,01);
//var firstDate = new Date(lyyyy,lmm,ldd);
     firstDate = lastyear
//var lastDate = new Date(yyyy,mm,dd);
     lastDate = today
console.log(firstDate);

    edate = yyyy+'-'+mm+'-'+dd;
    sdate = lyyyy+'-'+lmm+'-'+ldd;
    recordminT = new Array();
    recordmaxT = new Array();
    reindexrMaxT = new Array();
    reindexrMinT = new Array();
    recordMaxD = new Array();
    recordMinD = new Array();
    reindexrMinTdate = new Array();
    reindexrMaxTdate = new Array();
     }
   });
});
/*var tday = new Date();
var today = new Date(tday.getTime() + 155*86400000);
var dd = today.getDate();
var mm = today.getMonth(); //January is 0!
var yyyy = today.getFullYear();
var lastyear = new Date(tday.getTime() - 155*86400000);
var ldd = lastyear.getDate();
var lmm = lastyear.getMonth();
var lyyyy= lastyear.getFullYear();
//var firstDate = new Date(yyyy,00,01);
//var firstDate = new Date(lyyyy,lmm,ldd);
var firstDate = lastyear
//var lastDate = new Date(yyyy,mm,dd);
var lastDate = today
console.log(firstDate);

var edate = yyyy+'-'+mm+'-'+dd;
var sdate = lyyyy+'-'+lmm+'-'+ldd;
var recordminT = new Array();
var recordmaxT = new Array();
var reindexrMaxT = new Array();
var reindexrMinT = new Array();
var recordMaxD = new Array();
var recordMinD = new Array();
var reindexrMinTdate = new Array();
var reindexrMaxTdate = new Array();
*/
Date.prototype.dayOfYear = function(){
    var j1= new Date(this);
    j1.setMonth(0, 0);
    return Math.round((this-j1)/8.64e7);
}

var uploader = function() {
$(getRecordMaxDays);
}

function postError() {
    alert("oops, error");
}

function getData(url, params) {
    var xdr, args, results,
        params_string = JSON.stringify(params);
    if (window.XDomainRequest) {
        xdr = new XDomainRequest();
        xdr.open("GET", url + "?params=" +    params_string);
        xdr.onload = function () {
            results = $.parseJSON(xdr.responseText);
            processResult(results);
        };
        xdr.onerror = postError;
        xdr.onprogress = $.noop();
        xdr.ontimeout = $.noop();
        setTimeout(function () {
            xdr.send();
        }, 0);
    } else {
        args = {params: params_string};
        $.ajax(url, {
            type: 'POST',
            data: args,
            crossDomain: true,
            success: processResult,
            error: postError
        });
    }
}

function getRecordData(url, params) {
    var xdr, args, results,
        params_string = JSON.stringify(params);
        args = {params: params_string};
        $.ajax(url, {
            type: 'POST',
            data: args,
            crossDomain: true,
            success: processRecords,
            error: postError
        });
}

function getMaxDays(){
        var url='http://data.rcc-acis.org/StnData';
        var params = {"elems":[{"name":"maxt"},{"name":"mint"},
                     {"name":"maxt","duration":"dly","normal":"1","prec":1},
                     {"name":"mint","duration":"dly","normal":"1","prec":1}],
                     "sid":stnId,"sDate":sdate,"eDate":edate}
        getData(url,params);
}

function getRecordMaxDays(){
        var url='http://data.rcc-acis.org/StnData';
        var params= {"elems":[{"name":"maxt","interval":"dly","duration":"dly","smry":
                    {"reduce":"max","add":"date"},"smry_only":1,"groupby":
                              ["year","01-01","12-31"]},
                    {"name":"mint","interval":"dly","duration":"dly","smry":{"reduce":"min","add":"date"},
                    "smry_only":1,"groupby":["year","01-01","12-31"]}],"sid":stnId,"sDate":"por"
                    ,"eDate":"por","meta":["name","state","valid_daterange","sids"]}
        getRecordData(url,params);
}


function processRecords(data) {
        if (typeof data.smry == 'undefined') {
                alert('Station is invalid or has no data.  Try another station (eg. HOU).');
        }
        else {
        //var sum = new Array();
        for(var i=0;i<data.smry.length;i++){
            for (var j=0;j<data.smry[i].length;j++){
               if (i== 0) {
                  if(data.smry[i][j] === "M"){recordmaxT[j] = null;} //if the data is missing it will not show the data value.
                  else{recordmaxT[j] = parseInt(data.smry[i][j],10);recordMaxD[j]=Date.parse(data.smry[i][j][1]);}
                  //console.log(Date.parse(data.smry[i][j][1]).getFullYear())
               } else {
                  if(data.smry[i][j] === "M"){recordminT[j] = null;} //if the data is missing it will not show the data value.
                  else{recordminT[j] = parseInt(data.smry[i][j],10);recordMinD[j]=Date.parse(data.smry[i][j][1]);}
              }
            }
        }
     }
    $(getMaxDays);
}



function leapYear(year)
{
  return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
}


function processResult(data){
        $('#container').empty();
        if (typeof data.data == 'undefined') {
                alert('Station is invalid or has no data.  Try another station (eg. HOU).');
        }
        else {
        //var sum = new Array();
        var minT = new Array();
        var minTave = new Array();
        var titleName = "Daily Max and Min Temperatures"
        var maxT = new Array();
        var maxTave = new Array();
        for(var i=0;i<data.data.length;i++){
                if(data.data[i][1] === "M"){maxT[i] = null;} //if the data is missing it will not show the data value.
                else{maxT[i] = parseInt(data.data[i][1],10);}
                if(data.data[i][2] === "M"){minT[i] = null;} //if the data is missing it will not show the data value.
                else{minT[i] = parseInt(data.data[i][2],10);}
                if(data.data[i][3] === "M"){maxTave[i] = null;} //if the data is missing it will not show the data value.
                else{maxTave[i] = parseFloat(data.data[i][3],10);}
                if(data.data[i][4] === "M"){minTave[i] = null;} //if the data is missing it will not show the data value.
                else{minTave[i] = parseFloat(data.data[i][4],10);}
                var tDate = (data.data[i][0]).split("-");
                //var indexDate = new Date(tDate[0],tDate[1]-1,tDate[2])
                var indexDate = new Date(tDate[0],tDate[1]-1,tDate[2])
                var indexNum = indexDate.dayOfYear()-1
                if ((!leapYear(tDate[0])) && (indexNum > 59)) {
                   indexNum=indexNum+1
                }
                reindexrMinT[i]=recordminT[indexNum];
                reindexrMaxTdate[i]=recordMaxD[indexNum];
                reindexrMaxT[i]=recordmaxT[indexNum]
                reindexrMinTdate[i]=recordMinD[indexNum];
                //console.log(tDate,recordminT[indexNum],recordmaxT[indexNum])

        //      if(i==0){sum[i] = gdd[i];}
        //      else{sum[i] = sum[i-1] + gdd[i];}
        }
        $('#container').highcharts({
                chart:{
                       zoomType: 'x'
                },
                title:{
                        text: titleName
                },
                subtitle:{
                        text: data.meta.name + " (" + data.meta.state + ")",
                        style: {
                                fontSize: '14px'
                        }
                },
                xAxis:{
                        type: 'datetime',
                        maxZoom: 3 * 24 * 3600000,
                        labels: {
                                style: {
                                        color: '#000000',
                                        fontSize: '14px'
                                }
                        }
                },
                yAxis:{
                        title:{
                                text: 'Temperatures °F',
                                style: {
                                        fontSize: '14px'
                               },
                        },
                        endOnTick:false,
                        labels: {
                                style: {
                                        color: '#000000'
                                }
                        },
                        min: recordminT.reduce(function(prev, curr) {
                               return prev < curr ? prev : curr;
                           }),
                        max: recordmaxT.reduce(function(prev, curr) {
                               return prev > curr ? prev : curr;
                             }),
                },
                tooltip: {
                    shared: false,
                    crosshairs: true,
                    formatter: function() {
                       var serie = this.series;
                       //console.log(serie.options.recordMaxDate);
                       //var j = serie.options.recordMaxDate[this.series.data.indexOf( this.point)]
                       var j = this.series.data.indexOf( this.point );
                       var s = '<b>' + Highcharts.dateFormat('%A, %b %e, %Y', this.x) + '</b><br>';
                       s += '<br> Record Max T ' + Highcharts.dateFormat('%Y',reindexrMaxTdate[j]) + ': ' + reindexrMaxT[j] + '</br>';
                       s += '<br> Daily Max T: ' + maxT[j] + '</br>';
                       s += '<br> Daily Max T Ave: ' + maxTave[j] + '</br>';
                       s += '<br> Daily Min T: ' + minT[j] + '</br>';
                       s += '<br> Daily Min T Ave: ' + minTave[j] + '</br>';
                       s += '<br> Record Min T '+ Highcharts.dateFormat('%Y',reindexrMinTdate[j]) +': '+reindexrMinT[j] + '</br><br></br>';
                       //var s = '<b>' + Highcharts.dateFormat('%A, %b %e, %Y', this.x) + '</b><br>';
                       //var s = '<b>' + j.getFullYear() + '</b>';//Highcharts.dateFormat('%A, %b %e, %Y', this.x) + '</b><br>';
                       //s += '<span style="color:' + serie.color + '">' + serie.options.name + '</span>: <b>' + this.y + '</b><br/>';
                       //$.each(serie.options.recordMaxDate, function() {
                       //    var s = '<b>' + this.getFullYear() + '</b> ';
                       //});
                    return s;
                    }
                },
                credits:{
                        text: 'Click and drag to zoom',
                        //href: 'http://www.rcc-acis.org/'
                },
                plotOptions: {
                        series: {
                                marker: {
                                        enabled: false
                                }
                        }
                },
                series:[{
                        name: 'Maximum Daily Temperature',
                        color: '#F00000',
                        type: 'line',
                        data: maxT,
                        pointStart: Date.UTC(lyyyy,lmm-1,ldd),
                        pointInterval: 24 * 3600 * 1000
                },{
                        name: 'Minimum Daily Temperature',
                        color: '#0404B4',
                        type: 'line',
                        data: minT,
                        pointStart: Date.UTC(lyyyy,lmm-1,ldd),
                        pointInterval: 24 * 3600 * 1000
                },{
                        name: 'Min Average Temp',
                        color: '#0704B4',
                        type: 'spline',
               dashStyle: 'Dot',
                        data: minTave,
                        pointStart: Date.UTC(lyyyy,lmm-1,ldd),
                        pointInterval: 24 * 3600 * 1000
                },{
                        name: 'Max Ave Temperature',
                        color: '#F11111',
                        type: 'spline',
                        dashStyle: 'Dot',
                        data: maxTave,
                        pointStart: Date.UTC(lyyyy,lmm-1,ldd),
                        pointInterval: 24 * 3600 * 1000
                },{
                        name: 'Record Max Temperature',
                        color: '#F55555',
                        type: 'spline',
                        dashStyle: 'Dot',
                        data: reindexrMaxT,
                        pointStart: Date.UTC(lyyyy,lmm-1,ldd),
                        pointInterval: 24 * 3600 * 1000
                },{
                        name : ' Record Min Temperature',
                        color: '#BBBBBB',
                        type: 'spline',
                        dashStyle: 'Dot',
                        data: reindexrMinT,
                        pointStart: Date.UTC(lyyyy,lmm-1,ldd),
                        pointInterval: 24 * 3600 * 1000
                }]

        });

        }
}



$(function() {
    var stations = [{value:"KABQ",label:"ALBUQUERQUE International  Airport"},
{value:"KADC",label:"Wadena, Wadena Municipal Airport"},
{value:"KALS",label:"San Luis Valley Regional"},
{value:"KAMA",label:"Amarillo International Airport"},
{value:"KAPA",label:"Denver Centennial Airport"},
{value:"KASE",label:"Aspen-Pitkin County Airport"},
{value:"KAUM",label:"Austin Municipal"},
{value:"KAUS",label:"Austin-Bergstrom International  Airport"},
{value:"KAXN",label:"Chandler Field"},
{value:"KBIL",label:"Billings Logan International Airport"},
{value:"KBIS",label:"Bismarck Municipal Airport"},
{value:"KBJI",label:"Bemidji"},
{value:"KBOI",label:"Boise Air Terminal"},
{value:"KBOS",label:"Boston Logan International"},
{value:"KBRD",label:"Brainerd-Crow Wing Co Airport"},
{value:"KBRO",label:"Brownsville"},
{value:"KBTR",label:"Baton Rouge Metro Ryan Field"},
{value:"KBUR",label:"Burbank-Glendale-Pasadena"},
{value:"KBWI",label:"Baltimore Washington International Airport"},
{value:"KCAG",label:"Craig Moffat Airport"},
{value:"KCDD",label:"Crane Lake, Scotts Seaplane Base"},
{value:"KCLT",label:"Charlotte/Douglas International"},
{value:"KCLH",label:"Columbus OH Airport"},
{value:"KCMY",label:"Sparta, Sparta / Fort McCoy Airport"},
{value:"KCOS",label:"Colorado Springs Muni"},
{value:"KCPR",label:"Casper/Natrona County International Airport"},
{value:"KCQT",label:"Los Angeles USC CAMPUS"},
{value:"KCRP",label:"Corpus Christi Airport"},
{value:"KCVG",label:"Cincinnati/N. KY International"},
{value:"KCYS",label:"Cheyenne Airport"},
{value:"KDCA",label:"Washington National Airport"},
{value:"KDEN",label:"Denver International Airport"},
{value:"KDFW",label:"Dallas/Ft. Worth International  Airport"},
{value:"KDHT",label:"Dalhart Municipal Airport"},
{value:"KDLH",label:"Duluth, Duluth International Airport"},
{value:"KEGE",label:"Eagle Co. Airport"},
{value:"KDTW",label:"Detroit Metropolitan"},
{value:"KEAU",label:"Eau Claire Chippawa Valley"},
{value:"KFAR",label:"Hector International Airport"},
{value:"KFSD",label:"Sioux Falls Foss Field"},
{value:"KGCC",label:"Gillette-Campbell County Airport"},
{value:"KGEG",label:"Spokane International Airport"},
{value:"KGFK",label:"Grand Forks International"},
{value:"KGJT",label:"Grand Junction WALKER FIELD"},
{value:"KGRI",label:"Grand Island Central NE Regional"},
{value:"KGXY",label:"Greeley, Greeley-Weld County Airport"},
{value:"KHDN",label:"Hayden, Yampa Valley Airport"},
{value:"KHIB",label:"CHISHOLM-HIBBING Airport"},
{value:"KHOB",label:"Hobbs / Lea County"},
{value:"KHTS",label:"TRI-STATE Airport"},
{value:"KHYR",label:"Hayward Municipal Airport"},
{value:"KIAH",label:"Houston Intercontinental"},
{value:"KIND",label:"Indianapolis International  Airport"},
{value:"KIWD",label:"Ironwood, Gogebic-Iron County Airport"},
{value:"KLAS",label:"McCarran International Airport"},
{value:"KLAX",label:"Los Angeles Interntl Airport"},
{value:"KLBB",label:"Lubbock International Airport"},
{value:"KLGA",label:"New York LaGuardia Airport"},
{value:"KLIT",label:"Little Rock Adams FIELD"},
{value:"KLNK",label:"Lincoln Municipal Airport"},
{value:"KPDX",label:"Portland International Airport"},
{value:"KPHL",label:"Philadelphia International Airport"},
{value:"KPHX",label:"Phoenix Airport"},
{value:"KLNL",label:"Land O' Lakes, Kings Land O' Lakes Airport"},
{value:"KMCI",label:"Kansas City International Airport"},
{value:"KMCO",label:"Orlando International Airport"},
{value:"KMKT",label:"Mankato, Mankato Regional Airport"},
{value:"KMOT",label:"Minot International Airport"},
{value:"KMSP",label:"Minneapolis-St Paul International"},
{value:"KMZH",label:"Moose Lake, Moose Lake Carlton County Airport"},
{value:"KOMA",label:"Omaha Eppley Airport"},
{value:"KORD",label:"Chicago OHare Airport"},
{value:"KNKX",label:"Mcas Miramas"},
{value:"KRIL",label:"Rifle/Garfiled Rgnl"},
{value:"KSAC",label:"Sacramento AP"},
{value:"KSEA",label:"Seattle Tacoma Airport"},
{value:"KSLC",label:"Salt Lake City Intl Airport"},
{value:"KSFO",label:"San Francisco WSO AP"},
{value:"KSBS",label:"Steamboat Springs"}];


    $( "#cityname" ).autocomplete({
      source: stations,
               focus: function( event, ui ) {
               $( "#cityname" ).val( ui.item.label );
                  return false;
               },
            select: function( event, ui ) {
               $( "#cityname" ).val( ui.item.label );
               $( "#stnid" ).val(ui.item.value);
              // $( "#stnid-id" ).val( ui.item.value );
              // $( "#stnid-description" ).html( ui.item.desc );
               stnId = ui.item.value;
               //console.log(stnId);
               return false;
            }
    })
     .data( "ui-autocomplete" )._renderItem = function( ul, item ) {
            return $( "<li>" )
            .append( "<a>" + item.label + "<br></a>" )
            //.append( "<a>" + item.label + "<br>" + item.desc + "</a>" )
            .appendTo( ul );
         };
  });

$(function () { // this is equiv to 'jQuery(document).ready(function(){'
    $('#climindex-form').submit( function(e) {
           e.preventDefault();
           uploader();
     });
});



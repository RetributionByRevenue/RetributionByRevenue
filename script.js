  // ID of the Google Spreadsheet
  var spreadsheetID = "1IneAA3Q68GV1Kl4uei-FWPFfiVSvF6xWSr2B7ks-cqg";
  //https://spreadsheets.google.com/feeds/cells/1IneAA3Q68GV1Kl4uei-FWPFfiVSvF6xWSr2B7ks-cqg/1/public/full?alt=json   
  // Make sure it is public or set to Anyone with link can view 
  var url = "https://spreadsheets.google.com/feeds/cells/" + spreadsheetID + "/1/public/full?alt=json"; //this is the part that's changed

jQuery.extend({
  getValues: function() {
      var result = null;
      var temp = null
      $.ajax({
          url: 'https://spreadsheets.google.com/feeds/cells/1IneAA3Q68GV1Kl4uei-FWPFfiVSvF6xWSr2B7ks-cqg/1/public/full?alt=json',
          type: 'get',
          dataType: 'json',
          async: false,
          cache: false,
          success: function(data) {
              result = data;
              temp = (result.feed.entry[0].content.$t)
              time = result.feed.entry[3].content.$t
              $('#timestamp').html(time);
              $('#currentBalance').text((parseFloat(temp).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')));
              document.title='$'+(parseFloat(temp).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'))
          }
      });
    return result;
  },
  getEth: function() {
      var result = null;
      var temp = null
      $.ajax({
          url: 'https://poloniex.com/public?command=returnOrderBook&currencyPair=USDT_ETH&depth=10',
          type: 'get',
          dataType: 'json',
          async: false,
          cache: false,
          success: function(data) {
            temp = "Live Eth Price: $"+(parseFloat(data.asks[0][0]).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'))
            result = data
            //console.log(1)
            $(".apexcharts-title-text").text(temp)
          }
      });
    return result;
  }
});


//Non Blocking Polling
var sleep = time => new Promise(resolve => setTimeout(resolve, time))
var poll = (promiseFn, time) => promiseFn().then(
             sleep(time).then(() => poll(promiseFn, time)))
poll(() => new Promise(() => $.getEth()), 10000)

//Non Blocking Polling
var sleep = time => new Promise(resolve => setTimeout(resolve, time))
var poll = (promiseFn, time) => promiseFn().then(
             sleep(time).then(() => poll(promiseFn, time)))
poll(() => new Promise(() => $.getValues()), 10000)

window.values = null

function applyDom(){
  //console.log(1)
  var results = $.getValues();
  let values = (results.feed.entry)
  let s =[]
  for(let i=0 ; i<=3;i++){
              let currentValue=values[i];
              s.push(currentValue.content.$t)
  }
  let netWorthArray = []
  for(let i=4 ; i<=values.length-1;i++){
    let currentValue=values[i]
    netWorthArray.push(currentValue.content.$t)
  }

  let currentBalance = (parseFloat(s[0]).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
  let stringSlice = s[1].slice(0,2);
  let stringInclude = stringSlice.includes("-",0)
  $('#currentBalance').text(currentBalance);
  if (stringInclude){
      $('#renkoTrend').html("Bullish");
  }
  else{
      $('#renkoTrend').html("Bearish");
  };
  let holdings = s[2].split("!");
  let usdHoldings = parseFloat(holdings[0]).toFixed(3);
  let ethStringInclude = s[2].includes("e",0)
  let ethHoldings = holdings[1];
  if (ethStringInclude){
    $('#renkoBrick').html(usdHoldings+"<br> ETH: 0.00");
  }
  else{
    $('#renkoBrick').html(usdHoldings+"<br> ETH: "+ethHoldings);
  }
  $('#timestamp').html(s[3]);
  window.values = netWorthArray
  //setTimeout(applyDom(),80000)

  
}

applyDom()
/*
setTimeout(
$('#currentBalance').text(    JSON.stringify((window.list).slice(-1))       ),
30000
)*/

$('.instaPic').click(function(){
  window.open('https://www.instagram.com/slay_the_normies/', '_blank'); 
})


$('.githubPic').click(function(){
    window.open(' https://github.com/RetributionByRevenue', '_blank'); 
})

$('.youtubePic').click(function(){
    window.open('https://www.youtube.com/channel/UCFGPA5ZV9BZIhR7w8EbS-hg', '_blank'); 
})

let charttitle = 'test'
var options = {
  series: [{
  name: "Balance",
  data: window.values
}],
  chart: {
  type: 'area',
  height: 350
},
stroke: {
  curve: 'stepline',
},
dataLabels: {
  enabled: false
},
markers: {
  hover: {
    sizeOffset: 4
  }
},
title: {
  text: "Live Eth Price: $"+parseFloat($.getEth().asks[0][0]).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'),
  align: 'left',
  margin: 10,
  offsetX: 90,
  offsetY: 25,
  style: {
    fontSize:  '12px',
    fontWeight:  'bold',
    color:  '#FFFFFF'
  },
},
xaxis:{
 labels: {
   
     show: false,
   
   
    style: {
      colors: "#FFFFFF"
    }
  },
  title: {
   text: "Day of The Year",
   style: {
     color: "#FFFFFF"
   }
 },
 axisTicks: {
   show: false
 },
 tooltip: {
   enabled: false
 }
},
yaxis:[
 {
 axisTicks: {
   show: true
 },
 axisBorder: {
   show: true,
   color: "#FFFFFF"
 },
 labels: {
   style: {
     colors: "#FFFFFF"
   }
 },
 title: {
   text: "Balance",
   style: {
     color: "#FFFFFF"
   }
 }
}
],
};

var chart = new ApexCharts(document.querySelector("#chart"), options);
chart.render();

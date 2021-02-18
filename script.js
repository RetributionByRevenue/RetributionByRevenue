       // ID of the Google Spreadsheet
       var spreadsheetID = "1IneAA3Q68GV1Kl4uei-FWPFfiVSvF6xWSr2B7ks-cqg";
       //https://spreadsheets.google.com/feeds/cells/1IneAA3Q68GV1Kl4uei-FWPFfiVSvF6xWSr2B7ks-cqg/1/public/full?alt=json   
       // Make sure it is public or set to Anyone with link can view 
       var url = "https://spreadsheets.google.com/feeds/cells/" + spreadsheetID + "/1/public/full?alt=json"; //this is the part that's changed
       var myjson       
       function everyting(){$.getJSON(url, function(data){
        
        let s = [];
        let netWorthArray = []
        values=data.feed.entry

        for(let i=0 ; i<=3;i++){
            let currentValue=values[i];
            s.push(currentValue.content.$t)
        }
        let currentBalance = (parseFloat(s[0]).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
        let stringSlice = s[1].slice(0,2);
        let stringInclude = stringSlice.includes("-",0)
        $('#currentBalance').html(currentBalance);
        if (stringInclude){
            $('#renkoTrend').html("Bullish");
        }
        else{
            $('#renkoTrend').html("Bearish");
        };
        let holdings = s[2].split("!");
        let usdHoldings = parseFloat(holdings[0]).toFixed(3);
        let ethHoldings = holdings[1];
        $('#renkoBrick').html(usdHoldings+" Eth: "+ethHoldings);
        $('#timestamp').html(s[3]);

        $('#liveChartButton').click(function(){
            $('#chart').css('visibility','visible')
        })

        //console.log((currentBalance*0.0683).toFixed(2))

        for(let i=4 ; i<=values.length-1;i++){
            let currentValue=values[i]
            netWorthArray.push(currentValue.content.$t)
        }
       
        var options = {
             series: [{
             data: netWorthArray
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

    $('.instaPic').click(function(){
      window.open('https://www.instagram.com/slay_the_normies/', '_blank'); 
    })
    
    
    $('.githubPic').click(function(){
        window.open(' https://github.com/RetributionByRevenue', '_blank'); 
    })
    
    $('.youtubePic').click(function(){
        window.open('https://www.youtube.com/channel/UCFGPA5ZV9BZIhR7w8EbS-hg', '_blank'); 
    })
    setInterval(everyting,30000)
  }

);
}
  everyting();
  
  //setInterval(callbackFuncWithData, 30000);        

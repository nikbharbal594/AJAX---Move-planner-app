
function loadData() {
    
    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $wikiHeaderElem = $('#wikipedia-header');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $weatherHeaderElem = $('#weather-header');
    var $weatherInfo= $('#weather-info');
    var $mapElem = $('#map-container');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // get form input values
    var street = $('#street').val();
    var city = $('#city').val();
    var state = $('#state').val();
    var locStr = street + ", " + city + ", " + state;
    var srcStreet = "http://maps.googleapis.com/maps/api/streetview?size=800x600&location=" + locStr;
    var srcMap = "https://www.google.com/maps/embed/v1/search?q=" + locStr + "&key=AIzaSyANFk4lEdBAVxEpz949na0ucdgrUj875WM";
    
    //load streetview bg image
    $body.append('<img class="bgimg" src="' + srcStreet + '">');

    $greeting.text('Take a look at where you are going to live!');
    
    //load map of address location
    $mapElem.append('<iframe class="map" src="' + srcMap + '" allowfullscreen></iframe>');

    //load weather information
    $.ajax({
        url : "http://api.wunderground.com/api/72927e9f285fe572/geolookup/conditions/q/" + city + ", " + state + ".json",
        dataType : "jsonp",
        success : function(data){
            $weatherHeaderElem.text("Current weather conditions in " + data.current_observation.display_location.full);
            var location = data.location.city;
            var cond = data.current_observation.weather;
            var temp_f = data.current_observation.temp_f;
            var temp_c = data.current_observation.temp_c;
            var feelslike_f = data.current_observation.feelslike_f;
            var feelslike_c = data.current_observation.feelslike_c;
            var humidity = data.current_observation.relative_humidity;
            var wind_dir = data.current_observation.wind_dir;
            var wind_kph = data.current_observation.wind_kph;
            var wind_mph = data.current_observation.wind_mph;
            var url = data.current_observation.forecast_url;
            $weatherInfo.text("");
            $weatherInfo.append('<li class="weather-info">' + cond + '</li>');
            $weatherInfo.append('<li class="weather-info">' + temp_f + ' °F (' + temp_c + ' °C)' + '</li>');
            $weatherInfo.append('<li class="weather-info">' + 'Feels like: ' + feelslike_f + ' °F (' + feelslike_c + ' °C)' + '</li>');
            $weatherInfo.append('<li class="weather-info">' + 'Humidity: ' + humidity + '</li>');
            $weatherInfo.append('<li class="weather-info">' + 'Wind: ' + wind_mph + ' mph (' + wind_kph + ' kph) ' + wind_dir + '</li>');
            $weatherInfo.append('<a href="'+ url + '"><p style="text-align:right">Detailed forecast</p></a>');
        }
    });

    //set timeout for Wikipedia error handling
    var timeOut = setTimeout(function(){
        $wikiHeaderElem.text("Wikipedia articles could not be loaded for the location provided.");
    },5000);
        
    //load Wikipedia articles
    $.ajax({
        url: "https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=" + city + ", " + state, 
        dataType: "jsonp",
        success: function(data){
            articleTitles = data[1];
            articleLinks = data[3];
            $wikiHeaderElem.text("Wikipedia articles about your city");
            for(var i=0; i<articleTitles.length; i++){
                $wikiElem.append('<li class="article">' + '<a href=' + articleLinks[i] + '>' + articleTitles[i] + '</a></li>');
            }
            clearTimeout(timeOut);
        }
    });  
    
    //load NYT articles
    $.getJSON("https://api.nytimes.com/svc/search/v2/articlesearch.json?" + "api-key=c4ac412063d7475cbec9e0fa8956f248&q=" + city + "&fq=" + state,function(data){ 
        $nytHeaderElem.text("What's been going on in/around your city lately?");       
        //console.log(data);
        var articles = data.response.docs;
        for(var i=0; i<articles.length; i++){
           $nytElem.append('<li class="article">' + '<a href=' + articles[i].web_url + '>' + articles[i].headline.main + '</a>' +'<p>' + articles[i].snippet + '</p>' + '</li>');
        }
    }).fail(function(){ $nytHeaderElem.text("The New York Times articles could not be loaded for the location provided."); });
    
    return false;
};

$('#form-container').submit(loadData);

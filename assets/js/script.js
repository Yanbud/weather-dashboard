var cityFormEl = document.querySelector('#user-form');
var cityButtonsEl = document.querySelector('#city-buttons');
var cityInputEl = document.querySelector('#cityname');
var days5El = document.querySelector('#days5-container');
var todayEl = document.querySelector('#today-container');
var subtitle = document.querySelector('.subtitle');
var icon = document.querySelector('#icon');
var APIKey = '666640822dd1106a70aa8c23f9a8e0d0';
var formSubmitHandler = function(event) {
    event.preventDefault();
    var city = cityInputEl.value.trim();
    city.charAt(0).toUpperCase();
    city = city.charAt(0).toUpperCase() + city.slice(1);
    if (city) {
        if (!cityList.includes(city)) {
            cityList.push(city);
        }
        cityList.reverse();
        cityInputEl.value = '';
        getCity(city);
        storeCity();
        init();
        days5El.textContent = '';
        todayEl.textContent = '';
        cityInputEl.value = '';
    } else {
        alert('Please enter a city name');
    }
};

var buttonClickHandler = function(event) {
    // `event.target` is a reference to the DOM element of what city button was clicked on the page
    var city = event.target.getAttribute('data-city');
    // If there is no city read from the button, don't attempt to fetch data
    if (city) {
        getCity(city);
        days5El.textContent = '';
        todayEl.textContent = '';
        cityInputEl.value = '';
    }
};

var getCity = function(city) {
    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&exclude=minutely,hourly,alerts&cnt=40&units=imperial&appid=' + APIKey;
    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    var lat = data.coord.lat
                    var lon = data.coord.lon
                    dataOnecall(lat, lon, city);
                });
            } else {
                alert('Error: ' + response.statusText);
            }
        })
        .catch(function(error) {
            alert('Unable to connect to OpenWeatherMap');
        });
};

var dataOnecall = function(lat, lon, city) {
    var apiUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&exclude=minutely,hourly,alerts&units=imperial&appid=' + APIKey;
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                displayToday(data, city);
                display5days(data);
                console.log(data)
            });
        } else {
            alert('Error: ' + response.statusText);
        }
    });
};
var displayToday = function(data, city) {
    var day = new Date(data.current.dt * 1000);
    var nowDate = day.getMonth() + 1 + '/' + day.getDate() + '/' + day.getFullYear()
    var iconCode = data.daily[0].weather[0].icon;
    var imgSrc = 'http://openweathermap.org/img/wn/' + iconCode + '.png'
    var icon = document.createElement('img');
    icon.setAttribute('src', imgSrc);
    var titleEl = document.createElement('h2');
    titleEl.textContent = city + '(' + nowDate + ')';
    titleEl.classList = 'title';
    var detailTemp = document.createElement('div');
    detailTemp.textContent = 'Temp:   ' + data.current.temp + ' °F';
    var detailWind = document.createElement('div');
    detailWind.textContent = 'Wind:   ' + data.current.wind_speed + ' MPH';
    var detailHumidity = document.createElement('div');
    detailHumidity.textContent = 'Humidity:   ' + data.current.humidity + '%';
    var detailUV = document.createElement('div');
    var detailUVindex = document.createElement('span');
    var num = data.current.uvi;
    if (num >= 11) {
        detailUVindex.classList = 'level-extreme';
    } else if (num >= 8) {
        detailUVindex.classList = 'level-veryhigh';
    } else if (num >= 6) {
        detailUVindex.classList = 'level-high';
    } else if (num >= 3) {
        detailUVindex.classList = 'level-moderate';
    } else {
        detailUVindex.classList = 'level-low';
    }
    detailUVindex.textContent = num;
    detailUV.append('UV Index:   ', detailUVindex);
    titleEl.append(icon);
    todayEl.append(titleEl, detailTemp, detailWind, detailHumidity, detailUV);
    todayEl.classList.add('today')
}

var display5days = function(data) {
    if (data.daily.length === 0) {
        days5El.textContent = 'No weather forecast.';
        return;
    }
    subtitle.textContent = data.daily.length - 3 + '-Day Forecast';
    for (var i = 1; i < data.daily.length - 2; i++) {
        var day = new Date(data.daily[i].dt * 1000);
        var date = day.getMonth() + 1 + '/' + day.getDate() + '/' + day.getFullYear();
        var weatherEl = document.createElement('div');
        weatherEl.classList = 'list-item';
        var titleEl = document.createElement('h2');
        titleEl.textContent = date;
        weatherEl.appendChild(titleEl);
        var iconEl = document.createElement('img');
        iconEl.classList = 'status-icon';
        var iconCode = data.daily[i].weather[0].icon;
        var imgSrc = 'http://openweathermap.org/img/wn/' + iconCode + '.png'
        iconEl.setAttribute('src', imgSrc)
        weatherEl.appendChild(iconEl);
        var detailTemp = document.createElement('div');
        detailTemp.textContent = 'Temp:   ' + data.daily[i].temp.day + ' °F';
        var detailWind = document.createElement('div');
        detailWind.textContent = 'Wind:   ' + data.daily[i].wind_speed + ' MPH';
        var detailHumidity = document.createElement('div');
        detailHumidity.textContent = 'Humidity:   ' + data.daily[i].humidity + '%';
        weatherEl.append(detailTemp, detailWind, detailHumidity);
        days5El.append(weatherEl);
    }
}
var cityList = [];
var displayCity = function() {
    cityButtonsEl.innerHTML = '';
    for (var i = 0; i < cityList.length; i++) {
        var cityName = cityList[i];
        var button = document.createElement('button');
        button.textContent = cityList[i];
        button.setAttribute('data-city', cityName);
        button.classList.add('btn');
        cityButtonsEl.appendChild(button);
    }
}
var init = function() {
    var lastCity = JSON.parse(localStorage.getItem('cityList'));
    if (lastCity !== null) {
        cityList = lastCity;
    }
    displayCity();
}
var storeCity = function() {
    localStorage.setItem('cityList', JSON.stringify(cityList));
}
init();
cityFormEl.addEventListener('submit', formSubmitHandler);
cityButtonsEl.addEventListener('click', buttonClickHandler);
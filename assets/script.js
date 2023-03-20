// $( document ).ready(function() {}forecast

let APIKey = "800568ca8ac1381d6a664d50c4c201ee";

// Bringing in existing HTML elements
let cityEl = $("#search-input");
let searchBtn = $("#search-button");
let todayForecastSec = $("#today");
let futureForecastSec = $("#forecast");
searchBtn.on("click", search);
searchBtn.addClass("btn btn-primary search-btn");
let city = cityEl.val().trim();

// Base URL for current weather forecast
function displayCurrentForecast(city) {
  $("#today").empty();

  let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`;

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    // Converting temp from kelvin to degrees celsius
    let tempInCelsius = (response.main.temp - 273.15).toFixed(2);
    // Setting up elements for current weather forecast
    let todayForecastDiv = $("<div>");
    todayForecastDiv.attr("id", "today-forecast-div");
    let headerEl = $("<h2>");
    let weatherImg = $("<img>");
    let weatherListEl = $("<ul>");
    weatherListEl.addClass("weather-list-items");

    //Appending elements for current weather forecast
    todayForecastSec.append(todayForecastDiv);
    todayForecastDiv.append(headerEl);
    todayForecastDiv.append(weatherListEl);
    headerEl.append(weatherImg);

    //Heading for current weather
    let cityName = response.name;
    let date = moment.unix(response.dt).format("DD/MM/yyyy");
    let imageURL = `https://openweathermap.org/img/w/${response.weather[0].icon}.png`;

    //Setting values for new HTML elements
    weatherImg
      .attr("src", imageURL)
      .attr("alt", `${response.weather[0].description}`);
    headerEl.text(cityName + " " + "(" + date + ")").css("font-weight", "bold");
    headerEl.append(weatherImg);

    let weatherIcon = response.weather[0].icon;
    let temp = response.main.temp;
    let humidity = response.main.humidity;
    let windSpeed = response.wind.speed;

    let tempLi = $("<li>")
      .addClass("current-weather-item")
      .text(`Temp: ${tempInCelsius} ℃`);
    let windLi = $("<li>")
      .addClass("current-weather-item")
      .text(`Wind: ${windSpeed} KPH`);
    let humdityLi = $("<li>")
      .addClass("current-weather-item")
      .text(`Humidity: ${humidity}%`);
    weatherListEl.append(tempLi, windLi, humdityLi);
  });
}

function search(event) {
  event.preventDefault();
  let city = cityEl.val();

  let locationCoords = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${APIKey}`;
  // Running ajax call to check that city entered is valid
  $.ajax({
    url: locationCoords,
    method: "GET",
  }).then(function (response) {
    let responseLength = response.length;
    if (responseLength > 0) {
      setLocationSearchHistory(city);
      displaySearchHistory();
      displayFutureForecast(city);
      displayCurrentForecast(city);
      console.log(response);
    } else {
      alert("Please enter a valid city name.");
    }
  });
}

function isCityValid(city) {
  let locationCoords = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${APIKey}`;

  $.ajax({
    url: locationCoords,
    method: "GET",
  }).then(function (response) {
    let responseLength = response.length;
    if (responseLength > 0) {
      return true;
    } else {
      return false;
    }
  });
}

// Create button dynamically for each location in location array, set value, attribute and add class
function displaySearchHistory() {
  let historyDiv = $("#history");
  historyDiv.empty();
  $.each(getLocationSearchHistory(), function (position, location) {
    let locationBtn = $("<button>");
    locationBtn.text(location);
    locationBtn.attr("location", location);
    locationBtn.attr("data-name", location);
    locationBtn.addClass("btn btn-primary location-btn");

    historyDiv.append(locationBtn);
    //   locationBtn.on("click", displayWeatherData);
  });
}

// function to get location searches
function getLocationSearchHistory() {
  let storedLocationSearchHistory = JSON.parse(
    localStorage.getItem("locationArrayKey")
  );
  if (storedLocationSearchHistory) {
    return storedLocationSearchHistory;
  } else {
    return [];
  }
}

// function to add locations to search history
function setLocationSearchHistory(location) {
  let storedLocationSearchHistory = getLocationSearchHistory();
  if (storedLocationSearchHistory.includes(location)) {
    return;
  }
  storedLocationSearchHistory.unshift(location);
  localStorage.setItem(
    "locationArrayKey",
    JSON.stringify(storedLocationSearchHistory)
  );
}

function displayFutureForecast(city) {
  $("#forecast").empty();
  let locationCoords = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${APIKey}`;

  $.ajax({
    url: locationCoords,
    method: "GET",
  }).then(function (response) {
    let lat = response[0].lat;
    let lon = response[0].lon;
    getForecast(lat, lon);
  });

  // Set ajax call for future forecast
  function getForecast(lat, lon) {
    let forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}`;
    $.ajax({
      url: forecastURL,
      method: "GET",
    }).then(function (response) {
      let heading = $("<h3>")
        .text("5-Day Forecast:")
        .addClass("forecast-heading")
        .css("font-weight", "bold");
      futureForecastSec.append(heading);
      let forecastContainer = $("<div>");
      forecastContainer.addClass("forecast-container row");
      futureForecastSec.append(forecastContainer);
      for (let i = 0; i < 5; i++) {
        let day = $("<div>")
          .addClass("day card col-lg-2 col-md-2.4 col-sm-6 text-center")
          .attr("id", `day-${[i]}`);
        let dateArrayIndex = +([i] * 8 + 4);
        let date = moment
          .unix(response.list[dateArrayIndex].dt)
          .format("DD/MM/yyyy");
        let dateEl = $("<h5>")
          .attr("id", `date-${[i]}`)
          .text(date);
        let weatherImg = $("<img>")
          .attr("id", `img-day-${[i]}`)
          .attr("width", "50%")
          .attr(
            "alt",
            `${response.list[dateArrayIndex].weather[0].description}`
          )
          .css("margin", "auto");
        let forecastImageURL = `https://openweathermap.org/img/w/${response.list[dateArrayIndex].weather[0].icon}.png`;
        weatherImg.attr("src", forecastImageURL);
        let weatherListEl = $("<ul>").attr("id", `weather-list-${[i]}`);
        weatherListEl.addClass("weather-list-items");
        forecastContainer.append(day);

        day.append(dateEl);
        day.append(weatherImg);
        day.append(weatherListEl);
        let tempInCelsius = (
          response.list[dateArrayIndex].main.temp - 273.15
        ).toFixed(2);
        let tempEl = $("<li>")
          .attr("id", `temp-${[i]}`)
          .text(`Temp: ${tempInCelsius} ℃`);
        let windEl = $("<li>")
          .attr("id", `wind-${[i]}`)
          .text(`Wind: ${response.list[dateArrayIndex].wind.speed} KPH`);
        let humidityEl = $("<li>")
          .attr("id", `humidity-${[i]}`)
          .text(`Humidity: ${response.list[dateArrayIndex].main.humidity}%`);
        weatherListEl.append(tempEl, windEl, humidityEl);
      }
    });
  }
}

// Updating location for current weather when button clicked
$(document).on("click", ".location-btn", updateForecasts);

function updateForecasts(event) {
  const city = $(event.target).attr("data-name");
  cityEl.val(city);
  displayFutureForecast(city);
  displayCurrentForecast(city);
}

displaySearchHistory();

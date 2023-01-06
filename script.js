// $( document ).ready(function() {}

let APIKey = "800568ca8ac1381d6a664d50c4c201ee";

// Bringing in existing HTML elements
let cityEl = $("#search-input");
let searchBtn = $("#search-button");
let todayForecastSec = $("#today");
let futureForecastSec = $("#forecast");
searchBtn.on("click", search);
searchBtn.addClass("btn btn-primary search-btn");
let city = cityEl.val().trim();
// Need to convert city name into lat and lon value to make API call, and then pass lat and lon into base URL to get 5 day forecast

// Hardcoded lat and lon for now but need to get this from API call response depending on user input
// let lat = 52.68064;
// let lon = -1.8243991722405983;

// Base URL for current weather forecast - hardcoded city for now but need to set based on user input
function displayCurrentForecast(city) {
  $("#today").empty();
  // const locationTitleCurrent = $(event.target).attr("data-name");
  // console.log(locationTitleCurrent);
  let queryURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`;

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    console.log(response);
    // Converting temp from kelvine to degrees celsius
    let tempInCelsius = (response.main.temp - 273.15).toFixed(2);
    console.log(
      `You are in ${response.name}, the temperature is ${tempInCelsius} degrees celsius`
    );
    // Setting up elements for current weather forecast
    let todayForecastDiv = $("<div>");
    todayForecastDiv.attr("id", "today-forecast-div");
    let headerEl = $("<h1>");
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
    let imageURL = `http://openweathermap.org/img/w/${response.weather[0].icon}.png`;
    //Setting value for new HTML elements
    weatherImg.attr("src", imageURL);
    headerEl.text(cityName + " " + "(" + date + ")");
    headerEl.append(weatherImg);

    let weatherIcon = response.weather[0].icon;
    // main.temp //temperature
    let temp = response.main.temp;
    //wind.speed //wind speed
    // main.humidity //humidity
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

    console.log(
      "city name:" + cityName,
      "\n" + "date:" + date,
      // "\n" + "icon:" + icon,
      "\n" + "temp:" + tempInCelsius + "℃",
      "\n" + "humidity:" + humidity + "%",
      "\n" + "wind-speed:" + windSpeed + " KPH"
    );
  });
}

// bootstrap syntax <div class="container"></div>;

function search(event) {
  event.preventDefault();
  // Need to add user validation code here to ensure entries are not empty strings or duplicates and that they're proper city names
  let city = cityEl.val();
  console.log(city);

  // Call method to validate city - get lat lon to check valid city
  if (isCityValid(city)) {
    setLocationSearchHistory(city);
    displaySearchHistory();
    displayFutureForecast(city);
    displayCurrentForecast(city);
  } else {
    //Tell user it's not valid
  }
}

function isCityValid(city) {
  // is it not null or empty and is there a lat, lon? Return true or false
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
    //Add formatting to buttons so they look like mock up.  Added bootstrap format but need to add padding
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
  console.log(storedLocationSearchHistory);
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
    console.log("existing city");
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
  // const locationTitle = $(event.target).attr("data-name");
  // console.log(locationTitle);
  let locationCoords = `https://api.openweathermap.org/geo/1.0/direct?q=${city},GB&appid=${APIKey}`;

  $.ajax({
    url: locationCoords,
    method: "GET",
  }).then(function (response) {
    console.log(response);
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
      console.log(response);
      let heading = $("<h3>")
        .text("5-Day Forecast:")
        .addClass("forecast-heading");
      futureForecastSec.append(heading);
      let dayContainer = $("<div>");
      dayContainer.addClass("day-container");
      futureForecastSec.append(dayContainer);
      for (let i = 0; i < 5; i++) {
        let day = $("<div>")
          .addClass("day")
          .attr("id", `day-${[i]}`);
        let dateArrayIndex = +([i] * 8 + 4);
        let date = moment
          .unix(response.list[dateArrayIndex].dt)
          .format("DD/MM/yyyy");
        let dateEl = $("<h4>")
          .attr("id", `date-${[i]}`)
          .text(date);
        let weatherImg = $("<img>").attr("id", `img-day-${[i]}`);
        let forecastImageURL = `http://openweathermap.org/img/w/${response.list[dateArrayIndex].weather[0].icon}.png`;
        weatherImg.attr("src", forecastImageURL);
        let weatherListEl = $("<ul>").attr("id", `weather-list-${[i]}`);
        weatherListEl.addClass("weather-list-items");
        dayContainer.append(day);

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

// Need to update location for current weather when button clicked
$(document).on("click", ".location-btn", updateForecasts);

function updateForecasts(event) {
  const city = $(event.target).attr("data-name");
  cityEl.val(city);
  displayFutureForecast(city);
  displayCurrentForecast(city);
}

displaySearchHistory();
// Set up search history cities as array in local storage.  Create button element for each city shown and add event listener which displays 5 day forecast for that city.

// URL to make current weather API call
//https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}

// Direct geocoding, get coordinates of location by entering location name.  http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}

// E.g. of direct geocoding
//http://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid={API key}

// Your Task
// Server APIs allow developers to access their data and functionality by making requests with specific parameters to a URL. Developers are often tasked with retrieving data from another application's API and using it in the context of their own. Your challenge is to build a weather dashboard that will run in the browser and feature dynamically updated HTML and CSS.

// Use the 5 Day Weather Forecast to retrieve weather data for cities. The link should take you to a guide on how to use the 5 Day Forecast API. You will need to register for an API key in order to use this API. After registering for a new API key, you may need to wait up to 2 hours for that API key to activate.

// The base URL for your API calls should look like the following: https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}.

// Hint: Using the 5 Day Weather Forecast API, you'll notice that you will need to pass in coordinates instead of just a city name. Using the OpenWeatherMap APIs, how could we retrieve geographical coordinates given a city name?

// You will use localStorage to store any persistent data. For more information on how to work with the OpenWeather API, refer to the Full-Stack Blog on how to use API keys.

// User Story
// AS A traveler
// I WANT to see the weather outlook for multiple cities
// SO THAT I can plan a trip accordingly
// Acceptance Criteria
// Create a weather dashboard with form inputs.
// When a user searches for a city they are presented with current and future conditions for that city and that city is added to the search history
// When a user views the current weather conditions for that city they are presented with:
// The city name
// The date
// An icon representation of weather conditions
// The temperature
// The humidity
// The wind speed
// When a user view future weather conditions for that city they are presented with a 5-day forecast that displays:
// The date
// An icon representation of weather conditions
// The temperature
// The humidity
// When a user click on a city in the search history they are again presented with current and future conditions for that city

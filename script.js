const userTab = document.querySelector('[data-user-weather]') ;
const searchTab = document.querySelector('[data-search-weather]') ;
const userContainer = document.querySelector('.weather-container') ;
const grantAccessContainer = document.querySelector('.grant-location-container') ;
const searchform = document.querySelector('[data-searchForm]') ;
const loadingScreen = document.querySelector('.loading-container') ;
const userInfoContainer = document.querySelector('.user-info-container') ;
let searchInput = document.querySelector('[data-searchInput]') ;
let error = document.querySelector('.error') ;

// variables
const API_key='14c7786354036da4e2a5f9e13db71231' ;
let currentTab = userTab ;
currentTab.classList.add("current-tab") ;
getfromSesstionStorage() ;

// if coordinates area already present in session storage 
function getfromSesstionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates") ;
    if(!localCoordinates){
        grantAccessContainer.classList.add("active") ;
    } else{
        const coordinates = JSON.parse(localCoordinates) ;
        fetchweatherInfo(coordinates) ;
    }
}

function switchTab(clickTab){
    error.classList.remove("active") ;
    if(clickTab!=currentTab){
        currentTab.classList.remove('current-tab') ;
        currentTab=clickTab ;
        currentTab.classList.add('current-tab') ;
        
        searchInput.value = '' ; 

        if(!searchform.classList.contains("active")){
            error.classList.remove("active") ;
            userInfoContainer.classList.remove("active") ;
            grantAccessContainer.classList.remove("active") ;
            searchform.classList.add("active") ;
        } else{
            error.classList.remove("active") ;
            searchform.classList.remove("active") ;
            userInfoContainer.classList.remove("active") ;
            // your weather from loac storage 
            getfromSesstionStorage() ;
        }
    }
}
userTab.addEventListener('click',()=>{
    switchTab(userTab) ;
});
searchTab.addEventListener('click',()=>{
    switchTab(searchTab) ;
});
 


async function fetchweatherInfo(coordinates){
    const {lat,lon} = coordinates ;
    // make grantcontainer invisible
    grantAccessContainer.classList.remove("active") ;
    // make loader visible
    loadingScreen.classList.add("active") ;
    // api call
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`) ;
        // let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city_name}&appid=${API_key}&units=metric`) ;
        let data = await response.json() ;
        console.log(data) ;

        // make loader invisible
        loadingScreen.classList.remove("active") ;
        userInfoContainer.classList.add("active") ;
        error.classList.remove("active") ;
        // render info in UI
        renderWeatherInfo(data) ;
    }catch(err){
        loadingScreen.classList.remove("active") ;
        console.log(err) ;
    }
} ;

function renderWeatherInfo(weatherInfo){

    const cityName = document.querySelector("[data-cityName]") ;
    const countryIcon = document.querySelector("[data-countryIcon]") ;
    const desc = document.querySelector("[data-weatherDesc]") ;
    const weatherIcon = document.querySelector("[data-weatherIcon]") ;
    const temp = document.querySelector("[data-temp]") ;
    const windSpeed = document.querySelector("[data-windspeed]") ;
    const humidity = document.querySelector("[data-humidity]") ;
    const cloudiness = document.querySelector("[data-cloudyness]") ;
    
    cityName.innerText = weatherInfo?.name ;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png` ;
    desc.innerText = weatherInfo?.weather?.[0]?.description  ;
    weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C` ;
    windSpeed.innerText = `${weatherInfo?.wind?.speed} m/s` ;
    humidity.innerText =`${ weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%` ;

}

function showPosition(position){
    const userCoordinates = {
        lat : position.coords.latitude ,
        lon : position.coords.longitude 
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates)) ;
    fetchweatherInfo(userCoordinates) ;
}

function getUserLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition) ;
    }else{
        console.log("your system does not support this geolocation feature") ;
    }
} ;

const grantAccessBtn = document.querySelector('[data-grantAccess]') ;
grantAccessBtn.addEventListener('click',getUserLocation())

  

searchform.addEventListener('submit',(e)=>{
    e.preventDefault() ;
    let cityName = searchInput.value ;
    // if(cityName=='') return ;
    if(searchInput.value==''){
        userInfoContainer.classList.remove("active") ;
        error.classList.add("active") ;
    }
    console.log(cityName) ;
    fetchSearchweatherInfo(cityName) ;

})

async function fetchSearchweatherInfo(city){
    loadingScreen.classList.add("active") ;
    userInfoContainer.classList.remove("acitve") ;
    grantAccessContainer.classList.remove("active") ;
    error.classList.remove("active") ;
    console.log(city) ;

    try{
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`) ;
        
        loadingScreen.classList.remove("active") ;
        userInfoContainer.classList.add("active") ;

        if(response.status === 404){
            userInfoContainer.classList.remove("active") ;
            error.classList.add("active") ;
        }
        if(searchInput.value===''){
            userInfoContainer.classList.remove("active") ;
            error.classList.add("active") ;
        }

        let data = await response.json() ;
        console.log(data) ;
        renderWeatherInfo(data) ;
    }catch(err){
        userInfoContainer.classList.remove("acitve") ;
        grantAccessContainer.classList.remove("active") ;
        console.log(err) ;
    }
}
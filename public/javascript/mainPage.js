/* your JS code here */
'use strict'
const APIKEY = "wtjo50MKkpobooDKpPVwgUX9lDnhdSx2ovmAbACs";

(() => {
    /***
     * global object for manifest data extraction
     * created in DOMContentLoaded
     * @type {{}}
     */
    let missionOperationTime = {}

    /***
     * Validation module for form
     * returns valdidation function for date, mission and camera
     * every function returns an object with:
     *      1. boolean value of validation
     *      2. message in case of validation is not valid
     *      3. name to be passed as parameter to fetch function in case validation is valid
     * @type {{isValidMission: (function(*): {isValid: boolean, name: string, message: string}), isValidDate: ((function(*=, *=, *=): {isValid: (*|boolean), message: string})|*), isValidCamera: (function(*): {isValid: boolean, name: string, message: string})}}
     */
    const validatorModule = (() => {
        //boolean function for checking if earth date is valid as a date in format YYYY_MM_DD
        let isEarthDate = (str) => {
            return ((new Date(str)).toString() !== 'Invalid Date' && /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(str))
        }

        //boolean function for checking if sol is valid as just a number
        let isSol = (str) => {
            return /^[0-9]+$/.test(str)
        }

        /***
         * generic boolean function
         * @param date -        Date or string
         * @param initialDate   Date or string
         * @returns {boolean}   bool
         */
        let isAfterStartingDate = (date, initialDate) => {
            return date >= initialDate //works for dates and ints
        }

        /***
         * generic boolean funnction
         * @param date          Date or string
         * @param finalDate     Date or string
         * @returns {boolean}   bool
         */
        let isBeforeFinalDate = (date, finalDate) => {
            return date <= finalDate //works for dates and ints
        }

        /***
         * validating if date is valid for a specific mission
         * @param date      string
         * @param mission   string
         * @returns {{  isValid: boolean,
         *              name: string,
         *              message: string}}
         */
        let isValidEarthDate = (date, mission) => {

            //extract necessary data from manifest object
            let startingDate = missionOperationTime[mission].landingDate
            let maxDate = missionOperationTime[mission].maxDate

            //send dates to generic function to check if date is valid for the mission
            let a = isAfterStartingDate(new Date(date), new Date(startingDate))
            let b = isBeforeFinalDate(new Date(date), new Date(maxDate));
            return {
                isValid: a && b, //date is valid only if after initial date and before final
                message: 'Please choose date ' + (!a ? 'after ' + startingDate : 'before ' + maxDate),
                name: 'earth_date'
            }
        }

        /***
         * function for checking if sol date is valid with mission
         * assumes sol given is indeed a sol
         * @param sol - a string assumed to be of type
         * @param mission - string
         * @returns {{isValid: boolean, message}} isValid for boolean verification, message to be shown in case of invalid
         */
        let isValidSol = (sol, mission) => {
            let maxSol = missionOperationTime[mission].maxSol
            let v = isBeforeFinalDate(sol, maxSol);
            return {
                isValid: v,
                message: 'SOL must be before ' + maxSol,
                name: 'sol'
            }
        }

        /***
         * function that checks if date is one of valid formats
         * @param str - string
         * @param mission - string
         * @param isMissionValid - boolean
         * @returns {{isValid: (*|boolean), message: string}} isValid for boolean verification,
         *                                              message for string to be shown in case of invalid
         */
        let isValidDate = (str, mission, isMissionValid) => {
            if (isEarthDate(str) && isMissionValid) return isValidEarthDate(str, mission);
            else if (isSol(str) && isMissionValid) return isValidSol(str, mission);
            else return {
                    isValid: isEarthDate(str) || isSol(str),
                    message: 'Please enter a valid earth date or sol',
                    name: 'invalid date'
                }
        }


        /***
         * checks if mission is chosen correctly
         * @param mission - string
         * @returns {{isValid: boolean, name: string, message: string}}
         */
        const isValidMission = (mission) => {
            return {
                isValid: (mission !== 'Choose a mission'),
                message: 'Please choose a mission',
                name: 'mission'
            }
        }

        /***
         * checks if camera is chosen correctly
         * @param camera - string
         * @returns {{isValid: boolean, name: string, message: string}}
         */
        const isValidCamera = (camera) => {
            return {
                isValid: (camera !== 'Choose a camera'),
                message: 'Please choose a camera',
                name: 'camera'
            }
        }
        return {
            isValidDate: isValidDate,
            isValidMission: isValidMission,
            isValidCamera: isValidCamera,
        }
    })();


    /***
     * fetch link generation upon submitting form depending on names of elements
     * @param dateElem - document.element
     * @param missionElem - document.element
     * @param cameraElem - document.element
     * @returns {string} - link to be inserted into fetch()
     */
    let generateFetchLink = (dateElem, missionElem, cameraElem) => {
        return 'https://api.nasa.gov/mars-photos/api/v1/rovers/' +
            missionElem.value.toLowerCase() +
            '/photos?' +
            paramGenerator(dateElem, cameraElem)
    }
    /***
     * Parameter generator for fetch link
     * always appends api key
     * @param elements - array of form input/select elements
     * @returns {string} - param string to append to fetch link
     */
    let paramGenerator = function (...elements) {
        let URLParameters = new URLSearchParams();
        for (let element of elements) {
            URLParameters.append(element.name, element.value)
        }
        URLParameters.append('api_key', APIKEY) //always include api key
        return URLParameters.toString()
    }


    document.addEventListener(`DOMContentLoaded`, function () {

        //initialize manifest information from NASA API
        missionOperationTime = (() => {
            let operationTime = {}
            let missions = ['curiosity', 'spirit', 'opportunity']
            for (let mission of missions) {
                fetch('https://api.nasa.gov/mars-photos/api/v1/manifests/' + mission + '?' + paramGenerator())
                    .then(response => {
                        if (response.status >= 200 && response.status <= 299)
                            return response.json()
                        else throw response.status.toString() + ' ' + response.statusText + ' ' + response.url
                    }).then(data => {
                    operationTime[mission] = {}
                    operationTime[mission].landingDate = data.photo_manifest.landing_date;
                    operationTime[mission].maxDate = data.photo_manifest.max_date;
                    operationTime[mission].maxSol = data.photo_manifest.max_sol;

                }).catch((e) => {
                    //in case of error, remove everything from page from pic onwards
                    let pic = document.querySelector(".container-fluid").firstElementChild.firstElementChild.firstElementChild
                    while (pic.nextElementSibling) {
                        pic.nextElementSibling.remove();
                    }
                    //insert error message into screen
                    document.querySelector("body").innerHTML +=
                        `There seems to be a problem: 
                    Cant find information on ${mission}. Please return at different time.<br> ${e}<br><br>`
                });
            }
            return operationTime;
        })()


        // initialize form submission button
        document.querySelector("form").addEventListener("submit", function (e) {
            e.preventDefault() //prevent sending http request

            let elements = this.querySelectorAll('input,select');
            let dateElem = elements[0]
            let missionElem = elements[1]
            let cameraElem = elements[2]

            if (validateForm(dateElem, missionElem, cameraElem)) {

                document.querySelector(".spinner-grow").parentElement.classList.toggle("d-none")
                searchResults(generateFetchLink(dateElem, missionElem, cameraElem))
            }
        });

        //initialize form reset button
        document.querySelector("form").addEventListener("reset", function (e) {
            removeSearchResults()

            //remove errors from elements and reset valid state of inputs
            let elements = this.querySelectorAll('input,select');
            elements.forEach(element => {
                element.classList.remove('is-invalid');
                element.nextElementSibling.innerHTML = ''
            })

            //remove error message of carousel display with no pictures saved
            document.querySelector(".carousel").nextElementSibling.innerHTML = ''
            //continue to do default of reset

        });


        let startSlideShowBtn = document.getElementById("startSlideShowBtn")
        let slideLinks = document.getElementById("slideLinks");
        let carousel = document.querySelector(".carousel")
        startSlideShowBtn.addEventListener("click", () => {
            slideLinks.childElementCount > 0 ? //if no empty images show an error message instead of carousel
                carousel.classList.remove("d-none") :
                carousel.nextElementSibling.innerHTML = `<div class="card p-3 alert-danger"><h5>Save your favourite photos to add to slideshow!</h5></div>`
        })
        startSlideShowBtn.nextElementSibling.addEventListener("click", () => {
            carousel.classList.add("d-none")
            carousel.nextElementSibling.innerHTML = ''
        })
    })

    const validateForm = (dateElem, missionElem, cameraElem) => {

        dateElem.value = dateElem.value.trim();
        // display all errors, force checking all fields
        let v1 = validateInput(missionElem, validatorModule.isValidMission)
        let v2 = validateInput(cameraElem, validatorModule.isValidCamera)
        let v3 = validateInput(dateElem, (date) => {
            return validatorModule.isValidDate(date, missionElem.value.toLowerCase(), v1);
        })
        return v1 && v2 && v3;
    }

    /***
     * generic function for element validation
     * @param inputElement
     * @param validateFunc
     * @returns {boolean|*}
     */
    const validateInput = (inputElement, validateFunc) => {
        let errorElement = inputElement.nextElementSibling; // the error message div
        let v = validateFunc(inputElement.value); // call the validation function
        errorElement.innerHTML = v.isValid ? '' : v.message; // display the error message
        v.isValid ? inputElement.classList.remove("is-invalid") : inputElement.classList.add("is-invalid");
        inputElement.name = v.name //set the name to determine pattern of input
        return v.isValid;
    }

    let searchResults = function (apiString) {

        fetch(apiString)
            .then((response) => {
                if (response.status >= 200 && response.status <= 299) {
                    return response.json();
                } else throw response.status.toString() + ' ' + response.statusText + ' ' + response.url
            })
            .then((data) => {
                removeSearchResults()
                if (data.photos.length) {
                    for (let img of data.photos) {
                        addImgs(img)
                    }
                } else throw "No images found"
            }).catch((e) => {
            let errorCard = `<div class="row my-2 justify-content-center">
                            <div class="col-auto">
                                <div class="card mx-auto p-3 alert-warning ">
                                <h5 class="text-secondary"><b>${e} </b></h5>
                                </div>
                            </div>
                        </div>`
            document.getElementById("searchResult").innerHTML += errorCard

            //turn off spinner regardless of outcome of fetch
        }).finally(() => {
            document.querySelector(".spinner-grow").parentElement.classList.toggle("d-none")
        })

    }

    /***
     * clear search results function
     */
    let removeSearchResults = function () {
        let imgDisplayResults = document.getElementById("searchResult")
        while (imgDisplayResults.firstChild) {
            imgDisplayResults.removeChild(imgDisplayResults.firstChild)
        }
    }

    let addImgs = function (img) {
        let theurl = "/api/nasa";
        let slideLinks = document.getElementById("slideLinks");
        let imgDisplayResults = document.getElementById("searchResult")
        let newImg = document.createElement(`div`)
        newImg.classList.add("col-auto")

        newImg.innerHTML = `
                        <div class="card my-2" style="width: 18rem;">
                            <div class="card-body">
                                <img src=${img.img_src} class="card-img-top" alt="...">
                                <p>${img.earth_date}</p>
                                <p>${img.sol}</p>
                                <p>${img.camera.name}</p>
                                <p>${img.rover.name}</p>
                                <button type="button" class="btn btn-info">save</button>
                                <a class="btn btn-primary" target="_blank" href=${img.img_src}>full size</a>
                            </div>
                        </div>`


        newImg.querySelector('button').addEventListener("click", function () {
            //when an image is chosen redirect button to modal
            this.setAttribute("data-bs-target", "#savedImg")
            this.setAttribute("data-bs-toggle", "modal")
            document.querySelector(".spinner-grow").parentElement.classList.toggle("d-none")
            fetch(`${theurl}`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    url: img.img_src,
                    sol: img.sol,
                    earth_date: img.earth_date
                })

            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.pictureExists) {
                        slideLinks.innerHTML +=
                            `<li>
                    <div class="row">
                <div class="col-auto">

                    <a target="_blank" href=${img.img_src}>Image id: ${img.id} </a>
                    <p>Earth date: ${img.earth_date}, Sol: ${img.sol}, Camera: ${img.camera.name}
                </p>
                </div>
                <div class="col-auto"><form>
                    <input type="hidden" value="${data.id}" name="id"/>
                <button type="submit" class="btn btn-danger">delete</button>
                </form>
                </div>
                </li>`


                        let newCarouselItem = document.createElement("div") //add to carousel
                        //if first item, set it on active
                        slideLinks.childElementCount === 1 ?
                            newCarouselItem.classList.add("carousel-item", "active") :
                            newCarouselItem.classList.add("carousel-item")

                        newCarouselItem.innerHTML +=
                            `<img src="${img.img_src}" alt="${img.img_src}" class="d-block rounded w-100 img-fluid mx-auto">
                 <div class="carousel-caption">
                 <a class="btn btn-primary" target="_blank" href=${img.img_src}>Full size</a>
                 <h5>${img.camera.name}</h5>
                 <h5>${img.earth_date}</h5>
                 `


                        document.querySelector(".carousel-inner").appendChild(newCarouselItem)
                        document.querySelector('.carousel').nextElementSibling.innerHTML = '' //set error to none
                    } else this.click() //if already present, click again to show modal.

                })
                .catch((e) => {
                    console.log("error", e)
                }).finally(() => document.querySelector(".spinner-grow").parentElement.classList.toggle("d-none"));


        }, {once: true})


        imgDisplayResults.appendChild(newImg)
    }


})();




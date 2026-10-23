import "./styles.css";
import { COUNTRY_ADDRESS_POSTALS } from "./countriesAddressPostal.js";

window.addEventListener('load', function() {
    let rightCountry = {};
    let countryCheck = {
        nameCheck: false
    }
    let mail = document.querySelector("#email");

    mail.addEventListener('input', function() {
        if (mail.validity.typeMismatch) {
            mail.setCustomValidity("Enter a valid email, please");
        } else {
            mail.setCustomValidity("");
        }

        mail.reportValidity()
    })

    let findCountryNameMatch = function(toCheck) {
        let found = false;
        countryCheck.nameCheck = false;

        COUNTRY_ADDRESS_POSTALS.forEach((entry) => {
            if (entry.name.toLowerCase() === toCheck.toLowerCase()) {
                found = true;
                countryCheck.nameCheck = true
                rightCountry = COUNTRY_ADDRESS_POSTALS[COUNTRY_ADDRESS_POSTALS.indexOf(entry)];
            }
        })

        if (found === false) {
            rightCountry = {}
            countryCheck.nameCheck = false;
        }
    }

    let findCountryAbbrevMatch = function(toCheck) {
        if (!countryCheck.nameCheck) {
            let found = false;
            COUNTRY_ADDRESS_POSTALS.forEach((entry) => {
                if (entry.abbrev.toLowerCase() === toCheck.toLowerCase()) {
                    found = true;
                    rightCountry = COUNTRY_ADDRESS_POSTALS[COUNTRY_ADDRESS_POSTALS.indexOf(entry)];
                }
            })

            if (found === false) {
                rightCountry = {}
            }
            }   
    }

    let country = document.querySelector("#country");
    let postalCode = document.querySelector("#postcode")
    let displayPostWarning = function() {
        if (!document.querySelector("#postMessage")) {
                postalCode.disabled = true;
                postalCode.value = "";
                let postalInform = document.createElement("div")
                postalInform.classList.add('warn');
                postalInform.id = 'postMessage'
                postalInform.textContent = "Enter a valid country name to unlock the postcode field"   
                postalCode.insertAdjacentElement("afterend", postalInform);
            }
    }

    country.addEventListener('input', function() {
        if (country.value.length === 0) {
            displayPostWarning() 
        } else {
            postalCode.disabled = false;
            if (document.querySelector("#postMessage")) {
                document.querySelector("#postMessage").remove();
            }
        }

        findCountryNameMatch(country.value);
        
        if (Object.keys(rightCountry).length === 0) {
            country.setCustomValidity("Enter a valid country, please");
            displayPostWarning()
        } else {
            country.setCustomValidity("");
            country.value = rightCountry.name;
        }

        country.reportValidity();  
    })

    country.addEventListener('focusout', function() {
        findCountryAbbrevMatch(country.value); //if a match is found, sets the rightCountry object to have a matching name/abbreviation/postal code of the entered country
        
        if (Object.keys(rightCountry).length === 0) {
            country.setCustomValidity("Enter a valid country, please");
            displayPostWarning()
        } else {
            country.setCustomValidity("");
            country.value = rightCountry.name; //replaces country name with the same name, but proper capitalization
            postalCode.disabled = false;
            if (document.querySelector("#postMessage")) {
                document.querySelector("#postMessage").remove();
            }
        }
        country.reportValidity();   
    })  

    postalCode.addEventListener('input', function() {
        if (rightCountry.postal) {
            let regexToPattern = rightCountry.postal.toString().slice(2, -2);
            postalCode.setAttribute('pattern', regexToPattern)
            if (postalCode.validity.patternMismatch) {
                postalCode.setCustomValidity("Enter a valid country postal code, please");
            } else {
                postalCode.setCustomValidity("");
            }
            postalCode.reportValidity()
        } else {
            postalCode.setAttribute('pattern','[A-Za-z0-9- ]{2,10}')
        }
    })

    let password = document.querySelector("#password");
    let passwordCheck = document.querySelector("#password-repeat");

    let createPasswordInform = function() {
        let passwordInform = document.createElement("div");
        passwordInform.id = "passwordInform";

        let passWordInformMessage = document.createElement("p");
        passWordInformMessage.textContent = 'Valid password should:'

        let passwordInformList = document.createElement("ul");
        for (let i = 0; i < 4; i++) {
            let passwordInformListItem = document.createElement("li");
            passwordInformListItem.classList.add("warn");
            passwordInformListItem.id = i;
            if (i === 0) {
                passwordInformListItem.textContent = 'Have a length between 8 and 20 symbols'
            } else if (i === 1) {
                passwordInformListItem.textContent = 'Have a CAPITAL and a lowercase letter'
            } else if (i === 2) {
                passwordInformListItem.textContent = 'Have a number'
            } else if (i === 3) {
                passwordInformListItem.textContent = 'Have a special character (@$!%*?&)'
            }
            passwordInformList.appendChild(passwordInformListItem);
        }

        passwordInform.appendChild(passWordInformMessage);
        passwordInform.appendChild(passwordInformList);
        password.insertAdjacentElement("afterend", passwordInform);
    }

    let manageConditionStatus = function(id, testExp) {
        if (testExp.test(password.value)) {
            document.getElementById(id).classList.remove("warn")
            document.getElementById(id).classList.add("correct")
        } else {
            document.getElementById(id).classList.add("warn")
            document.getElementById(id).classList.remove("correct") 
        }
    }

    password.addEventListener('input', function() {
        if (password.validity.patternMismatch) {
            password.setCustomValidity("Enter a valid password, please");
            passwordCheck.disabled = true;
            if (!document.querySelector("#passwordInform")) {
                createPasswordInform()
            }

            if (password.value.length >= 8 && password.value.length <= 20) {
            document.getElementById("0").classList.remove("warn")
            document.getElementById("0").classList.add("correct")
            } else {
                document.getElementById("0").classList.add("warn")
                document.getElementById("0").classList.remove("correct") 
            }

            let allLetters = /(?=.*[a-z])(?=.*[A-Z])/g;
            let allDigits = /\d+/g;
            let allSpecial = /(?=.*[@$!%*?&])/g;

            manageConditionStatus("1", allLetters);
            manageConditionStatus("2", allDigits);
            manageConditionStatus("3", allSpecial);
        } else {
            password.setCustomValidity("");
            passwordCheck.disabled = false;
            if (document.querySelector("#passwordInform")) {
                document.querySelector("#passwordInform").remove();
            }
        }

        password.reportValidity()
    })

    passwordCheck.addEventListener('input', function() {
        if (passwordCheck.value !== password.value) {
            passwordCheck.setCustomValidity("Password doesn't match");
        } else {
            passwordCheck.setCustomValidity("");
        }

        passwordCheck.reportValidity()
    })

    const form = document.querySelector("form");
        let allInputs = document.querySelectorAll("input")
        form.addEventListener("submit", event => {
        event.preventDefault();
        if (form.contains(document.querySelector("div[class^=form-]"))) {
            (document.querySelector("div[class^=form-]")).remove()
        }

        if (form.reportValidity()) {
            let gratz = document.createElement('div');
            gratz.textContent = 'great work!!! 🙌'
            gratz.classList.add('form-positive');
            form.appendChild(gratz);
            allInputs.forEach((input) => input.disabled = true)
        } else {
            let inform = document.createElement('div')
            inform.classList.add('form-negative');
            let informMessage = document.createElement("p");
            informMessage.textContent = `Please fix the following fields:`
            inform.appendChild(informMessage)

            let errorList = document.createElement('ul');
            allInputs.forEach((input) => {
                console.log(input.validity)
                if (input.id !== 'password-repeat' && !input.validity.valid) {
                    let errorItem = document.createElement("li");
                    if (input.validity.valueMissing) {
                        errorItem.textContent = `${input.id} - fill out field`
                        input.setCustomValidity(`Enter a valid ${input.id}, please`)
                    } else if (input.validity.typeMismatch) {
                        errorItem.textContent = `${input.id} - please enter a valid ${input.id}`
                        input.setCustomValidity(`Enter a valid ${input.id}, please`)
                    } else if (input.validity.tooShort) {
                        errorItem.textContent = `${input.id} - please add a longer ${input.id}`
                        input.setCustomValidity(`Enter a longer ${input.id}, please`)
                    } else if (input.validity.tooLong) {
                        errorItem.textContent = `${input.id} - please add a shorter ${input.id}`
                        input.setCustomValidity(`Enter a shorter ${input.id}, please`)
                    } else if (input.id === 'country' && !countryCheck.nameCheck) {
                        errorItem.textContent = `${input.id} - please enter a valid ${input.id}`
                        input.setCustomValidity(`Enter an existing ${input.id}, please`)
                    } 

                    errorList.appendChild(errorItem)
                }
            })

            inform.appendChild(errorList);
            form.appendChild(inform)
        }
    });

})
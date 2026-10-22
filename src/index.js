import "./styles.css";
import { COUNTRY_ADDRESS_POSTALS } from "./countriesAddressPostal.js";

window.addEventListener('load', function() {
    let rightCountry = {};
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
        COUNTRY_ADDRESS_POSTALS.forEach((entry) => {
            if (entry.name.toLowerCase() === toCheck.toLowerCase() || 
                entry.abbrev.toLowerCase() === toCheck.toLowerCase()) {
                found = true;
                rightCountry = COUNTRY_ADDRESS_POSTALS[COUNTRY_ADDRESS_POSTALS.indexOf(entry)];
            }
        })

        if (found === false) {
            rightCountry = {}
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
    })

    country.addEventListener('focusout', function() {
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

    postalCode.addEventListener('input', function() {
        postalCode.setAttribute('pattern', rightCountry.postal)
        if (rightCountry.postal) {
            // postalCode.setAttribute('pattern', rightCountry.postal)
            // if (postalCode.validity.typeMismatch) {
            //     postalCode.setCustomValidity("Enter a valid country postal code, please");
            // } else {
            //     postalCode.setCustomValidity("");
            // }
            // postalCode.reportValidity()
            
            rightCountry.postal.test(postalCode.value)
            console.log(postalCode.value, typeof postalCode.value, rightCountry.postal.test(postalCode.value))
            
        } 
    })


    const form = document.querySelector("form");
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
        } else {
            let inform = document.createElement('div')
            inform.classList.add('form-negative');
            let informMessage = document.createElement("p");
            informMessage.textContent = `Please fix the following fields:`
            inform.appendChild(informMessage)

            let errorList = document.createElement('ul');
            let allInputs = document.querySelectorAll("input")
            allInputs.forEach((input) => {
                console.log(input.validity)
                if (input.id !== 'password-repeat' && !input.validity.valid) {
                    let errorItem = document.createElement("li");
                    if (input.validity.valueMissing) {
                        errorItem.textContent = `${input.id} - fill out field`
                    } else if (input.validity.typeMismatch || input.validity.patternMismatch) {
                        errorItem.textContent = `${input.id} - please enter a valid ${input.id}`
                    } else if (input.validity.tooShort) {
                        errorItem.textContent = `${input.id} - please add a longer ${input.id}`
                    } else if (input.validity.tooLong) {
                        errorItem.textContent = `${input.id} - please add a shorter ${input.id}`
                    } 

                    errorList.appendChild(errorItem)
                }
            })

            inform.appendChild(errorList);
            form.appendChild(inform)
        }
    });

})
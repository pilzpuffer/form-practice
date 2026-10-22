import "./styles.css";

window.addEventListener('load', function() {
    let mail = document.querySelector("#email");

    mail.addEventListener('input', function() {
        if (mail.validity.typeMismatch) {
            mail.setCustomValidity("enter a valid email, please");
        } else {
            mail.setCustomValidity("");
        }

        mail.reportValidity()
    })

    let country = document.querySelector("#country");
    country.addEventListener('input', function() {
        
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
                console.log(input.valid)
                if (input.id !== 'password-repeat' && !input.validity.valid) {
                    let errorItem = document.createElement("li");
                    if (input.validity.valueMissing) {
                        errorItem.textContent = `${input.id} - fill out field`
                    } else if (input.validity.typeMismatch) {
                        errorItem.textContent = `${input.id} - please enter valid ${input.id}`
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
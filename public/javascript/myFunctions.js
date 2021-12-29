document.addEventListener("DOMContentLoaded", () => {

    let firstForm, secondForm;
    [firstForm, secondForm] = document.querySelectorAll("form") //get forms of 1st and 2nd page

    //event listener for 1st form of names + email page
    firstForm.addEventListener("submit", function (e) {
        e.preventDefault();
        document.getElementById("emailErrorMsg").innerHTML = ''
        let theurl = "/api/resources";
        let nameElem, lastNameElem, emailElem;
        [nameElem, lastNameElem, emailElem] = this.querySelectorAll('input')
        nameElem.nextElementSibling.innerHTML = ''
        lastNameElem.nextElementSibling.innerHTML = ''
        emailElem.nextElementSibling.innerHTML = ''

        if (validatorModule.validateForm(
            {elem: nameElem, elemFunc: validatorModule.isValidName},
            {elem: lastNameElem, elemFunc: validatorModule.isValidName},
            {elem: emailElem, elemFunc: validatorModule.isValidEmail}
        ))
            fetch(`${theurl}/${this.querySelector('[type=email]').value}`)
                .then((res) => res.json())
                .then((data) => {
                    if (!data.mailExists) {
                        this.submit();
                    } else {
                        let findError = `<div class="card p-3 alert-warning "><h5 class="text-secondary"><b>
                                     <strong>Oh No !</strong> the email is already used :( </b></h5></div>`
                        document.getElementById("emailErrorMsg").innerHTML += findError
                    }
                })
                .catch((e) => {
                    console.log("error", e)
                });

    })

    //event listener for 2nd form - passwords
    secondForm.addEventListener("submit", function (e) {
        let [password, password2] = this.querySelectorAll('[type=password]')
        password.nextElementSibling.innerHTML = '';
        password2.nextElementSibling.innerHTML = '';

        if (!validatorModule.validateForm({
                elem: password, elemFunc: ((password) => {
                    return validatorModule.isPasswordsMatch(password, password2.value)
                })
            },
            {elem: password, elemFunc: validatorModule.isPasswordLong}))
            e.preventDefault();
    })
})


// const validateForm = (name,lastName,email) => {
//     let v1 = validateInput(name, validatorModule.isValidName)
//     let v2 = validateInput(lastName, validatorModule.isValidName)
//         let v3=validateInput(email,validatorModule.isValidEmail)
//     return v1 && v2 && v3 ;
// }

// a module for all string validation functions
const validatorModule = (() => {


    let onlyAlphabet = (name) => {
        return !/[^a-zA-Z]/.test(name)
    }

    let validateSamePassword = (password1, password2) => {

        return {
            isValid: (password1 === password2),
            message: 'The passwords don\'t match<br>'
        }
    }

    let validatePasswordLength = (password) => {
        return{
            isValid: (password.length > 7),
            message: 'Password must be at least 8 characters long'
        }
    }

    let validateName = (name) => {
        let v = onlyAlphabet(name) && (name);
        return {
            isValid: v,
            message: 'The input must consist letters and only letters'
        }
    }
    let validateEmail = (email) => {
        let v = (email);
        return {
            isValid: v,
            message: 'mail cant be empty '
        }
    }




    const validateForm = (...elementObjects) => {
        let v = true
        elementObjects.forEach((elementObject) => {
            v = validateInput(elementObject.elem, elementObject.elemFunc) && v
        })
        return v

    }


    const validateInput = (inputElement, validateFunc) => {
        let errorElement = inputElement.nextElementSibling; // the error message div
        let v = validateFunc(inputElement.value); // call the validation function
        errorElement.innerHTML += v.isValid ? '' : v.message; // display the error message
        v.isValid ? inputElement.classList.remove("is-invalid") : inputElement.classList.add("is-invalid");
        return v.isValid;
    }

    return {
        isValidName: validateName,
        isValidEmail: validateEmail,
        isPasswordsMatch: validateSamePassword,
        isPasswordLong : validatePasswordLength,
        validateForm:validateForm

    }

})();

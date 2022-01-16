/***
 * js page for login, created classes for validation and for different forms (validation module is similar to
 *  Solange's example and changed to become modular.
 */

document.addEventListener('DOMContentLoaded', function () {

    let loginForm = document.getElementById('loginForm')
    let registerMailForm = document.getElementById('registerMailForm');
    let registerPasswordForm = document.getElementById('registerPasswordForm');
    let inputs = document.querySelectorAll('input');
    let elements = [];

    if (loginForm) {
        elements = [
            {elem: inputs[0], elemFunc: validatorModule.isValidEmail},
            {elem: inputs[1], elemFunc: validatorModule.isPasswordLong}
        ]

        let loginValidator = new FormValidator(elements);
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            loginValidator.resetErrors();

            if (loginValidator.clientValidator()) {
                loginForm.submit();
            }
        })
    }

    if (registerMailForm) {
        elements = [
            {elem: inputs[0], elemFunc: validatorModule.isValidName},
            {elem: inputs[1], elemFunc: validatorModule.isValidName},
            {elem: inputs[2], elemFunc: validatorModule.isValidEmail}]
        let registerMailValidator = new FormValidator(elements);


        registerMailForm.addEventListener('submit', function (e) {
            e.preventDefault();
            let clientValidation = false;
            registerMailValidator.resetErrors();

            if (registerMailValidator.clientValidator()) {
                clientValidation = true;
            }
            registerMailValidator.serverValidator('/form/' + inputs[2].value, (data) => {
                if (data.mailExists) {
                    inputs[2].nextElementSibling.innerHTML += 'The mail you provided is already associated with an account'
                } else {
                    if (clientValidation) registerMailForm.submit();
                }
            })
        })


    }

    if (registerPasswordForm) {
        elements = [
            {elem: inputs[0], elemFunc: validatorModule.isPasswordLong},
            {elem: inputs[1], elemFunc: validatorModule.isPasswordLong},
            {
                elem: inputs[1], elemFunc: ((password) => {
                    return validatorModule.isPasswordsMatch(password, inputs[0].value)
                })
            }]

        let registerPasswordValidator = new FormValidator(elements);
        registerPasswordForm.addEventListener('submit', function (e) {
            e.preventDefault();
            registerPasswordValidator.resetErrors();

            if (registerPasswordValidator.clientValidator()) {
                registerPasswordForm.submit();
            }
        })
    }
});


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
        return {
            isValid: (password.length > 7), //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!//
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


    const validateForm = (elementObjects) => {
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
        isPasswordLong: validatePasswordLength,
        validateForm: validateForm,
    }
})();

/***
 *
 * @param elemObjects - array of objects name and validation function; to be passed to validation module and return
 * boolean 'or' between all of the objects to check success validation..
 * @constructor
 */
let FormValidator = function (elemObjects) {
    this.elemObjects = elemObjects;
    this.errorLoc = document.querySelector('form').nextElementSibling;
    this.spinner = document.querySelector(".spinner-grow").parentElement;
    this.resetErrors = () => {
        elemObjects.forEach(element => element.elem.nextElementSibling.innerHTML = '')
    }
    this.clientValidator = () => validatorModule.validateForm(this.elemObjects);
    this.serverValidator = (fetchLink, successFunction) => {
        this.spinner.classList.remove("d-none")
        this.errorLoc.classList.add('d-none')
        fetch(fetchLink)
            .then(res => {
                if (res.status >= 200 && res.status <= 299) {
                    return res.json()
                } else throw res.statusText;
            })
            .then(successFunction)
            .catch(() => {
                this.errorLoc.classList.remove('d-none')
            })
            .finally(() => {
                    this.spinner.classList.add("d-none")
                }
            )
    }
}
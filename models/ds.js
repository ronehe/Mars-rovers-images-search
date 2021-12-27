let usersModule = (function() {
    let User = function (firstName, lastName, mail, password) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.mail = mail;
        this.password = password;
        return this;
    }
    let users = []
    let push = function(firstName, lastName, mail, password) {
        users.push(new User(firstName, lastName, mail, password))
        console.log(users)
    }
    let find = function(mailToCheck) {
        return users.find(user => user.mail === mailToCheck)
    }
    return {
        push: push,
        find: find
    }
})();

module.exports = usersModule;
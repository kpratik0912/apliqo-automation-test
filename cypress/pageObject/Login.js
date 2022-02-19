class Login {


    getUsername = () => {
        return cy.get('#tm1-login-user', { timeout: 90000 })
    }

    getPassword = () => {
        return cy.get('#tm1-login-pass')
    }


    login = (username, password) => {
        this.getUsername().type(username).should('have.value', username);
        if (password)
            this.getPassword().type(password);
        cy.get('#tm1-login-button').click();
        cy.wait(3000)
    }

}

export default Login
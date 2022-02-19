class Header {

    getEditMode = () => {
        return cy.get('[data-cy=edit-mode]', { timeout: 5000 })
    }

    getUser = () => {
        return cy.get('[data-cy="userid"]')
    }

    getLogoutLink = () => {
        return cy.get('[data-cy=logout]')
    }


    getSaveButton = () => {
        return cy.get('[data-cy=editMode_Save]')
    }

    getDiscardButton = () => {
        return cy.get('[data-cy=editMode_Discard]')
    }


    logout = () => {
        this.getUser().click()
        this.getLogoutLink().click()
    }
}

export default Header
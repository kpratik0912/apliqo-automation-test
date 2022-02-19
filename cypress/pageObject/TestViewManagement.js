class TestViewManagement {



    getCubeSetting = () => {
        return cy.get('[data-cy=toolbarOpenSetupModal]')
    }

    getModal = () => {
        return cy.get('.modal-content')
    }

    getModalBody = () => {
        return cy.get('.modal-body')
    }
}

export default TestViewManagement
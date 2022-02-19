///<reference types="cypress"/>

import Header from "../pageObject/Header";
import Login from "../pageObject/Login";
import TestViewManagement from "../pageObject/TestViewManagement";

const baseURL = "http://cubewise.in:4880/Apliqo_Test/#!/app/Pratik-%3Ea20.f2.v1"
const ApliqoTestSite = "http://cubewise.in:4880/Apliqo_Test/#!/app/Pratik-%3Ea20.f2.v1"


describe('View Management', () => {
    let login = new Login()
    let tvm = new TestViewManagement()
    let header = new Header()
    before(() => {

        cy.clearCookies()
        // setupRoutes();
        cy.viewport('macbook-15')
        cy.visit(ApliqoTestSite)
        cy.wait(3000);
        login.login(Cypress.env().username, Cypress.env().password)
    })


    it('changes view config', () => {
        cy.wait(5000)
        //Enable the edit mode
        header.getEditMode()
            .should('not.have.class', 'active')
            .click()
            .should('have.class', 'active')
        cy.wait(3000)
        //Click on the Cube Settings
        tvm.getCubeSetting().click()

        tvm.getModal()
            .should('be.visible')
            .get('.modal-header')
            .should('contain.text', 'Test View management')


        // changing  Hierarchy to cash flow and list type to MDX
        tvm.getModalBody().within(() => {
            cy.get("[data-cy='setup_modal_dimension_rows_Account']").click()
            cy.get('.right-pane').within(() => {
                cy.get('label')
                    .contains('Hierarchy', { matchCase: false })
                    .next()
                    .children()
                    .select('Cash_Flow')
                cy.get('label')
                    .contains('List Type', { matchCase: false })
                    .next()
                    .children()
                    .select('MDX')

            })
            cy.wait(2000)



            //Move General Ledger Measure from Global Fixed Settings to Sub-view Column Dimension
            cy.get('#columns').then(($drop) => {
                let cordinates = $drop[0].getBoundingClientRect()

                cy.get("[data-cy='setup_modal_dimension_fixes_General Ledger Measure']")
                    .trigger('mousedown', { which: 1 })
                    .wait(1000)
                    .trigger('mousemove', { which: 1, pageX: cordinates.x + 200, pageY: cordinates.y + 10 })
                    .trigger('mouseup')
            })
            cy.wait(5000)
            //Move Version from Sub-view Column Dimension to Global Fixed Settings
            cy.get('[data-cy=setup_modal_dimension_column_Version]')
                .trigger('mousedown', { which: 1 })
                .trigger('mousemove', { which: 1, pageX: 204, pageY: 250 })
                .trigger('mouseup')

            cy.wait(5000)
            cy.get("[data-cy='setup_modal_dimension_column_General Ledger Measure']").click()
            cy.wait(5000)


            //change the Subset by choosing Test Subset 3
            cy.get('label').contains('Subset', { matchCase: false }).next().within(() => {
                cy.get('#single-button').click()
                cy.get('input').type('Test Subset 3')
                cy.get('li')
                    .contains('Test Subset 3').click()
            })

        })
        //Close the popup
        cy.get('[data-cy=setup-modal-close]').click()
        cy.wait(2000)

        //table got loaded & Save and Discard buttons appear on the screen and Writing “test input”
        header.getSaveButton().should('be.visible')
        header.getDiscardButton().should('be.visible')
        cy.get('.htCore').should('be.visible').within(() => {
            cy.get('tbody').within(() => {
                cy.get('.input')
                    .click()
                    .wait(1000)
                    .type('test input{enter}')
                    .should('have.text', 'test input')
            })
        })
        cy.get('[data-cy=refresh]').click()
        cy.get('.htCore').should('be.visible').within(() => {
            cy.get('tbody').within(() => {
                cy.get('.input')
                    .should('have.text', 'test input')
                    .click()
                    .wait(1000)
                    .type(' {selectall}{backspace}{enter}')

            })
        })

        cy.get('[data-cy=editMode_Discard]').click()
        cy.get('[data-cy="delete-view-modal-confirmation"]').click()
        cy.get('.toast-pf').should('be.visible').and('contain.text', 'Unsaved changes were discarded successfully')
        cy.get('.htCore').should('be.visible').within(() => {
            cy.get('.input').should('not.exist')
            cy.get('input').should('not.exist')
        })



    })

    after(() => {
        header.logout()
    })
})
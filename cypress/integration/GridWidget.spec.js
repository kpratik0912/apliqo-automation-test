///<reference types="cypress"/>

import Header from "../pageObject/Header";
import batchMockData from "../fixtures/batchMockData.json"

// Baisc constants
const getTimeStamp = (new Date()).getTime();
const baseURL = "http://cubewise.in:4880/Apliqo_Test"
const ApliqoTestSite = `http://cubewise.in:4880/Apliqo_Test/#!/app/Pratik-%3Ea20.f1.v2?testId=263&timeStamp=${getTimeStamp}`;
const login = 'pratik';
const password = 'cubewise@123';

// APP Routes
export const setupRoutes = () => {
    cy.server();
    cy.route('POST', '**/api/processes').as('runProcesses');
    cy.route('GET', '**/api/processes/**').as('getProcesses');
    cy.route('POST', '**/api/dimensions').as('dimensions');
    cy.route('POST', '**/api/mdx').as('mdx');
    cy.route('POST', '**/api/dbr/batch').as('dbrBatch');
    cy.route('POST', '**/api/dbs/batch').as('dbsBatch');
    cy.route('POST', '**/api/dbr/picklist-values').as('picklistValues');
    cy.route('POST', '**/api/dbr/**/drills').as('drills');
    cy.route('GET', '**/api/mdx/**').as('getMdx');
    cy.route('GET', '**/api/cubes/contentStore/**').as('elementSecurity');
}

// POST request
export const postRequest = (path, userToken, body) => {
    cy.getCookies().then((cookie) => {
        let cookieSet = `APPBASESESSIONID=${cookie[0].value}; UX_CLIENTTIMEOFFSET=${cookie[1].value}; UX_SERVERTIME=${cookie[2].value}; UX_SESSIONEXPIRY=${cookie[3].value}`
        cy.request({
            method: 'POST',
            url: baseURL + '/' + path,
            body: body,
            headers: {
                'X-CSRF-Token': userToken
            }
        }).then(response => {
            expect(response.body.cubeUpdateStatus[0].statusCode).to.deep.equal(204);
            return response;
        })
    })
}
describe('Widget grid read only', () => {
    let header = new Header()
    before(() => {
        cy.clearCookies();
        setupRoutes();

        cy.viewport('macbook-15');
        // Navigate to Grid widget - Read only view
        cy.visit(ApliqoTestSite);
        cy.clearCookies()
        cy.reload()

        // Instance 1
        cy.wait(6500);
        cy.get('#tm1-login-user', { timeout: 90000 }).type(login).should('have.value', login);
        if (password)
            cy.get('#tm1-login-pass').type(password);
        cy.get('#tm1-login-button').click();
    })


    it('Grid widget read only mode', () => {
        // Make sure "Default Grid - all options per default" widget got loaded on the screen        
        cy.get('div[id="Pratik->a20.f1.v2.w1-tableInstance"]', { timeout: 90000 }).should('exist');
        // Enabled the edit mode
        header.getEditMode()
            .should('exist')
            .click({ force: true })

        // Check whether Portugal Aug cell has the grey background colour
        cy.get('div[id="Pratik->a20.f1.v2.w1-tableInstance"] [data-cy=Portugal]', { timeout: 90000 })
            .should('exist')
            .parent('tr')
            .children()
            .eq(7)
            .should('have.class', 'input')
            .and('have.css', 'background-color')
            .and('eq', 'rgb(237, 237, 237)');
        // Using the API, Update the JSON editor with the proper token. 
        cy.wait('@mdx').then((xhr) => {
            let userToken = xhr.request.headers['X-CSRF-Token'];
            let addReadParam = batchMockData;
            postRequest('api/dbs/batch', userToken, addReadParam);
        })
        // Click on the settings icon
        cy.get('[data-cy="widget_action_menu_Pratik->a20.f1.v2.w1"]', { timeout: 90000 })
            .should('exist')
            .click({ force: true });
        cy.get('[data-cy="widget_view_Pratik->a20.f1.v2.w1"] [data-cy="openSettingsModal"]', { timeout: 90000 })
            .should('exist')
            .click({ force: true });
        // Make sure settings popup exist
        cy.get('adm-view-settings-modal', { timeout: 90000 })
            .should('exist')
        // Make sure table object exist on the advanced option json
        // cy.wait(3500).get('.jsoneditor-compact', { timeout: 90000 }).should('exist').click({ force: true });

        cy.wait(1500).get('.ace_text-layer').should('exist').then(($val) => {

            let getText = $val.text();
            let JSONdata = JSON.stringify(getText);
            cy.wrap(JSONdata).should('include', 'readOnly');
        });

        // Close the popup 
        cy.get('[data-cy=settings-modal-close]', { timeout: 90000 })
            .should('exist')
            .click({ force: true });
        cy.get('adm-view-settings-modal', { timeout: 90000 }).should('not.exist')
        cy.wait(5000)
        // Make sure Save and discard exist on the screen
        header.getSaveButton().should('exist')
        header.getDiscardButton().should('exist')

        // 6.	Check whether save and discard buttons exist on the screen and the Portugal Aug cell has the white background colour
        cy.get('div[id="Pratik->a20.f1.v2.w1-tableInstance"] [data-cy=Portugal]', { timeout: 90000 })
            .should('exist')
            .parent('tr')
            .children()
            .eq(7)
            .not('have.class', 'input')
            .and('have.css', 'background-color')
            .and('eq', 'rgb(255, 255, 255)');

        // Discard the changes
        cy.get('[data-cy=editMode_Discard]', { timeout: 90000 })
            .should('exist')
            .click({ force: true });
        cy.get('confirm-discard-changes-modal', { timeout: 90000 })
            .should('exist')
        cy.get('[data-cy=delete-view-modal-confirmation]', { timeout: 90000 })
            .should('exist')
            .click({ force: true });
        cy.get('confirm-discard-changes-modal', { timeout: 90000 })
            .should('not.exist')

        // 8.	Make sure the grid widget turns to the original state   
        cy.wait(3500).get('div[id="Pratik->a20.f1.v2.w1-tableInstance"] [data-cy=Portugal]', { timeout: 90000 })
            .should('exist')
            .parent('tr')
            .children()
            .eq(6)
            .should('have.class', 'input');
    })

    after(() => {
        header.logout()
    })
})


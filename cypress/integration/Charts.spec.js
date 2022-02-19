///<reference types="cypress"/>

import Charts from "../pageObject/Charts";
import Header from "../pageObject/Header";
import Login from "../pageObject/Login";

const baseURL = "http://cubewise.in:4880/Apliqo_Test/#!/app/Pratik-%3Ea20.f2.v1"
const ApliqoTestSite = "http://cubewise.in:4880/Apliqo_Test/#!/app/Pratik-%3Ea20.f2.v1"
const login = 'pratik';
const password = 'cubewise@123';


describe('Charts', () => {
    let login = new Login()
    let charts = new Charts()
    let header = new Header()
    before(() => {
        cy.clearCookies()
        cy.viewport('macbook-15')
        cy.visit(ApliqoTestSite)
        login.login(Cypress.env().username, Cypress.env().password)
    })


    it('loads all charts', () => {

        //navigate to charts dashboard
        cy.get('[data-cy=appbarParent-Assessment]').click()
        cy.get('[data-cy=appbarChild-Dashboard]').trigger('mouseover')
        cy.get("[data-cy='appbarChild-Charts - Basic Test All Chart Types']").eq(1).click()
        cy.wait(5000)

        //verifing all charts are loaded
        cy.get("span[id='headingEditInput_Pratik->a20.f1.v1']").should('have.text', "Charts - Basic Test All Chart Types")
        charts.getChartWaterFall().should('be.visible').and('include.html', 'svg')
        charts.getWorldChartArea().should('be.visible').and('include.html', 'svg')
        charts.getChartBar().should('be.visible').and('include.html', 'svg')
        charts.getChartBubble().should('be.visible').and('include.html', 'svg')
        charts.getChartColumn().should('be.visible').and('include.html', 'svg')
        charts.getChartLine().should('be.visible').and('include.html', 'svg')
        charts.getChartPie().should('be.visible').and('include.html', 'svg')
        charts.getChartWaterfallPercentage().should('be.visible').and('include.html', 'svg')
        cy.wait(5400)

        //verifying colors for actual/ budget in chart waterfall
        charts.getChartWaterFall().within(() => {
            cy.get('.highcharts-series-group').within(() => {
                cy.get('rect')
                    .first()
                    .should('have.attr', 'fill')
                    .and('eq', '#2BABE1')
                cy.get('rect')
                    .last()
                    .should('have.attr', 'fill')
                    .and('eq', '#030303')
            })
        })

        let childNumber = 0
        //Verify Italiy is present in chart column and store index
        charts.getChartColumn().within(() => {
            cy.get('.highcharts-xaxis-labels').within(() => {
                cy.get('text').contains('Italy')
                cy.get('text').each((text, index) => {
                    if (text.text() == "Italy") {
                        childNumber = index
                    }
                })
            })
        })

        //verify color as per index of italy
        charts.getChartColumn().within(() => {
            cy.get('.highcharts-series-group').within(() => {
                cy.get('.highcharts-tracker').eq(0).within(() => {
                    cy.get('rect')
                        .eq(childNumber)
                        .should('have.attr', 'fill')
                        .and('eq', "#2BABE1")
                })
                cy.get('.highcharts-tracker').eq(1).within(() => {
                    cy.get('rect')
                        .eq(childNumber)
                        .should('have.attr', 'fill')
                        .and('eq', "#030303")
                })
            })
        })

        //verifying xaxis contain number 4 in chart line
        charts.getChartLine().within(() => {
            cy.get('.highcharts-xaxis-labels')
                .get('text')
                .contains(/^4$/)
                .should('have.text', '4')
        })

        //Verify chart waterfall percent has % in tooltip
        charts.getChartWaterfallPercentage().within(() => {
            cy.get('.highcharts-tracker').within(() => {
                cy.get('rect')
                    .last()
                    .trigger('mouseover')
            })
            cy.get('.highcharts-tooltip')
                .should('be.visible')
                .within(() => {
                    cy.get('td')
                        .last()
                        .should('include.text', '%')
                })
        })

        //verify chart column value for italy
        charts.getChartColumn().within(() => {
            cy.get('.highcharts-tracker').eq(0).within(() => {
                cy.get('rect')
                    .eq(childNumber)
                    .trigger('mouseover', { force: true })
            })
            cy.get('.highcharts-tooltip')
                .should('be.visible')
                .within(() => {
                    cy.get('td')
                        .last()
                        .should('have.text', '6,252,008.35')
                })
        })
    })


    after(() => {
        cy.get('[data-cy="userid"]').click()
        cy.get('[data-cy=logout]').click()
        cy.get('.login-pf-header').should('be.visible')
    })
})
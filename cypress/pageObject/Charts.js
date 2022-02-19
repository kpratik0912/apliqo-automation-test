class Charts {

    getChartWaterFall = () => {
        return cy.get("highchart[id='chart-Pratik->a20.f1.v1.w3']")
    }

    getWorldChartArea = () => {
        return cy.get("highchart[id='chart-Pratik->a20.f1.v1.w8']")
    }

    getChartBar = () => {
        return cy.get("highchart[id='chart-Pratik->a20.f1.v1.w10']")
    }

    getChartBubble = () => {
        return cy.get("highchart[id='chart-Pratik->a20.f1.v1.w12']")
    }

    getChartColumn = () => {
        return cy.get("highchart[id='chart-Pratik->a20.f1.v1.w13']")
    }

    getChartLine = () => {
        return cy.get("highchart[id='chart-Pratik->a20.f1.v1.w14']")
    }

    getChartPie = () => {
        return cy.get("highchart[id='chart-Pratik->a20.f1.v1.w15']")
    }

    getChartWaterfallPercentage = () => {
        return cy.get("highchart[id='chart-Pratik->a20.f1.v1.w1']")
    }
}


export default Charts
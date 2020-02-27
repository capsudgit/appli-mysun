import _ from 'lodash'

export default function(from, to, annualCost, firstIncrease, secondIncrease) {
    const bills = []

    _.range(from, to).forEach((year) => {
        let coef
        let previousBill = annualCost

        if (bills.length) {
            previousBill = bills[bills.length - 1];
        }

        if (year - from <= 5) {
            coef = 1 + firstIncrease
        }  else {
            coef = 1 + secondIncrease
        }

        bills.push(previousBill * coef)
    })

    return bills
}

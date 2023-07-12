

export const parseNumber = (number) => {
    if (number / 10 >= 1) {
        return number
    } else {
        return "0" + number
    }
}

export const parseMoney = (value) =>
    new Intl.NumberFormat('fr-CA', {
        style: 'currency',
        currency: 'DZD'
    }).format(value);

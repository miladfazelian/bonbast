function extractValues(input) {
    const parts = input.split('\n');
    const pricePart = parts[0];
    const priceMatch = pricePart.match(/(\d{1,3}(,\d{3})*)/);
    const price = priceMatch ? Number(priceMatch[0].replace(/,/g, '')) : 0;


    const typeMatch = pricePart.match(/نقدی|فردایی/);
    const type = typeMatch ? typeMatch[0] : '';

    const actionPart = parts[1];
    const actionMatch = actionPart.match(/فروش|خرید|معامله/);
    const action = actionMatch ? actionMatch[0] : '';

    return {
        price: price,
        type: type,
        action: action
    };
}


function extractNumber(str) {

    const match = str.match(/\d+/);
    const number = match ? Number(match[0]) : null;
    return number;
}

module.exports = {extractValues,extractNumber}



export const formatNumber = (price, type) => {

    if (type === "percentage") {
        return price.toFixed(2);
    }

    if (price >= 1e9) {
        return Math.sign(price) * ((Math.abs(price) / 1e9).toFixed(2)) + " B";
    } else if (price >= 1e7) {
        return Math.sign(price) * ((Math.abs(price) / 1e7).toFixed(2)) + " M";
    } else if (price >= 1e3) {
        return Math.sign(price) * ((Math.abs(price) / 1000).toFixed(2)) + " K"
    } else {
        return price.toFixed(2);
    }
}
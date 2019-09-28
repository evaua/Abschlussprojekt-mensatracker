/* eslint-env browser */

const Config = {
    ENTRY_VIEW_TEMPLATE: document.querySelector("#menu-entry").innerHTML.trim(),
    CSS_HIDDEN_CLASS_NAME: "hidden",
    SHOW_ELEMENT_DELAY_IN_MS: 100,
    BASE_API_URL: "https://regensburger-forscher.de:9001/mensa/uni/{{day}}",
    WEEKDAYS_SHORT: ["mo", "di", "mi", "do", "fr"],
    WEEKDAYS_SHORT_CAP: ["Mo", "Di", "Mi", "Do", "Fr"],
    WEEKDAYS_LONG: ["monday", "tuesday", "wednesday", "thursday", "friday"],
    RATINGS: [0, 0],
    MEALS: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    MONEY: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    RATING_ONE: 0,
    RATING_TWO: 1.5,
    RATING_THREE: 2.5,
    RATING_FOUR: 3.5,
    RATING_FIVE: 4.5,
    EURO_CHAR: "\u20AC",
    DECIMALS: 2,
    ENTER_CODE: 13,
    MONTHS: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    LENGTH_LIST_DEFAULT: 10,
};

Object.freeze(Config);

export default Config;
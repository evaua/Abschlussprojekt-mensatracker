/* eslint-env browser */

const DBConfig = {
    DB_NAME: "entryDatabase",
    DB_STORE_KEY: "entries",
    DB_STORE_KEY_PATH: "id",
    MEALMONTHS: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    MONEYMONTHS: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    DECIMALS: 2,
};

Object.freeze(DBConfig);

export default DBConfig;
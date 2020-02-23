const Joi = require('@hapi/joi');

let validate = schema => (req, res, next) => {
    let data = schema.validate(req.body);
    if (data.error) {
        console.log(data.error);
        return res.status(400).json('Введены некорректные данные');
    }
    req.body = data.value;
    return next();
};

const ADD_USER_SCHEMA = Joi.object().keys({
    name: Joi.string().min(3).max(30).required(),
    number: Joi.number().min(1000000000).max(9999999999).required(),
    password: Joi.string().min(6).max(30).required(),
})

const EDIT_USER_SCHEMA = Joi.object().keys({
    name: Joi.string().min(3).max(30),
    password: Joi.string().min(6).max(30).required(),
    newPassword: Joi.string().min(6).max(30),
})

const LOGIN_SCHEMA = Joi.object().keys({
    grant_type: Joi.string().required(),
    client_id: Joi.string().required(),
    client_secret: Joi.string().required(),
    username: Joi.string().length(10).required(),
    password: Joi.string().min(6).max(30).required(),
})

const NEW_TOKEN_SCHEMA = Joi.object().keys({
    grant_type: Joi.string().required(),
    client_id: Joi.string().required(),
    client_secret: Joi.string().required(),
    refresh_token: Joi.string().required(),
})

const LOGOUT_SCHEMA = Joi.object().keys({
    clientId: Joi.string().required(),
})

const ADD_AD_SCHEMA = Joi.object().keys({
    city: Joi.string().required(),
    type: Joi.string().max(5).required(),
    price: Joi.number().positive().integer().min(3000).required(),
    area: Joi.number().positive().required(),
    floor: Joi.number().positive().integer().required(),
    floors: Joi.number().positive().integer().required(),
    address: Joi.string().required(),
    coordX: Joi.number().min(-180).max(180).required(),
    coordY: Joi.number().min(-90).max(90).required(),
    text: Joi.string().min(50).required(),
    photos: Joi.string(),
    photosSmall: Joi.string(),
})

const EDIT_AD_SCHEMA = Joi.object().keys({
    idAd: Joi.number().required(),
    price: Joi.number().positive().integer().min(3000).required(),
    area: Joi.number().positive().required(),
    floor: Joi.number().positive().integer().required(),
    floors: Joi.number().positive().integer().required(),
    text: Joi.string().min(50).required(),
    photos: Joi.string(),
})

const REMOVE_AD_SCHEMA = Joi.object().keys({
    idAd: Joi.number().required(),
})

const GET_ONE_ROOM_SCHEMA = Joi.object().keys({
    idAd: Joi.number().required(),
})

const GET_LIST_ROOM_SCHEMA = Joi.object().keys({
    city: Joi.string().required(),
    orderBy: Joi.string().default('created'),
    order: Joi.string().regex(/^(asc|desc)$/).default('asc'),
    offset: Joi.number().default(0),
    limit: Joi.number().default(10),
    min: Joi.number().default(0),
    max: Joi.number().default(9999999),
    type: Joi.string().default(['r', 'st', '1k', '2k', '3k', '4k+']),
    coordX: Joi.array().default([-180, 180]),
    coordY: Joi.array().default([-90, 90]),
})

const GET_MAP_ITEM_SCHEMA = Joi.object().keys({
    idAd: Joi.number().required(),
})

const GET_NUMBER_SCHEMA = Joi.object().keys({
    idAd: Joi.number().required(),
})

const UPD_IN_CALL_SCHEMA = Joi.object().keys({
    idInCall: Joi.number().required(),
    rating: Joi.number().integer().min(-1).max(2).required(),
})

const UPD_OUT_CALL_SCHEMA = Joi.object().keys({
    idOutCall: Joi.number().required(),
    rating: Joi.number().integer().min(-1).max(2).required(),
})

module.exports = {
    validate,
    ADD_USER_SCHEMA,
    EDIT_USER_SCHEMA,
    LOGIN_SCHEMA,
    LOGOUT_SCHEMA,
    NEW_TOKEN_SCHEMA,
    ADD_AD_SCHEMA,
    EDIT_AD_SCHEMA,
    REMOVE_AD_SCHEMA,
    GET_ONE_ROOM_SCHEMA,
    GET_LIST_ROOM_SCHEMA,
    GET_MAP_ITEM_SCHEMA,
    GET_NUMBER_SCHEMA,
    UPD_IN_CALL_SCHEMA,
    UPD_OUT_CALL_SCHEMA,
}

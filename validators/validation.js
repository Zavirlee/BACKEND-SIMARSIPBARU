const { param, body } = require('express-validator');
const { validator } = require('./validator');

const register = [
    body('nama').isLength({min:5}),
    body('username').notEmpty(),
    body('password').isLength({min:8}),
    validator
]

const login = [
    body('username').notEmpty(),
    // body('password').isLength({min:8}),
    validator
]

const add_archive = [
    body('archive_code'),
    body('archive_catalog_id'),
    body('archive_title'),
    body('archive_serial_number'), 
    body('archive_release_date'),
    body('archive_file_number'),
    body('archive_condition_id'),
    body('archive_type_id'),
    body('archive_class_id'),
    body('archive_agency' ),
    body('user_id'),
    body('archive_loc_building_id'),
    body('archive_loc_room_id'),
    body('archive_loc_rollopack_id'),
    body('archive_loc_cabinet'),
    body('archive_loc_rack'),
    body('archive_loc_box'),
    body('archive_loc_cover')
]

const create_user = [
    body('username').notEmpty(),
    body('password').isLength({min:8}),
    body('satker').isLength({min:8})
]

module.exports = {
    register,
    login,
    add_archive,
    create_user
}
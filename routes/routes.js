const express = require("express");
const router = express.Router();
const controller = require("../controllers/controller");
const Auth = require("../middleware/auth");
const { body, param, validationResult } = require("express-validator");
const { Validation } = require("../validators");

// router.route('/register').post(Validation.register, controller.register)

router.get('/getIP', controller.getIP);

router.route("/login").post(Validation.login, controller.login);

router.route("/home").post(controller.home);

router.route("/dashboardData").post(controller.dashboardData);

router.route("/bardata").post(controller.bardata);

router.route("/catalogData").post(controller.catalogData);

router.route("/terbaru").post(controller.terbaru);

router.route("/logArchive").post(controller.logArchive);

router.route("/category").post(controller.archive_by_category);

router.route("/byDate").post(controller.archive_by_date);

router.route("/addArchive").post(Auth.verifyToken, controller.add_archive);

router.route("/archiveDetail").post(controller.archiveDetail);

router
  .route("/updateArchive")
  .post(Auth.verifyToken, controller.update_archive);

router.route("/detailUser").post(controller.detail_user);

router.route("/createUser").post(Auth.verifyToken, controller.create_user);

router.route("/readUser").post(controller.read_user);

router.route("/uppdateUser").post(Auth.verifyToken, controller.update_user);

router.route("/deleteUser").post(Auth.verifyToken, controller.delete_user);

router.route("/logout").post(Auth.verifyToken, controller.logout);

router.route("/verify").post(Auth.verifyToken, controller.verify);

router.route("/masterData").post(controller.masterData);

router.route("/INDEKS%20KATALOG").post(controller.catalog);

router.route("/KONDISI").post(controller.condition);

router.route("/JENIS%20ARSIP").post(controller.type);

router.route("/KELAS%20ARSIP").post(controller.classArchive);

router.route("/GEDUNG").post(controller.building);

router.route("/RUANGAN").post(controller.room);

router.route("/ROLL%20O%20PACK").post(controller.rollopack);

router.route("/LEMARI").post(controller.cabinet);

router.route("/insertCatalog").post(Auth.verifyToken, controller.insertCatalog);

router.route("/insertCondition").post(Auth.verifyToken, controller.insertCondition);

router.route("/insertType").post(Auth.verifyToken, controller.insertType);

router.route("/insertClassArchive").post(Auth.verifyToken, controller.insertClassArchive);

router.route("/insertBuilding").post(Auth.verifyToken, controller.insertBuilding);

router.route("/insertRoom").post(Auth.verifyToken, controller.insertRoom);

router.route("/insertRollOPack").post(Auth.verifyToken, controller.insertRollOPack);

router.route("/insertCabinet").post(Auth.verifyToken, controller.insertCabinet);

router.route("/deleteCatalog").post(Auth.verifyToken, controller.deleteCatalog);

router.route("/deleteCondition").post(Auth.verifyToken, controller.deleteCondition);

router.route("/deleteType").post(Auth.verifyToken, controller.deleteType);

router.route("/deleteClassArchive").post(Auth.verifyToken, controller.deleteClassArchive);

router.route("/deleteBuilding").post(Auth.verifyToken, controller.deleteBuilding);

router.route("/deleteRoom").post(Auth.verifyToken, controller.deleteRoom);

router.route("/deleteRollOPack").post(Auth.verifyToken, controller.deleteRollOPack);

router.route("/deleteCabinet").post(Auth.verifyToken, controller.deleteCabinet);

router.route("/updateCatalog").post(Auth.verifyToken, controller.updateCatalog);

router.route("/updateCondition").post(Auth.verifyToken, controller.updateCondition);

router.route("/updateType").post(Auth.verifyToken, controller.updateType);

router.route("/updateClassArchive").post(Auth.verifyToken, controller.updateClassArchive);

router.route("/updateBuilding").post(Auth.verifyToken, controller.updateBuilding);

router.route("/updateRoom").post(Auth.verifyToken, controller.updateRoom);

router.route("/updateRollOPack").post(Auth.verifyToken, controller.updateRollOPack);

router.route("/updateCabinet").post(Auth.verifyToken, controller.updateCabinet);

module.exports = router;

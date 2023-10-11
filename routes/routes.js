const express = require("express");
const router = express.Router();
const controller = require("../controllers/controller");
const Auth = require("../middleware/auth");
const { body, param, validationResult } = require("express-validator");
const { Validation } = require("../validators");

// router.route('/register').post(Validation.register, controller.register)

router.route("/login").post(Validation.login, controller.login);

router.route("/home").post(controller.home);

router.route("/dashboardData").post(controller.dashboardData);

router.route("/bardata").post(controller.bardata);

router.route("/catalogData").post(controller.catalogData);

router.route("/terbaru").post(controller.terbaru);

router.route("/category").post(controller.archive_by_category);

router.route("/byDate").post(controller.archive_by_date);

router.route("/addArchive").post(Auth.verifyToken, controller.add_archive);

router.route("/archiveDetail").post(controller.archiveDetail);

router
  .route("/updateArchive")
  .post(Auth.verifyToken, controller.update_archive);

router.route("/detailUser").post(controller.detail_user);

router.route("/createUser").post(controller.create_user);

router.route("/readUser").post(controller.read_user);

router.route("/uppdateUser").post(controller.update_user);

router.route("/deleteUser").post(controller.delete_user);

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

router.route("/insertCatalog").post(controller.insertCatalog)

router.route("/insertCondition").post(controller.insertCondition)

router.route("/insertType").post(controller.insertType)

router.route("/insertClassArchive").post(controller.insertClassArchive)

router.route("/insertBuilding").post(controller.insertBuilding)

router.route("/insertRoom").post(controller.insertRoom)

router.route("/insertRollOPack").post(controller.insertRollOPack)

router.route("/insertCabinet").post(controller.insertCabinet)

router.route("/deleteCatalog").post(controller.deleteCatalog)

router.route("/deleteCondition").post(controller.deleteCondition)

router.route("/deleteType").post(controller.deleteType)

router.route("/deleteClassArchive").post(controller.deleteClassArchive)

router.route("/deleteBuilding").post(controller.deleteBuilding)

router.route("/deleteRoom").post(controller.deleteRoom)

router.route("/deleteRollOPack").post(controller.deleteRollOPack)

router.route("/deleteCabinet").post(controller.deleteCabinet)

router.route("/updateCatalog").post(controller.updateCatalog)

router.route("/updateCondition").post(controller.updateCondition)

router.route("/updateType").post(controller.updateType)

router.route("/updateClassArchive").post(controller.updateClassArchive)

router.route("/updateBuilding").post(controller.updateBuilding)

router.route("/updateRoom").post(controller.updateRoom)

router.route("/updateRollOPack").post(controller.updateRollOPack)

router.route("/updateCabinet").post(controller.updateCabinet)

module.exports = router;

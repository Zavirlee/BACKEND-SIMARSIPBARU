const { Services } = require("../services");
const { responseHelper } = require("../helper");
const bcrypt = require("bcryptjs");

const getIP = async (req, res) => {
  try {
    const clientIP = await Services.getIP(req);
    res.json({ ip: clientIP });
  } catch (error) {
    console.error("Failed to get client IP", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const ip = req.body.ip;
    const result = await Services.login(username, password, ip);
    if (result instanceof Error) {
      throw new Error(result);
    }
    res
      .cookie(("token", result.token), ("level", result.level_user_id))
      .status(responseHelper.status.success)
      .send(result);
  } catch (error) {
    res.status(responseHelper.status.error).json(error.message);
  }
};

const home = async (req, res) => {
  try {
    const result = await Services.home();
    if (result instanceof Error) {
      throw new Error(result);
    }
    res.status(responseHelper.status.success).json(result);
  } catch (error) {
    res.status(responseHelper.status.error).json(error.message);
  }
};

const dashboardData = async (req, res) => {
  try {
    const result = await Services.dashboardData();
    if (result instanceof Error) {
      throw new Error(result);
    }
    res.status(responseHelper.status.success).json(result);
  } catch (error) {
    res.status(responseHelper.status.error).json(error.message);
  }
};

const bardata = async (req, res) => {
  try {
    const result = await Services.bardata();
    if (result instanceof Error) {
      throw new Error(result);
    }
    res.status(responseHelper.status.success).json(result);
  } catch (error) {
    res.status(responseHelper.status.error).json(error.message);
  }
};

const catalogData = async (req, res) => {
  try {
    const result = await Services.catalogData();
    if (result instanceof Error) {
      throw new Error(result);
    }
    res.status(responseHelper.status.success).json(result);
  } catch (error) {
    res.status(responseHelper.status.error).json(error.message);
  }
};

const terbaru = async (req, res) => {
  try {
    const result = await Services.terbaru();
    if (result instanceof Error) {
      throw new Error(result);
    }
    res.status(responseHelper.status.success).json(result);
  } catch (error) {
    res.status(responseHelper.status.error).json(error.message);
  }
};

const logArchive = async (req, res) => {
  try {
    const result = await Services.logArchive();
    if (result instanceof Error) {
      throw new Error(result);
    }
    res.status(responseHelper.status.success).json(result);
  } catch (error) {
    res.status(responseHelper.status.error).json(error.message);
  }
};

const archive_by_category = async (req, res) => {
  try {
    const { archive_catalog_id } = req.body;
    const result = await Services.archive_by_category(archive_catalog_id);
    if (result instanceof Error) {
      throw new Error(result);
    }
    res.status(responseHelper.status.success).json(result);
  } catch (error) {
    res.status(responseHelper.status.error).json(error.message);
  }
};

const archive_by_date = async (req, res) => {
  try {
    const result = await Services.archive_by_date();
    if (result instanceof Error) {
      throw new Error(result);
    }
    res.status(responseHelper.status.success).json(result);
  } catch (error) {
    res.status(responseHelper.status.error).json(error.message);
  }
};

const add_archive = async (req, res) => {
  try {
    const user_id = req.verified;
    const ip = req.body.ip;

    // console.log(user_id);

    // console.log(req.body);

    const {
      archive_file,
      archive_code,
      archive_catalog_id,
      archive_serial_number,
      archive_file_number,
      archive_title,
      archive_release_date,
      archive_condition_id,
      archive_type_id,
      archive_class_id,
      archive_agency,
      archive_loc_building_id,
      archive_loc_room_id,
      archive_loc_rollopack_id,
      archive_loc_cabinet,
      archive_loc_rack,
      archive_loc_box,
    } = req.body.data;

    // const fileBuffer = Buffer.from(archive_file, "base64");

    const result = await Services.add_archive(
      ip,
      archive_file,
      archive_code,
      archive_catalog_id,
      archive_serial_number,
      archive_file_number,
      archive_title,
      archive_release_date,
      archive_condition_id,
      archive_type_id,
      archive_class_id,
      archive_agency,
      user_id,
      archive_loc_building_id,
      archive_loc_room_id,
      archive_loc_rollopack_id,
      archive_loc_cabinet,
      archive_loc_rack,
      archive_loc_box
    );

    if (result instanceof Error) {
      throw new Error(result);
    }
    res.status(responseHelper.status.success).json(result);
  } catch (error) {
    res.status(responseHelper.status.error).json(error.message);
  }
};

const archiveDetail = async (req, res) => {
  try {
    const { archive_id } = req.body;
    const result = await Services.archiveDetail(archive_id);
    if (result instanceof Error) {
      throw new Error(result);
    }
    res.status(responseHelper.status.success).json(result);
  } catch (error) {
    res.status(responseHelper.status.error).json(error.message);
  }
};

const update_archive = async (req, res) => {
  try {
    const user_id = req.verified;
    const ip = req.body.ip;

    console.log(user_id);

    console.log("data:", req.body.data);

    const updateData = req.body.data; // Fields to update

    console.log("DATA 1 : ", updateData);

    const result = await Services.update_archive(user_id, ip, updateData);

    if (result instanceof Error) {
      throw new Error(result);
    }

    res.status(responseHelper.status.success).json(result);
  } catch (error) {
    res.status(responseHelper.status.error).json(error.message);
  }
};

module.exports = {
  update_archive,
};

const detail_user = async (req, res) => {
  try {
    const { user_id } = req.body;
    const result = await Services.detail_user(user_id);
    if (result instanceof Error) {
      throw new Error(result);
    }
    res.status(responseHelper.status.success).json(result);
  } catch (error) {
    res.status(responseHelper.status.error).json(error.message);
  }
};

const create_user = async (req, res) => {
  try {
    const user_id = req.verified;
    const ip = req.body.ip;
    const { username, password, satker, level_user_id } = req.body.data;
    const result = await Services.create_user(
      user_id,
      ip,
      username,
      password,
      satker,
      level_user_id
    );
    if (result instanceof Error) {
      throw new Error(result);
    }
    res.status(responseHelper.status.success).json(result);
  } catch (error) {
    res.status(responseHelper.status.error).json(error.message);
  }
};

const read_user = async (req, res) => {
  try {
    const result = await Services.read_user();
    if (result instanceof Error) {
      throw new Error(result);
    }
    res.status(responseHelper.status.success).json(result);
  } catch (error) {
    res.status(responseHelper.status.error).json(error.message);
  }
};

const update_user = async (req, res) => {
  try {
    const uid = req.verified;
    const ip = req.body.ip;
    // Ambil data yang akan diubah dari permintaan
    const { user_id, username, password, satker, level_user_id } =
      req.body.data;

    console.log("user update : ", req.body.data)

    // Buat objek yang hanya berisi data yang akan diubah
    const updatedUserData = {};

    if (username) {
      updatedUserData.username = username;
    }

    if (password) {
      // Hash password baru jika ada
      updatedUserData.password = await bcrypt.hash(password, 10);
    }

    if (satker) {
      updatedUserData.satker = satker;
    }

    if (level_user_id) {
      updatedUserData.level_user_id = level_user_id;
    }

    // Panggil layanan (service) untuk melakukan pembaruan
    const result = await Services.update_user(
      uid,
      ip,
      user_id,
      updatedUserData
    );

    if (result instanceof Error) {
      throw new Error(result);
    }

    res.status(responseHelper.status.success).json(result);
  } catch (error) {
    res.status(responseHelper.status.error).json(error.message);
  }
};

const delete_user = async (req, res) => {
  try {
    const user_id = req.verified;
    const ip = req.body.ip;
    const { username } = req.body;

    const result = await Services.delete_user(user_id, ip, username);
    if (result instanceof Error) {
      throw new Error(result);
    }
    res.status(responseHelper.status.success).json(result);
  } catch (error) {
    res.status(responseHelper.status.error).json(error.message);
  }
};

const logout = async (req, res) => {
  try {
    const { user_id } = req.body;
    const ip = req.body.ip;

    const result = await Services.logout(user_id, ip);
    if (result instanceof Error) {
      throw new Error(result);
    }
    res
      .clearCookie("token")
      .status(responseHelper.status.success)
      .send("Berhasil Logout");
  } catch (error) {
    res.status(responseHelper.status.error).json(error.message);
  }
};

const verify = async (req, res, next) => {
  try {
    const verified = req.verified;
    const result = await Services.verify(verified);
    if (result instanceof Error) {
      throw new Error(result);
    }
    res.status(responseHelper.status.success).json(result);
  } catch (error) {
    res.status(responseHelper.status.error).json(error.message);
  }
};

const masterData = async (req, res) => {
  try {
    const result = await Services.masterData();
    if (result instanceof Error) {
      throw new Error(result);
    }
    res.status(responseHelper.status.success).json(result);
  } catch (error) {
    res.status(responseHelper.status.error).json(error.message);
  }
};

const catalog = async (req, res) => {
  try {
    const result = await Services.catalog();
    if (result instanceof Error) {
      throw new Error(result);
    }
    res.status(responseHelper.status.success).json(result);
  } catch (error) {
    res.status(responseHelper.status.error).json(error.message);
  }
};

const condition = async (req, res) => {
  try {
    const result = await Services.condition();
    if (result instanceof Error) {
      throw new Error(result);
    }
    res.status(responseHelper.status.success).json(result);
  } catch (error) {
    res.status(responseHelper.status.error).json(error.message);
  }
};
const type = async (req, res) => {
  try {
    const result = await Services.type();
    if (result instanceof Error) {
      throw new Error(result);
    }
    res.status(responseHelper.status.success).json(result);
  } catch (error) {
    res.status(responseHelper.status.error).json(error.message);
  }
};

const classArchive = async (req, res) => {
  try {
    const result = await Services.classArchive();
    if (result instanceof Error) {
      throw new Error(result);
    }
    res.status(responseHelper.status.success).json(result);
  } catch (error) {
    res.status(responseHelper.status.error).json(error.message);
  }
};

const building = async (req, res) => {
  try {
    const result = await Services.building();
    if (result instanceof Error) {
      throw new Error(result);
    }
    res.status(responseHelper.status.success).json(result);
  } catch (error) {
    res.status(responseHelper.status.error).json(error.message);
  }
};

const room = async (req, res) => {
  try {
    const result = await Services.room();
    if (result instanceof Error) {
      throw new Error(result);
    }
    res.status(responseHelper.status.success).json(result);
  } catch (error) {
    res.status(responseHelper.status.error).json(error.message);
  }
};

const rollopack = async (req, res) => {
  try {
    const result = await Services.rollopack();
    if (result instanceof Error) {
      throw new Error(result);
    }
    res.status(responseHelper.status.success).json(result);
  } catch (error) {
    res.status(responseHelper.status.error).json(error.message);
  }
};

const cabinet = async (req, res) => {
  try {
    const result = await Services.cabinet();
    if (result instanceof Error) {
      throw new Error(result);
    }
    res.status(responseHelper.status.success).json(result);
  } catch (error) {
    res.status(responseHelper.status.error).json(error.message);
  }
};

const insertCatalog = async (req, res) => {
  try {
    const user_id = req.verified;
    const ip = req.body.ip;
    const { label } = req.body.data;
    const result = await Services.insertCatalog(user_id, ip, label);

    if (result instanceof Error) {
      throw new Error(result);
    }
    res.status(responseHelper.status.success).json(result);
  } catch (error) {
    res.status(responseHelper.status.error).json(error.message);
  }
};

const insertCondition = async (req, res) => {
  try {
    const user_id = req.verified;
    const ip = req.body.ip;
    const { label } = req.body.data;
    const result = await Services.insertCondition(user_id, ip, label);

    if (result instanceof Error) {
      throw new Error(result);
    }
    res.status(responseHelper.status.success).json(result);
  } catch (error) {
    res.status(responseHelper.status.error).json(error.message);
  }
};

const insertType = async (req, res) => {
  try {
    const user_id = req.verified;
    const ip = req.body.ip;
    const { label } = req.body.data;
    const result = await Services.insertType(user_id, ip, label);

    if (result instanceof Error) {
      throw new Error(result);
    }
    res.status(responseHelper.status.success).json(result);
  } catch (error) {
    res.status(responseHelper.status.error).json(error.message);
  }
};

const insertClassArchive = async (req, res) => {
  try {
    const user_id = req.verified;
    const ip = req.body.ip;
    const { label } = req.body.data;
    const result = await Services.insertClassArchive(user_id, ip, label);

    if (result instanceof Error) {
      throw new Error(result);
    }
    res.status(responseHelper.status.success).json(result);
  } catch (error) {
    res.status(responseHelper.status.error).json(error.message);
  }
};

const insertBuilding = async (req, res) => {
  try {
    const user_id = req.verified;
    const ip = req.body.ip;
    const { label } = req.body.data;
    console.log(req.body.data);
    const result = await Services.insertBuilding(user_id, ip, label);

    if (result instanceof Error) {
      throw new Error(result);
    }
    res.status(responseHelper.status.success).json(result);
  } catch (error) {
    res.status(responseHelper.status.error).json(error.message);
  }
};

const insertRoom = async (req, res) => {
  try {
    const user_id = req.verified;
    const ip = req.body.ip;
    const { label } = req.body.data;
    const result = await Services.insertRoom(user_id, ip, label);

    if (result instanceof Error) {
      throw new Error(result);
    }
    res.status(responseHelper.status.success).json(result);
  } catch (error) {
    res.status(responseHelper.status.error).json(error.message);
  }
};

const insertRollOPack = async (req, res) => {
  try {
    const user_id = req.verified;
    const ip = req.body.ip;
    const { label } = req.body.data;
    const result = await Services.insertRollOPack(user_id, ip, label);

    if (result instanceof Error) {
      throw new Error(result);
    }
    res.status(responseHelper.status.success).json(result);
  } catch (error) {
    res.status(responseHelper.status.error).json(error.message);
  }
};

const insertCabinet = async (req, res) => {
  try {
    const user_id = req.verified;
    const ip = req.body.ip;
    const { label } = req.body.data;
    const result = await Services.insertCabinet(user_id, ip, label);

    if (result instanceof Error) {
      throw new Error(result);
    }
    res.status(responseHelper.status.success).json(result);
  } catch (error) {
    res.status(responseHelper.status.error).json(error.message);
  }
};

const deleteCondition = async (req, res) => {
  try {
    const user_id = req.verified;
    const ip = req.body.ip;
    const { label } = req.body.data;
    const result = await Services.deleteCondition(user_id, ip, label);

    if (result instanceof Error) {
      throw new Error(result);
    }
    res.status(responseHelper.status.success).json(result);
  } catch (error) {
    res.status(responseHelper.status.error).json(error.message);
  }
};

const deleteType = async (req, res) => {
  try {
    const user_id = req.verified;
    const ip = req.body.ip;
    const { label } = req.body.data;
    const result = await Services.deleteType(user_id, ip, label);

    if (result instanceof Error) {
      throw new Error(result);
    }
    res.status(responseHelper.status.success).json(result);
  } catch (error) {
    res.status(responseHelper.status.error).json(error.message);
  }
};

const deleteClassArchive = async (req, res) => {
  try {
    const user_id = req.verified;
    const ip = req.body.ip;
    const { label } = req.body.data;
    const result = await Services.deleteClassArchive(user_id, ip, label);

    if (result instanceof Error) {
      throw new Error(result);
    }
    res.status(responseHelper.status.success).json(result);
  } catch (error) {
    res.status(responseHelper.status.error).json(error.message);
  }
};

const deleteBuilding = async (req, res) => {
  try {
    const user_id = req.verified;
    const ip = req.body.ip;
    const { label } = req.body.data;
    const result = await Services.deleteBuilding(user_id, ip, label);

    if (result instanceof Error) {
      throw new Error(result);
    }
    res.status(responseHelper.status.success).json(result);
  } catch (error) {
    res.status(responseHelper.status.error).json(error.message);
  }
};

const deleteRoom = async (req, res) => {
  try {
    const user_id = req.verified;
    const ip = req.body.ip;
    const { label } = req.body.data;
    const result = await Services.deleteRoom(user_id, ip, label);

    if (result instanceof Error) {
      throw new Error(result);
    }
    res.status(responseHelper.status.success).json(result);
  } catch (error) {
    res.status(responseHelper.status.error).json(error.message);
  }
};

const deleteRollOPack = async (req, res) => {
  try {
    const user_id = req.verified;
    const ip = req.body.ip;
    const { label } = req.body.data;
    const result = await Services.deleteRollOPack(user_id, ip, label);

    if (result instanceof Error) {
      throw new Error(result);
    }
    res.status(responseHelper.status.success).json(result);
  } catch (error) {
    res.status(responseHelper.status.error).json(error.message);
  }
};

const deleteCabinet = async (req, res) => {
  try {
    const user_id = req.verified;
    const ip = req.body.ip;
    const { label } = req.body.data;
    const result = await Services.deleteCabinet(user_id, ip, label);

    if (result instanceof Error) {
      throw new Error(result);
    }
    res.status(responseHelper.status.success).json(result);
  } catch (error) {
    res.status(responseHelper.status.error).json(error.message);
  }
};

const deleteCatalog = async (req, res) => {
  try {
    const user_id = req.verified;
    const ip = req.body.ip;
    const { label } = req.body.data;
    const result = await Services.deleteCatalog(user_id, ip, label);

    if (result instanceof Error) {
      throw new Error(result);
    }
    res.status(responseHelper.status.success).json(result);
  } catch (error) {
    res.status(responseHelper.status.error).json(error.message);
  }
};

const updateCatalog = async (req, res) => {
  try {
    const user_id = req.verified;
    const ip = req.body.ip;
    const { label, id } = req.body.data;
    const result = await Services.updateCatalog(user_id, ip, label, id);
    if (result instanceof Error) {
      throw new Error(result);
    }

    res.status(responseHelper.status.success).json(result);
  } catch (error) {
    res.status(responseHelper.status.error).json(error.message);
  }
};

const updateCondition = async (req, res) => {
  try {
    const user_id = req.verified;
    const ip = req.body.ip;
    const { label, id } = req.body.data;
    const result = await Services.updateCondition(user_id, ip, label, id);
    if (result instanceof Error) {
      throw new Error(result);
    }

    res.status(responseHelper.status.success).json(result);
  } catch (error) {
    res.status(responseHelper.status.error).json(error.message);
  }
};

const updateType = async (req, res) => {
  try {
    const user_id = req.verified;
    const ip = req.body.ip;
    const { label, id } = req.body.data;
    const result = await Services.updateType(user_id, ip, label, id);
    if (result instanceof Error) {
      throw new Error(result);
    }

    res.status(responseHelper.status.success).json(result);
  } catch (error) {
    res.status(responseHelper.status.error).json(error.message);
  }
};

const updateClassArchive = async (req, res) => {
  try {
    const user_id = req.verified;
    const ip = req.body.ip;
    const { label, id } = req.body.data;
    const result = await Services.updateClassArchive(user_id, ip, label, id);
    if (result instanceof Error) {
      throw new Error(result);
    }

    res.status(responseHelper.status.success).json(result);
  } catch (error) {
    res.status(responseHelper.status.error).json(error.message);
  }
};

const updateBuilding = async (req, res) => {
  try {
    const user_id = req.verified;
    const ip = req.body.ip;
    const { label, id } = req.body.data;
    const result = await Services.updateBuilding(user_id, ip, label, id);
    if (result instanceof Error) {
      throw new Error(result);
    }

    res.status(responseHelper.status.success).json(result);
  } catch (error) {
    res.status(responseHelper.status.error).json(error.message);
  }
};

const updateRoom = async (req, res) => {
  try {
    const user_id = req.verified;
    const ip = req.body.ip;
    const { label, id } = req.body.data;
    const result = await Services.updateRoom(user_id, ip, label, id);
    if (result instanceof Error) {
      throw new Error(result);
    }

    res.status(responseHelper.status.success).json(result);
  } catch (error) {
    res.status(responseHelper.status.error).json(error.message);
  }
};

const updateRollOPack = async (req, res) => {
  try {
    const user_id = req.verified;
    const ip = req.body.ip;
    const { label, id } = req.body.data;
    const result = await Services.updateRollOPack(user_id, ip, label, id);
    if (result instanceof Error) {
      throw new Error(result);
    }

    res.status(responseHelper.status.success).json(result);
  } catch (error) {
    res.status(responseHelper.status.error).json(error.message);
  }
};

const updateCabinet = async (req, res) => {
  try {
    const user_id = req.verified;
    const ip = req.body.ip;
    const { label, id } = req.body.data;
    const result = await Services.updateCabinet(user_id, ip, label, id);
    if (result instanceof Error) {
      throw new Error(result);
    }

    res.status(responseHelper.status.success).json(result);
  } catch (error) {
    res.status(responseHelper.status.error).json(error.message);
  }
};

module.exports = {
  getIP,
  login,
  home,
  dashboardData,
  catalogData,
  terbaru,
  logArchive,
  archive_by_category,
  archive_by_date,
  bardata,
  add_archive,
  archiveDetail,
  update_archive,
  detail_user,
  create_user,
  read_user,
  update_user,
  delete_user,
  logout,
  verify,
  masterData,
  catalog,
  condition,
  type,
  classArchive,
  building,
  room,
  rollopack,
  cabinet,
  insertCatalog,
  insertCondition,
  insertType,
  insertClassArchive,
  insertBuilding,
  insertRoom,
  insertRollOPack,
  insertCabinet,
  deleteCatalog,
  deleteCondition,
  deleteType,
  deleteClassArchive,
  deleteBuilding,
  deleteRoom,
  deleteRollOPack,
  deleteCabinet,
  updateCatalog,
  updateCondition,
  updateType,
  updateClassArchive,
  updateBuilding,
  updateRoom,
  updateRollOPack,
  updateCabinet,
};

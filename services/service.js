require("dotenv").config();
const { databaseQuery, databaseConfig } = require("../database");
const bcrypt = require("bcryptjs");
const { query } = require("express");
const jwt = require("jsonwebtoken");
const Cookies = require("universal-cookie");

const cookie = new Cookies();

const getIP = (req) => {
  const ip = req.connection.remoteAddress;
  return ip;
};

const login = async (username, password) => {
  try {
    const queryCheckSession =
      "SELECT login_session FROM user WHERE username = ? ";
    const resultCheckSession = await databaseQuery(queryCheckSession, [
      username,
    ]);

    if (resultCheckSession[0].login_session != 0) {
      throw new Error("Already logged In");
    } else {
      const query = "SELECT * FROM user WHERE username = ?";
      const result = await databaseQuery(query, [username]);

      if (!result.length) {
        throw new Error("Login Error");
      } else {
        const user = result[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          throw new Error("Invalid Password");
        }

        const queryUpdateSession =
          "UPDATE user SET login_session = 1, last_login = 0 WHERE username = ? ";
        const resultUpdateSession = await databaseQuery(queryUpdateSession, [
          username,
        ]);

        const token = jwt.sign(
          { id: user.user_id, username: user.username },
          process.env.SECRET
        );
        user.token = token;

        // Set cookie here if needed
        cookie.set("token", token);
        cookie.set("level", user.level_user_id);

        return user;
      }
    }
  } catch (error) {
    return error;
  }
};

const logout = async (user_id) => {
  try {
    const date = new Date();
    const query =
      "UPDATE user SET login_session = 0, last_login = ? WHERE user_id = ?";
    const result = await databaseQuery(query, [date, user_id]);
    if (!result.affectedRows === 1) {
      throw new Error("Logout Gagal");
    }
  } catch (error) {
    console.log("Error", error);
  }
};

const home = async () => {
  try {
    const query =
      "SELECT DISTINCT archive.*, archive_loc.*, archive_catalog.archive_catalog_label, archive_type.archive_type_label FROM archive INNER JOIN archive_loc ON archive.archive_id = archive_loc.archive_id INNER JOIN archive_catalog ON archive.archive_catalog_id = archive_catalog.archive_catalog_id INNER JOIN archive_type ON archive.archive_type_id = archive_type.archive_type_id ORDER BY `archive`.`archive_timestamp` DESC";
    const result = await databaseQuery(query);

    if (!result.length) {
      throw new Error("Pemanggilan Arsip Gagal");
    } else {
      const data = result;

      return data;
    }
  } catch (error) {
    return error;
  }
};

const dashboardData = async () => {
  try {
    const query =
      "SELECT (SELECT COUNT(*) FROM archive) AS total_archives, (SELECT COUNT(*) FROM archive WHERE DATE(archive_timestamp) = DATE(NOW())) AS newest_archives_count,(SELECT COUNT(*) FROM archive_catalog) AS total_archive_catalogs; ";
    const result = await databaseQuery(query);

    if (!result.length) {
      throw new Error("Pemanggilan Data Gagal");
    } else {
      const data = result;

      return data;
    }
  } catch (error) {
    return error;
  }
};

const bardata = async () => {
  try {
    const query =
      "SELECT ac.archive_catalog_id, ac.archive_catalog_label, COALESCE(COUNT(a.archive_catalog_id), 0) AS cpc FROM archive_catalog ac LEFT JOIN archive a ON ac.archive_catalog_id = a.archive_catalog_id GROUP BY ac.archive_catalog_id ORDER BY cpc DESC LIMIT 5;";
    const result = await databaseQuery(query);
    if (!result.length) {
      throw new Error("Pemanggilan Data Gagal");
    } else {
      const data = result;

      return data;
    }
  } catch (error) {
    return error;
  }
};

const catalogData = async () => {
  try {
    const query =
      "SELECT ac.archive_catalog_id, ac.archive_catalog_label, COALESCE(COUNT(a.archive_catalog_id), 0) AS cpc FROM archive_catalog ac LEFT JOIN archive a ON ac.archive_catalog_id = a.archive_catalog_id GROUP BY ac.archive_catalog_id; ";
    const result = await databaseQuery(query);

    if (!result.length) {
      throw new Error("Pemanggilan Data Gagal");
    } else {
      const data = result;

      return data;
    }
  } catch (error) {
    return error;
  }
};

const terbaru = async () => {
  try {
    const query = `SELECT DISTINCT archive.*, archive_loc.*, archive_catalog.archive_catalog_label, archive_type.archive_type_label FROM archive INNER JOIN archive_loc ON archive.archive_id = archive_loc.archive_id INNER JOIN archive_catalog ON archive.archive_catalog_id = archive_catalog.archive_catalog_id INNER JOIN archive_type ON archive.archive_type_id = archive_type.archive_type_id WHERE DATE(archive_timestamp) = CURDATE();`;
    const result = await databaseQuery(query);

    if (!result.length) {
      throw new Error("Pemanggilan Arsip Gagal");
    } else {
      const data = result;

      return data;
    }
  } catch (error) {
    return error;
  }
};

const logArchive = async () => {
  try {
    const query =
      "SELECT * FROM log JOIN user ON log.user_id = user.user_id ORDER BY `log`.`timestamp` DESC";
    const result = await databaseQuery(query);

    if (!result.length) {
      throw new Error("Pemanggilan Arsip Gagal");
    } else {
      const data = result;

      return data;
    }
  } catch (error) {
    return error;
  }
};

const archive_by_category = async (archive_catalog_id) => {
  try {
    const query =
      "SELECT * FROM archive JOIN archive_loc ON archive.archive_id = archive_loc.archive_id JOIN archive_catalog ON archive.archive_catalog_id = archive_catalog.archive_catalog_id JOIN archive_type ON archive.archive_type_id = archive_type.archive_type_id  WHERE archive.archive_catalog_id = ?";
    const result = await databaseQuery(query, [archive_catalog_id]);
    if (!result.length) {
      throw new Error("Pemanggilan Arsip Gagal");
    } else {
      const data = result;

      return data;
    }
  } catch (error) {
    return error;
  }
};

const archive_by_date = async () => {
  try {
    const query =
      "SELECT tanggal, jumlah_arsip FROM (SELECT DATE(archive_timestamp) AS tanggal, COUNT(*) AS jumlah_arsip FROM archive GROUP BY tanggal ORDER BY tanggal DESC LIMIT 5 ) AS subquery ORDER BY tanggal ASC; ";
    const result = await databaseQuery(query);
    if (!result.length) {
      throw new Error("Pemanggilan Arsip Gagal!");
    } else {
      const data = result;

      return data;
    }
  } catch (error) {
    return error;
  }
};

const add_archive = async (
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
) => {
  try {
    const archive_timestamp = new Date();

    if (
      archive_file === "" ||
      archive_code === "" ||
      archive_catalog_id === "" ||
      archive_serial_number === "" ||
      archive_file_number === "" ||
      archive_title === "" ||
      archive_release_date === "" ||
      archive_condition_id === "" ||
      archive_type_id === "" ||
      archive_class_id === "" ||
      archive_agency === "" ||
      user_id === "" ||
      archive_loc_building_id === "" ||
      archive_loc_room_id === "" ||
      archive_loc_rollopack_id === "" ||
      archive_loc_cabinet === "" ||
      archive_loc_rack === "" ||
      archive_loc_box === ""
    ) {
      throw new Error("Data tidak boleh kosong");
    }

    console.log(archive_title);

    const queryArchive =
      "INSERT INTO archive(archive_code, archive_timestamp, archive_catalog_id, archive_title, archive_serial_number, archive_release_date, archive_file_number, archive_condition_id, archive_type_id, archive_class_id, archive_agency, archive_file, user_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)";
    const archive_result = await databaseQuery(queryArchive, [
      archive_code,
      archive_timestamp,
      archive_catalog_id,
      archive_title,
      archive_serial_number,
      archive_release_date,
      archive_file_number,
      archive_condition_id,
      archive_type_id,
      archive_class_id,
      archive_agency,
      archive_file,
      user_id,
    ]);

    if (archive_result.affectedRows === 1) {
      const archive_id = archive_result.insertId;

      const queryArchiveLoc =
        "INSERT INTO archive_loc(archive_loc_building_id, archive_loc_room_id, archive_loc_rollopack_id, archive_loc_cabinet, archive_loc_rack, archive_loc_box, archive_id) VALUES (?,?,?,?,?,?,?)";
      const archive_loc_result = await databaseQuery(queryArchiveLoc, [
        archive_loc_building_id,
        archive_loc_room_id,
        archive_loc_rollopack_id,
        archive_loc_cabinet,
        archive_loc_rack,
        archive_loc_box,
        archive_id,
      ]);

      if (archive_loc_result.affectedRows === 1) {
        const queryLog =
          "INSERT INTO log(action, timestamp, archive_id, user_id) VALUES ('Add Archive',?,?,?)";
        const resultLog = await databaseQuery(queryLog, [
          archive_timestamp,
          archive_id,
          user_id,
        ]);

        console.log("Input Data Berhasil");
        return "Data Berhasil Di Masukkan";
      } else {
        throw new Error("Terjadi Kesalahan Penginputan Data Lokasi");
      }
    } else {
      throw new Error("Terjadi Kesalahan Penginputan Data");
    }
  } catch (error) {
    throw error;
  }
};

const archiveDetail = async (archive_id) => {
  try {
    const query =
      "select archive.*, archive_loc.*, archive_catalog.archive_catalog_label, archive_condition.archive_condition_label, archive_type.archive_type_label, archive_class.archive_class_label, loc_building.loc_building_label, loc_room.loc_room_label, loc_rollopack.loc_rollopack_label, loc_cabinet.loc_cabinet_label from archive inner join archive_loc on archive.archive_id = archive_loc.archive_id inner join archive_catalog on archive.archive_catalog_id = archive_catalog.archive_catalog_id inner join archive_condition on archive.archive_condition_id = archive_condition.archive_condition_id inner join archive_type on archive.archive_type_id = archive_type.archive_type_id inner join archive_class on archive.archive_class_id = archive_class.archive_class_id inner join loc_building on archive_loc.archive_loc_building_id = loc_building.loc_building_id inner join loc_room on archive_loc.archive_loc_room_id = loc_room.loc_room_id inner join loc_rollopack on archive_loc.archive_loc_rollopack_id = loc_rollopack.loc_rollopack_id inner join loc_cabinet on archive_loc.archive_loc_cabinet = loc_cabinet.loc_cabinet_id where archive.archive_id = ?";
    const result = await databaseQuery(query, [archive_id]);

    if (!result.length) {
      throw new Error("Pemanggilan Arsip Gagal");
    } else {
      const data = result;

      return data;
    }
  } catch (error) {
    return error;
  }
};

const update_archive = async (user_id, updateData) => {
  try {
    let updateQuery = "UPDATE archive SET ";
    const updateValues = [];

    const addFieldToUpdate = (fieldName, value) => {
      updateQuery += `${fieldName} = ?, `;
      updateValues.push(value);
      console.log(`${fieldName} updated`);
    };

    if (updateData.archive_code !== undefined) {
      addFieldToUpdate("archive_code", updateData.archive_code);
    }

    if (updateData.archive_catalog_id !== undefined) {
      addFieldToUpdate("archive_catalog_id", updateData.archive_catalog_id);
    }

    if (updateData.archive_serial_number !== undefined) {
      addFieldToUpdate(
        "archive_serial_number",
        updateData.archive_serial_number
      );
    }

    if (updateData.archive_file_number !== undefined) {
      addFieldToUpdate("archive_file_number", updateData.archive_file_number);
    }

    if (updateData.archive_title !== undefined) {
      addFieldToUpdate("archive_title", updateData.archive_title);
    }

    if (updateData.archive_release_date !== undefined) {
      addFieldToUpdate("archive_release_date", updateData.archive_release_date);
    }

    if (updateData.archive_condition_id !== undefined) {
      addFieldToUpdate("archive_condition_id", updateData.archive_condition_id);
    }

    if (updateData.archive_type_id !== undefined) {
      addFieldToUpdate("archive_type_id", updateData.archive_type_id);
    }

    if (updateData.archive_class_id !== undefined) {
      addFieldToUpdate("archive_class_id", updateData.archive_class_id);
    }

    if (updateData.archive_agency !== undefined) {
      addFieldToUpdate("archive_agency", updateData.archive_agency);
    }

    if (updateData.archive_file !== undefined) {
      addFieldToUpdate("archive_file", updateData.archive_file);
    }

    if (updateQuery.endsWith(", ")) {
      updateQuery = updateQuery.slice(0, -2); // Remove the trailing comma and space
    }

    updateQuery += " WHERE archive_id = ?";
    updateValues.push(updateData.archive_id);

    let updateArchiveLocQuery = "UPDATE archive_loc SET ";
    const updateArchiveLocValues = [];

    const addFieldLocToUpdate = (fieldName, value) => {
      updateArchiveLocQuery += `${fieldName} = ?, `;
      updateArchiveLocValues.push(value);
      console.log(`${fieldName} updated`);
    };

    if (updateData.archive_loc_building_id !== undefined) {
      addFieldLocToUpdate(
        "archive_loc_building_id",
        updateData.archive_loc_building_id
      );
    }

    if (updateData.archive_loc_room_id != undefined) {
      addFieldLocToUpdate(
        "archive_loc_room_id",
        updateData.archive_loc_room_id
      );
    }

    if (updateData.archive_loc_rollopack_id != undefined) {
      addFieldLocToUpdate(
        "archive_loc_rollopack_id",
        updateData.archive_loc_rollopack_id
      );
    }

    if (updateData.archive_loc_cabinet != undefined) {
      addFieldLocToUpdate(
        "archive_loc_cabinet",
        updateData.archive_loc_cabinet
      );
    }

    if (updateData.archive_loc_rack != undefined) {
      addFieldLocToUpdate("archive_loc_rack", updateData.archive_loc_rack);
    }

    if (updateData.archive_loc_box != undefined) {
      addFieldLocToUpdate("archive_loc_box", updateData.archive_loc_box);
    }

    if (updateArchiveLocQuery.endsWith(", ")) {
      updateArchiveLocQuery = updateArchiveLocQuery.slice(0, -2); // Remove the trailing comma and space
    }

    if (updateArchiveLocQuery !== "UPDATE archive_loc SET ") {
      updateArchiveLocQuery += " WHERE archive_id = ?";
      updateArchiveLocValues.push(updateData.archive_id);
    }

    console.log(updateValues);
    console.log(updateQuery);

    console.log(updateArchiveLocValues);
    console.log(updateArchiveLocQuery);

    if (
      updateQuery !== "UPDATE archive SET WHERE archive_id = ?" &&
      updateArchiveLocQuery === "UPDATE archive_loc SET "
    ) {
      console.log("kondisi 1");
      const archiveResult = await databaseQuery(updateQuery, updateValues);
      if (archiveResult.affectedRows === 1) {
        const archive_timestamp = new Date();
        const queryLog =
          "INSERT INTO log(action, timestamp, archive_id, user_id) VALUES ('Update Archive',?,?,?)";
        const resultLog = await databaseQuery(queryLog, [
          archive_timestamp,
          updateData.archive_id,
          user_id,
        ]);
        console.log("Archive data updated successfully");
      } else {
        console.log("Failed to update archive data");
      }
    } else if (
      updateQuery === "UPDATE archive SET  WHERE archive_id = ?" &&
      updateArchiveLocQuery !== "UPDATE archive_loc SET WHERE archive_id = ?"
    ) {
      console.log("kondisi 2");
      const archiveLocResult = await databaseQuery(
        updateArchiveLocQuery,
        updateArchiveLocValues
      );
      if (archiveLocResult.affectedRows === 1) {
        const archive_timestamp = new Date();
        const queryLog =
          "INSERT INTO log(action, timestamp, archive_id, user_id) VALUES ('Update Archive',?,?,?)";
        const resultLog = await databaseQuery(queryLog, [
          archive_timestamp,
          updateData.archive_id,
          user_id,
        ]);
        console.log("Archive_loc data updated successfully");
      } else {
        console.log("Failed to update archive_loc data");
      }
    } else if (
      updateQuery !== "UPDATE archive SET WHERE archive_id = ?" &&
      updateArchiveLocQuery !== "UPDATE archive_loc SET WHERE archive_id = ?"
    ) {
      console.log("kondisi 3");
      const archiveResult = await databaseQuery(updateQuery, updateValues);
      const archiveLocResult = await databaseQuery(
        updateArchiveLocQuery,
        updateArchiveLocValues
      );
      if (
        archiveResult.affectedRows === 1 ||
        archiveLocResult.affectedRows !== 1
      ) {
        const archive_timestamp = new Date();
        const queryLog =
          "INSERT INTO log(action, timestamp, archive_id, user_id) VALUES ('Update Archive',?,?,?)";
        const resultLog = await databaseQuery(queryLog, [
          archive_timestamp,
          updateData.archive_id,
          user_id,
        ]);
        console.log("Archive_loc data updated successfully");
      } else if (
        archiveResult.affectedRows !== 1 ||
        archiveLocResult.affectedRows === 1
      ) {
        const archive_timestamp = new Date();
        const queryLog =
          "INSERT INTO log(action, timestamp, archive_id, user_id) VALUES ('Update Archive',?,?,?)";
        const resultLog = await databaseQuery(queryLog, [
          archive_timestamp,
          updateData.archive_id,
          user_id,
        ]);
        console.log("Archive_loc data updated successfully");
      } else if (
        archiveResult.affectedRows === 1 ||
        archiveLocResult.affectedRows === 1
      ) {
        const archive_timestamp = new Date();
        const queryLog =
          "INSERT INTO log(action, timestamp, archive_id, user_id) VALUES ('Update Archive',?,?,?)";
        const resultLog = await databaseQuery(queryLog, [
          archive_timestamp,
          updateData.archive_id,
          user_id,
        ]);
        console.log("Archive data and archive_loc data updated successfully");
      } else {
        console.log("Failed to update archive_loc data");
      }
    }

    return "Update completed.";
  } catch (error) {
    throw error;
  }
};

const detail_user = async (user_id) => {
  try {
    const query =
      "SELECT * FROM user INNER JOIN level_user ON user.level_user_id = level_user.level_user_id where user_id = ?";
    const result = await databaseQuery(query, [user_id]);
    if (!result.length) {
      throw new Error("Pemanggilan Arsip Gagal");
    } else {
      const data = result;

      return data;
    }
  } catch (error) {
    return error;
  }
};

const create_user = async (
  user_id,
  ip,
  username,
  password,
  satker,
  level_user_id
) => {
  try {
    const queryCheck = "SELECT * FROM user WHERE username  = ? ";
    const resultCheck = await databaseQuery(queryCheck, [username]);
    if (resultCheck.length) {
      console.log("gagal");
      throw new Error("Username yang anda pilih sudah digunakan");
    } else {
      const query =
        "INSERT user(username, password, satker, level_user_id) VALUES (?,?,?,?)";
      const hash = await bcrypt.hash(password, 10);
      const result = await databaseQuery(query, [
        username,
        hash,
        satker,
        level_user_id,
      ]);

      if (result.affectedRows === 1) {
        const archive_timestamp = new Date();
        const queryLog =
          "INSERT INTO log(action, timestamp, ip, user_id) VALUES ('Create User',?,?,?)";
        const resultLog = await databaseQuery(queryLog, [
          archive_timestamp,
          ip,
          user_id,
        ]);
        return "Pembuatan User Baru Berhasil";
      } else {
        throw new Error("Pembuatan User Baru Gagal");
      }
    }
  } catch (error) {
    return error;
  }
};

const read_user = async () => {
  try {
    const query =
      "SELECT * FROM user JOIN level_user on user.level_user_id = level_user.level_user_id";
    const result = await databaseQuery(query);

    if (!result.length) {
      throw new Error("Pemanggilan Arsip Gagal");
    } else {
      const data = result;

      return data;
    }
  } catch (error) {
    return error;
  }
};

const update_user = async (uid, ip, user_id, options) => {
  try {
    const { username, password, satker, level_user_id } = options;

    const queryCheck = "SELECT * FROM user WHERE username = ?";
    const resultCheck = await databaseQuery(queryCheck, [username]);
    if (resultCheck.length) {
      console.log("gagal");
      throw new Error("Username yang anda pilih sudah digunakan");
    } else {
      // Construct the UPDATE query
      let updateQuery = "UPDATE user SET ";
      const updateValues = [];

      if (username) {
        updateQuery += "username = ?, ";
        updateValues.push(username);
      }

      if (password) {
        updateQuery += "password = ?, ";
        updateValues.push(password);
      }

      if (satker) {
        updateQuery += "satker = ?, ";
        updateValues.push(satker);
      }

      if (level_user_id) {
        updateQuery += "level_user_id = ?, ";
        updateValues.push(level_user_id);
      }

      // Remove the trailing comma and add WHERE clause
      updateQuery = updateQuery.slice(0, -2); // Remove the last comma and space
      updateQuery += " WHERE user_id = ? ;";
      updateValues.push(user_id);

      // Execute the query
      const result = await databaseQuery(updateQuery, updateValues);

      if (result.affectedRows === 1) {
        const archive_timestamp = new Date();
        const queryLog =
          "INSERT INTO log(action, timestamp, ip, user_id) VALUES ('Update User',?,?,?)";
        const resultLog = await databaseQuery(queryLog, [
          archive_timestamp,
          ip,
          uid,
        ]);
        return "Data pengguna berhasil diperbarui";
      } else {
        throw new Error("Gagal memperbarui data pengguna");
      }
    }
  } catch (error) {
    return error;
  }
};

const delete_user = async (user_id, ip, username) => {
  try {
    const queryDelete = "DELETE FROM user WHERE username= ?";
    const resultDelete = await databaseQuery(queryDelete, [username]);

    if (resultDelete.affectedRows === 1) {
      const archive_timestamp = new Date();
      const queryLog =
        "INSERT INTO log(action, timestamp, ip, user_id) VALUES ('Delete User',?,?,?)";
      const resultLog = await databaseQuery(queryLog, [
        archive_timestamp,
        ip,
        user_id,
      ]);
      return "User berhasil dihapus";
    } else {
      throw new Error("Gagal Menghapus User");
    }
  } catch (error) {
    return error;
  }
};

const verify = async (verified) => {
  try {
    const query = `SELECT * FROM user WHERE user_id = ?`;
    const result = await databaseQuery(query, [verified]);
    return result[0];
  } catch (error) {
    return error;
  }
};
const getPdfFromDatabase = async (archive_id) => {
  try {
    const query = "SELECT archive_file FROM archive WHERE archive_id = ?";
    const result = await databaseQuery(query, [archive_id]);

    if (!result.length) {
      throw new Error("PDF not found");
    } else {
      // Assuming 'archive_file' is the column name in your table that stores the PDF BLOB data
      const pdfData = result[0].archive_file;

      return pdfData;
    }
  } catch (error) {
    throw error;
  }
};

const masterData = async () => {
  try {
    const query =
      "WITH RankedTables AS (SELECT 'INDEKS KATALOG' AS label, COUNT(*) AS count FROM archive_catalog UNION ALL SELECT 'KONDISI' AS label, COUNT(*) AS count FROM archive_condition UNION ALL SELECT 'JENIS ARSIP' AS label, COUNT(*) AS count FROM archive_type UNION ALL SELECT 'KELAS ARSIP' AS label, COUNT(*) AS count FROM archive_class UNION ALL SELECT 'GEDUNG' AS label, COUNT(*) AS count FROM loc_building UNION ALL SELECT 'RUANGAN' AS label, COUNT(*) AS count FROM loc_room UNION ALL SELECT 'ROLL O PACK' AS label, COUNT(*) AS count FROM loc_rollopack UNION ALL SELECT 'LEMARI' AS label, COUNT(*) AS count FROM loc_cabinet ) SELECT ROW_NUMBER() OVER (ORDER BY label) AS id, label, count FROM RankedTables; ";
    const result = await databaseQuery(query);

    if (!result.length) {
      throw new Error("Pemanggilan Data Gagal");
    } else {
      const data = result;

      return data;
    }
  } catch (error) {
    return error;
  }
};

const catalog = async () => {
  try {
    const query = "SELECT * FROM archive_catalog";
    const result = await databaseQuery(query);

    if (!result.length) {
      throw new Error("Pemanggilan Data Gagal");
    } else {
      const data = result;

      return data;
    }
  } catch (error) {
    return error;
  }
};

const condition = async () => {
  try {
    const query = "SELECT * FROM archive_condition";
    const result = await databaseQuery(query);

    if (!result.length) {
      throw new Error("Pemanggilan Data Gagal");
    } else {
      const data = result;

      return data;
    }
  } catch (error) {
    return error;
  }
};

const type = async () => {
  try {
    const query = "SELECT * FROM archive_type";
    const result = await databaseQuery(query);

    if (!result.length) {
      throw new Error("Pemanggilan Data Gagal");
    } else {
      const data = result;

      return data;
    }
  } catch (error) {
    return error;
  }
};

const classArchive = async () => {
  try {
    const query = "SELECT * FROM archive_class";
    const result = await databaseQuery(query);

    if (!result.length) {
      throw new Error("Pemanggilan class Gagal");
    } else {
      const data = result;
      return data;
    }
  } catch (error) {
    throw error;
  }
};

const building = async () => {
  try {
    const query = "SELECT * FROM loc_building";
    const result = await databaseQuery(query);

    if (!result.length) {
      throw new Error("Pemanggilan building Gagal");
    } else {
      const data = result;
      return data;
    }
  } catch (error) {
    throw error;
  }
};

const room = async () => {
  try {
    const query = "SELECT * FROM loc_room";
    const result = await databaseQuery(query);

    if (!result.length) {
      throw new Error("Pemanggilan Room Gagal");
    } else {
      const data = result;
      return data;
    }
  } catch (error) {
    throw error;
  }
};

const rollopack = async () => {
  try {
    const query = "SELECT * FROM loc_rollopack";
    const result = await databaseQuery(query);

    if (!result.length) {
      throw new Error("Pemanggilan rollopack Gagal");
    } else {
      const data = result;
      return data;
    }
  } catch (error) {
    throw error;
  }
};

const cabinet = async () => {
  try {
    const query = "SELECT * FROM loc_cabinet";
    const result = await databaseQuery(query);

    if (!result.length) {
      throw new Error("Pemanggilan Cabinet Gagal");
    } else {
      const data = result;
      return data;
    }
  } catch (error) {
    throw error;
  }
};

const insertCatalog = async (user_id, ip, label) => {
  try {
    const queryCheck =
      "SELECT * FROM archive_catalog WHERE archive_catalog_label = ?";
    const resultCheck = await databaseQuery(queryCheck, [label]);
    if (resultCheck.length) {
      throw new Error("Data yang anda masukkan sudah ada");
    } else {
      const query = "INSERT archive_catalog(archive_catalog_label) VALUES (?) ";
      const result = await databaseQuery(query, [label]);

      if (result.affectedRows === 1) {
        const archive_timestamp = new Date();
        const queryLog =
          "INSERT INTO log(action, timestamp, ip, user_id) VALUES ('Insert Master-Catalog',?,?,?)";
        const resultLog = await databaseQuery(queryLog, [
          archive_timestamp,
          ip,
          user_id,
        ]);
        return "Tambah data berhasil";
      } else {
        throw new Error("Tambah data Gagal");
      }
    }
  } catch (error) {
    return error;
  }
};

const insertCondition = async (user_id, ip, label) => {
  try {
    const queryCheck =
      "SELECT * FROM archive_condition WHERE archive_condition_label = ? ";
    const resultCheck = await databaseQuery(queryCheck, [label]);
    if (resultCheck.length) {
      throw new Error("Data yang anda masukkan sudah ada");
    } else {
      const query =
        "INSERT archive_condition(archive_condition_label) VALUES (?) ";
      const result = await databaseQuery(query, [label]);

      if (result.affectedRows === 1) {
        const archive_timestamp = new Date();
        const queryLog =
          "INSERT INTO log(action, timestamp, ip, user_id) VALUES ('Insert Master-Condition',?,?,?)";
        const resultLog = await databaseQuery(queryLog, [
          archive_timestamp,
          ip,
          user_id,
        ]);
        return "Tambah data berhasil";
      } else {
        throw new Error("Tambah data Gagal");
      }
    }
  } catch (error) {
    return error;
  }
};

const insertType = async (user_id, ip, label) => {
  try {
    const queryCheck =
      "SELECT * FROM archive_type WHERE archive_type_label = ? ";
    const resultCheck = await databaseQuery(queryCheck, [label]);
    if (resultCheck.length) {
      throw new Error("Data yang anda masukkan sudah ada");
    } else {
      const query = "INSERT archive_type(archive_type_label) VALUES (?) ";
      const result = await databaseQuery(query, [label]);

      if (result.affectedRows === 1) {
        const archive_timestamp = new Date();
        const queryLog =
          "INSERT INTO log(action, timestamp, ip, user_id) VALUES ('Insert Master-Type',?,?,?)";
        const resultLog = await databaseQuery(queryLog, [
          archive_timestamp,
          ip,
          user_id,
        ]);
        return "Tambah data berhasil";
      } else {
        throw new Error("Tambah data Gagal");
      }
    }
  } catch (error) {
    return error;
  }
};

const insertClassArchive = async (user_id, ip, label) => {
  try {
    const queryCheck =
      "SELECT * FROM archive_class WHERE archive_class_label = ? ";
    const resultCheck = await databaseQuery(queryCheck, [label]);
    if (resultCheck.length) {
      throw new Error("Data yang anda masukkan sudah ada");
    } else {
      const query = "INSERT archive_class(archive_class_label) VALUES (?) ";
      const result = await databaseQuery(query, [label]);

      if (result.affectedRows === 1) {
        const archive_timestamp = new Date();
        const queryLog =
          "INSERT INTO log(action, timestamp, ip, user_id) VALUES ('Insert Master-Class',?,?,?)";
        const resultLog = await databaseQuery(queryLog, [
          archive_timestamp,
          ip,
          user_id,
        ]);
        return "Tambah data berhasil";
      } else {
        throw new Error("Tambah data Gagal");
      }
    }
  } catch (error) {
    return error;
  }
};

const insertBuilding = async (user_id, ip, label) => {
  try {
    const queryCheck =
      "SELECT * FROM loc_building WHERE loc_building_label = ? ";
    const resultCheck = await databaseQuery(queryCheck, [label]);
    if (resultCheck.length) {
      throw new Error("Data yang anda masukkan sudah ada");
    } else {
      const query = "INSERT loc_building(loc_building_label) VALUES (?) ";
      const result = await databaseQuery(query, [label]);

      if (result.affectedRows === 1) {
        const archive_timestamp = new Date();
        const queryLog =
          "INSERT INTO log(action, timestamp, ip, user_id) VALUES ('Insert Master-Building',?,?,?)";
        const resultLog = await databaseQuery(queryLog, [
          archive_timestamp,
          ip,
          user_id,
        ]);
        return "Tambah data berhasil";
      } else {
        throw new Error("Tambah data Gagal");
      }
    }
  } catch (error) {
    return error;
  }
};

const insertRoom = async (user_id, ip, label) => {
  try {
    const queryCheck = "SELECT * FROM loc_room WHERE loc_room_label = ? ";
    const resultCheck = await databaseQuery(queryCheck, [label]);
    if (resultCheck.length) {
      throw new Error("Data yang anda masukkan sudah ada");
    } else {
      const query = "INSERT loc_room(loc_room_label) VALUES (?) ";
      const result = await databaseQuery(query, [label]);

      if (result.affectedRows === 1) {
        const archive_timestamp = new Date();
        const queryLog =
          "INSERT INTO log(action, timestamp, ip, user_id) VALUES ('Insert Master-Room',?,?,?)";
        const resultLog = await databaseQuery(queryLog, [
          archive_timestamp,
          ip,
          user_id,
        ]);
        return "Tambah data berhasil";
      } else {
        throw new Error("Tambah data Gagal");
      }
    }
  } catch (error) {
    return error;
  }
};

const insertRollOPack = async (user_id, ip, label) => {
  try {
    const queryCheck =
      "SELECT * FROM loc_rollopack WHERE loc_rollopack_label = ? ";
    const resultCheck = await databaseQuery(queryCheck, [label]);
    if (resultCheck.length) {
      throw new Error("Data yang anda masukkan sudah ada");
    } else {
      const query = "INSERT loc_rollopack(loc_rollopack_label) VALUES (?) ";
      const result = await databaseQuery(query, [label]);

      if (result.affectedRows === 1) {
        const archive_timestamp = new Date();
        const queryLog =
          "INSERT INTO log(action, timestamp, ip, user_id) VALUES ('Insert Master-RollOPack',?,?,?)";
        const resultLog = await databaseQuery(queryLog, [
          archive_timestamp,
          ip,
          user_id,
        ]);
        return "Tambah data berhasil";
      } else {
        throw new Error("Tambah data Gagal");
      }
    }
  } catch (error) {
    return error;
  }
};

const insertCabinet = async (user_id, ip, label) => {
  try {
    const queryCheck = "SELECT * FROM loc_cabinet WHERE loc_cabinet_label = ? ";
    const resultCheck = await databaseQuery(queryCheck, [label]);
    if (resultCheck.length) {
      throw new Error("Data yang anda masukkan sudah ada");
    } else {
      const query = "INSERT loc_cabinet(loc_cabinet_label) VALUES (?) ";
      const result = await databaseQuery(query, [label]);

      if (result.affectedRows === 1) {
        const archive_timestamp = new Date();
        const queryLog =
          "INSERT INTO log(action, timestamp, ip, user_id) VALUES ('Insert Master-Cabinet',?,?,?)";
        const resultLog = await databaseQuery(queryLog, [
          archive_timestamp,
          ip,
          user_id,
        ]);
        return "Tambah data berhasil";
      } else {
        throw new Error("Tambah data Gagal");
      }
    }
  } catch (error) {
    return error;
  }
};

const deleteCatalog = async (user_id, ip, label) => {
  try {
    const queryDelete =
      "DELETE FROM arhcive_catalog WHERE archive_catalog_id = ?";
    const resultDelete = await databaseQuery(queryDelete, [label]);

    if (resultDelete.affectedRows === 1) {
      const archive_timestamp = new Date();
        const queryLog =
          "INSERT INTO log(action, timestamp, ip, user_id) VALUES ('Delete Master-Catalog',?,?,?)";
        const resultLog = await databaseQuery(queryLog, [
          archive_timestamp,
          ip,
          user_id,
        ]);
      return "Data berhasil dihapus";
    } else {
      throw new Error("Gagal Menghapus Data");
    }
  } catch (error) {
    return error;
  }
};

const deleteCondition = async (user_id, ip, label) => {
  try {
    const queryDelete =
      "DELETE FROM arhcive_condition WHERE archive_condition_id = ?";
    const resultDelete = await databaseQuery(queryDelete, [label]);

    if (resultDelete.affectedRows === 1) {
      const archive_timestamp = new Date();
        const queryLog =
          "INSERT INTO log(action, timestamp, ip, user_id) VALUES ('Delete Master-Condition',?,?,?)";
        const resultLog = await databaseQuery(queryLog, [
          archive_timestamp,
          ip,
          user_id,
        ]);
      return "Data berhasil dihapus";
    } else {
      throw new Error("Gagal Menghapus Data");
    }
  } catch (error) {
    return error;
  }
};

const deleteType = async (user_id, ip, label) => {
  try {
    const queryDelete = "DELETE FROM arhcive_type WHERE archive_type_id = ?";
    const resultDelete = await databaseQuery(queryDelete, [label]);

    if (resultDelete.affectedRows === 1) {
      const archive_timestamp = new Date();
        const queryLog =
          "INSERT INTO log(action, timestamp, ip, user_id) VALUES ('Delete Master-Type',?,?,?)";
        const resultLog = await databaseQuery(queryLog, [
          archive_timestamp,
          ip,
          user_id,
        ]);
      return "Data berhasil dihapus";
    } else {
      throw new Error("Gagal Menghapus Data");
    }
  } catch (error) {
    return error;
  }
};

const deleteClassArchive = async (user_id, ip, label) => {
  try {
    const queryDelete = "DELETE FROM arhcive_class WHERE archive_class_id = ?";
    const resultDelete = await databaseQuery(queryDelete, [label]);

    if (resultDelete.affectedRows === 1) {
      const archive_timestamp = new Date();
        const queryLog =
          "INSERT INTO log(action, timestamp, ip, user_id) VALUES ('Delete Master-Class',?,?,?)";
        const resultLog = await databaseQuery(queryLog, [
          archive_timestamp,
          ip,
          user_id,
        ]);
      return "Data berhasil dihapus";
    } else {
      throw new Error("Gagal Menghapus Data");
    }
  } catch (error) {
    return error;
  }
};

const deleteBuilding = async (user_id, ip, label) => {
  try {
    const queryDelete = "DELETE FROM loc_building WHERE loc_building_id = ?";
    const resultDelete = await databaseQuery(queryDelete, [label]);
    if (resultDelete.affectedRows === 1) {
      const archive_timestamp = new Date();
        const queryLog =
          "INSERT INTO log(action, timestamp, ip, user_id) VALUES ('Delete Master-Building',?,?,?)";
        const resultLog = await databaseQuery(queryLog, [
          archive_timestamp,
          ip,
          user_id,
        ]);
      return "Data berhasil dihapus";
    } else {
      throw new Error("Gagal Menghapus Data");
    }
  } catch (error) {
    return error;
  }
};

const deleteRoom = async (user_id, ip, label) => {
  try {
    const queryDelete = "DELETE FROM loc_room WHERE loc_room_id = ?";
    const resultDelete = await databaseQuery(queryDelete, [label]);

    if (resultDelete.affectedRows === 1) {
      const archive_timestamp = new Date();
      const queryLog =
        "INSERT INTO log(action, timestamp, ip, user_id) VALUES ('Delete Master-Room',?,?,?)";
      const resultLog = await databaseQuery(queryLog, [
        archive_timestamp,
        ip,
        user_id,
      ]);
      return "Data berhasil dihapus";
    } else {
      throw new Error("Gagal Menghapus Data");
    }
  } catch (error) {
    return error;
  }
};

const deleteRollOPack = async (user_id, ip, label) => {
  try {
    const queryDelete = "DELETE FROM loc_rollopack WHERE loc_rollopack_id = ?";
    const resultDelete = await databaseQuery(queryDelete, [label]);

    if (resultDelete.affectedRows === 1) {
      const archive_timestamp = new Date();
        const queryLog =
          "INSERT INTO log(action, timestamp, ip, user_id) VALUES ('Delete Master-RollOPack',?,?,?)";
        const resultLog = await databaseQuery(queryLog, [
          archive_timestamp,
          ip,
          user_id,
        ]);
      return "Data berhasil dihapus";
    } else {
      throw new Error("Gagal Menghapus Data");
    }
  } catch (error) {
    return error;
  }
};

const deleteCabinet = async (user_id, ip, label) => {
  try {
    const queryDelete = "DELETE FROM loc_cabinet WHERE loc_cabinet_id = ?";
    const resultDelete = await databaseQuery(queryDelete, [label]);

    if (resultDelete.affectedRows === 1) {
      const archive_timestamp = new Date();
      const queryLog =
        "INSERT INTO log(action, timestamp, ip, user_id) VALUES ('Delete Master-Cabinet',?,?,?)";
      const resultLog = await databaseQuery(queryLog, [
        archive_timestamp,
        ip,
        user_id,
      ]);
      return "Data berhasil dihapus";
    } else {
      throw new Error("Gagal Menghapus Data");
    }
  } catch (error) {
    return error;
  }
};

const updateCatalog = async (user_id, ip, label, id) => {
  try {
    const queryCheck =
      "SELECT * FROM archive_catalog WHERE archive_catalog_label = ? ";
    const resultCheck = await databaseQuery(queryCheck, [label]);
    if (resultCheck.length) {
      throw new Error("Data yang anda masukkan sudah ada");
    } else {
      const query =
        "UPDATE archive_catalog SET archive_catalog_label = ? WHERE archive_catalog_id = ?";
      const result = await databaseQuery(query, [label, id]);

      if (result.affectedRows === 1) {
        const archive_timestamp = new Date();
        const queryLog =
          "INSERT INTO log(action, timestamp, ip, user_id) VALUES ('Update Master-Catalog',?,?,?)";
        const resultLog = await databaseQuery(queryLog, [
          archive_timestamp,
          ip,
          user_id,
        ]);
        return "Berhasil memperbarui data";
      } else {
        throw new Error("Gagal memperbarui data");
      }
    }
  } catch (error) {
    return error;
  }
};

const updateCondition = async (user_id, ip, label, id) => {
  try {
    const queryCheck =
      "SELECT * FROM archive_condition WHERE archive_condition_label = ? ";
    const resultCheck = await databaseQuery(queryCheck, [label]);
    if (resultCheck.length) {
      throw new Error("Data yang anda masukkan sudah ada");
    } else {
      const query =
        "UPDATE archive_condition SET archive_condition_label = ? WHERE archive_condition_id = ?";
      const result = await databaseQuery(query, [label, id]);

      if (result.affectedRows === 1) {
        const archive_timestamp = new Date();
        const queryLog =
          "INSERT INTO log(action, timestamp, ip, user_id) VALUES ('Update Master-Condition',?,?,?)";
        const resultLog = await databaseQuery(queryLog, [
          archive_timestamp,
          ip,
          user_id,
        ]);
        return "Berhasil memperbarui data";
      } else {
        throw new Error("Gagal memperbarui data");
      }
    }
  } catch (error) {
    return error;
  }
};

const updateType = async (user_id, ip, label, id) => {
  try {
    const queryCheck =
      "SELECT * FROM archive_type WHERE archive_type_label = ? ";
    const resultCheck = await databaseQuery(queryCheck, [label]);
    if (resultCheck.length) {
      throw new Error("Data yang anda masukkan sudah ada");
    } else {
      const query =
        "UPDATE archive_type SET archive_type_label = ? WHERE archive_type_id = ?";
      const result = await databaseQuery(query, [label, id]);

      if (result.affectedRows === 1) {
        const archive_timestamp = new Date();
        const queryLog =
          "INSERT INTO log(action, timestamp, ip, user_id) VALUES ('Update Master-Type',?,?,?)";
        const resultLog = await databaseQuery(queryLog, [
          archive_timestamp,
          ip,
          user_id,
        ]);
        return "Berhasil memperbarui data";
      } else {
        throw new Error("Gagal memperbarui data");
      }
    }
  } catch (error) {
    return error;
  }
};

const updateClassArchive = async (user_id, ip, label, id) => {
  try {
    const queryCheck =
      "SELECT * FROM archive_class WHERE archive_class_label = ? ";
    const resultCheck = await databaseQuery(queryCheck, [label]);
    if (resultCheck.length) {
      throw new Error("Data yang anda masukkan sudah ada");
    } else {
      const query =
        "UPDATE archive_class SET archive_class_label = ? WHERE archive_class_id = ?";
      const result = await databaseQuery(query, [label, id]);

      if (result.affectedRows === 1) {
        const archive_timestamp = new Date();
        const queryLog =
          "INSERT INTO log(action, timestamp, ip, user_id) VALUES ('Update Master-Class',?,?,?)";
        const resultLog = await databaseQuery(queryLog, [
          archive_timestamp,
          ip,
          user_id,
        ]);
        return "Berhasil memperbarui data";
      } else {
        throw new Error("Gagal memperbarui data");
      }
    }
  } catch (error) {
    return error;
  }
};

const updateBuilding = async (user_id, ip, label, id) => {
  try {
    const queryCheck =
      "SELECT * FROM loc_building WHERE loc_building_label = ? ";
    const resultCheck = await databaseQuery(queryCheck, [label]);
    if (resultCheck.length) {
      throw new Error("Data yang anda masukkan sudah ada");
    } else {
      const query =
        "UPDATE loc_building SET loc_building_label = ? WHERE loc_building_id = ?";
      const result = await databaseQuery(query, [label, id]);

      if (result.affectedRows === 1) {
        const archive_timestamp = new Date();
        const queryLog =
          "INSERT INTO log(action, timestamp, ip, user_id) VALUES ('Update Master-Building',?,?,?)";
        const resultLog = await databaseQuery(queryLog, [
          archive_timestamp,
          ip,
          user_id,
        ]);
        return "Berhasil memperbarui data";
      } else {
        throw new Error("Gagal memperbarui data");
      }
    }
  } catch (error) {
    return error;
  }
};

const updateRoom = async (user_id, ip, label, id) => {
  try {
    const queryCheck = "SELECT * FROM loc_room WHERE loc_room_label = ? ";
    const resultCheck = await databaseQuery(queryCheck, [label]);
    if (resultCheck.length) {
      throw new Error("Data yang anda masukkan sudah ada");
    } else {
      const query =
        "UPDATE loc_room SET loc_room_label = ? WHERE loc_room_id = ?";
      const result = await databaseQuery(query, [label, id]);

      if (result.affectedRows === 1) {
        const archive_timestamp = new Date();
        const queryLog =
          "INSERT INTO log(action, timestamp, ip, user_id) VALUES ('Update Master-Building',?,?,?)";
        const resultLog = await databaseQuery(queryLog, [
          archive_timestamp,
          ip,
          user_id,
        ]);
        return "Berhasil memperbarui data";
      } else {
        throw new Error("Gagal memperbarui data");
      }
    }
  } catch (error) {
    return error;
  }
};

const updateRollOPack = async (user_id, ip, label, id) => {
  try {
    const queryCheck =
      "SELECT * FROM loc_rollopack WHERE loc_rollopack_label = ? ";
    const resultCheck = await databaseQuery(queryCheck, [label]);
    if (resultCheck.length) {
      throw new Error("Data yang anda masukkan sudah ada");
    } else {
      const query =
        "UPDATE loc_rollopack SET loc_rollopack_label = ? WHERE loc_rollopack_id = ?";
      const result = await databaseQuery(query, [label, id]);

      if (result.affectedRows === 1) {
        const archive_timestamp = new Date();
        const queryLog =
          "INSERT INTO log(action, timestamp, ip, user_id) VALUES ('Update Master-RollOPack',?,?,?)";
        const resultLog = await databaseQuery(queryLog, [
          archive_timestamp,
          ip,
          user_id,
        ]);
        return "Berhasil memperbarui data";
      } else {
        throw new Error("Gagal memperbarui data");
      }
    }
  } catch (error) {
    return error;
  }
};

const updateCabinet = async (user_id, ip, label, id) => {
  try {
    const queryCheck = "SELECT * FROM loc_cabinet WHERE loc_cabinet_label = ? ";
    const resultCheck = await databaseQuery(queryCheck, [label]);
    if (resultCheck.length) {
      throw new Error("Data yang anda masukkan sudah ada");
    } else {
      const query =
        "UPDATE loc_cabinet SET loc_cabinet_label = ? WHERE loc_cabinet_id = ?";
      const result = await databaseQuery(query, [label, id]);

      if (result.affectedRows === 1) {
        const archive_timestamp = new Date();
        const queryLog =
          "INSERT INTO log(action, timestamp, ip, user_id) VALUES ('Update Master-Cabinet',?,?,?)";
        const resultLog = await databaseQuery(queryLog, [
          archive_timestamp,
          ip,
          user_id,
        ]);
        return "Berhasil memperbarui data";
      } else {
        throw new Error("Gagal memperbarui data");
      }
    }
  } catch (error) {
    return error;
  }
};

module.exports = {
  getIP,
  login,
  logout,
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
  verify,
  getPdfFromDatabase,
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

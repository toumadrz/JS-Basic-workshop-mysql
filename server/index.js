const express = require("express");
const bodyparser = require("body-parser");
const mysql = require("mysql2/promise");
const cors = require("cors");

const app = express();

const port = 8000;

app.use(bodyparser.json());
app.use(cors());

let conn = null;

const initMySQL = async () => {
  conn = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "tutorial",
    port: 8889,
  });
};
const validateData = (userData) => {
  let errors = [];
  if (!userData.firstname) {
    errors.push("กรุณาใส่ชื่อจริง");
  }
  if (!userData.lastname) {
    errors.push("กรุณาใส่นามสกุล");
  }
  if (!userData.age) {
    errors.push("กรุณาใส่อายุ");
  }
  if (!userData.gender) {
    errors.push("กรุณาระบุเพศ");
  }
  if (!userData.interests) {
    errors.push("กรุณาใส่ความสนใจ");
  }
  if (!userData.description) {
    errors.push("กรุณาใส่รายละเอียดของคุณ");
  }

  return errors;
};

// app.get("/testdb", (req, res) => {
//   mysql
//     .createConnection({
//       host: "localhost",
//       user: "root",
//       password: "root",
//       database: "tutorial",
//       port: 8889,
//     })
//     .then((conn) => {
//       conn
//         .query("SELECT * FROM user")
//         .then((results) => {
//           res.json(results[0]);
//         })
//         .catch((error) => {
//           console.error("Error fetching users:", error.message);
//           res.status(500).json({ error: "Error fetching users" });
//         });
//     });
// });

//get users ทั้งหมดที่บันทึกเข้าไปออกมา
app.get("/users", async (req, res) => {
  try {
    const results = await conn.query("SELECT * FROM user");
    res.json(results[0]);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ error: "Error fetching users" });
  }
});

//สร้าง users ใหม่บันทึกเข้าไป
app.post("/users", async (req, res) => {
  try {
    let user = req.body;

    const errors = validateData(user);
    if (errors.length>0) {
      throw {
        message:'กรอกข้อมูลไม่ครบ',
        errors:errors
      }
    }
    const results = await conn.query("INSERT INTO user SET ?", user);
    res.json({
      message: "insert success",
      data: results[0],
    });
  } catch (error) {
    const errorMessage = error.message || 'something wrong';
    const errors = error.errors || [];
    console.error("error message:", error.message);
    res.status(500).json({ 
      message: errorMessage ,
      errors:errors
    });
  }
});

//ดึง users รายคนออกมา
app.get("/users/:id", async (req, res) => {
  let id = req.params.id;
  try {
    const results = await conn.query("SELECT * FROM user WHERE id = ?", id);
    if (results[0].length == 0) {
      throw { statusCode: 404, message: "Not found" };
    }
    res.json(results[0][0]);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    let statusCode = error.statusCode || 500;
    res.status(500).json({
      error: "Error fetching users",
      errorMessage: error.message,
    });
  }
});

//แก้ไข users รายคน (ตาม id ที่บันทึกเข้าไป)
app.put("/users/:id",async (req, res) => {
  let id = req.params.id;
  let updateUser = req.body;
  try {
    const results = await conn.query("UPDATE user SET ? WHERE id = ?", [updateUser,id]);
    res.json({
      message: "update success",
      data: results[0],
    });
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ error: "Error fetching users" });
  }

});

//ลบ users รายคน (ตาม id ที่บันทึกเข้าไป)
app.delete("/users/:id",async (req, res) => {
  let id = req.params.id;
  try {
    const results = await conn.query("DELETE FROM user WHERE user.id = ?", id);
    res.json({
      message: "delete success",
      data: results[0],
    });
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ error: "Error fetching users" });
  }
});

app.listen(port, async (req, res) => {
  await initMySQL();
  console.log("server run at port " + port);
});

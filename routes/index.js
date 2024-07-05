var express = require("express");
var router = express.Router();
var Menu = require("./users");
var Record = require("./record.js");
// var subMenu = require("./subMenu");
var upload = require("multer");
var cors = require("cors");
/* GET home page. */

router.get("/", cors(), function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/getMenu", async function (req, res) {
  const MenuImage = await Menu.find();
  res.send(MenuImage);
});

router.get("/getSubMenu", async function (req, res) {
  const MenuItem = await Menu.findOne({ itemName: req.query.itemName });
  res.send(MenuItem.subMenu);
});

router.post("/createMenuItem", async function (req, res, next) {
  try {
    const itemName = req.body.itemName;
    const itemImage = req.body.itemImage;
    const newMenu = new Menu({ itemName, itemImage });

    await newMenu.save();

    res.send("Menu added succesfully");
  } catch (err) {
    res.send(console.log(err));
  }
});

router.post("/createSubMenu", async function (req, res) {
  try {
    const { menuName, menuImage, menuDesc, menuPrice } = req.body.menuData;

    const menuItemName = req.body.ItemName;
    const menuItem = await Menu.findOne({ itemName: menuItemName });
    await menuItem.subMenu.push({ menuName, menuImage, menuDesc, menuPrice });
    await menuItem.save();
    res.send("SubMenu added successfully");
  } catch (err) {
    res.send(err);
  }
});
router.delete("/deleteMenu", async function (req, res) {
  try {
    const delName = req.query.itemName;
    await Menu.deleteOne({ itemName: delName });
  } catch (err) {
    console.log(err);
  }
});
router.post("/updateMenu", async function (req, res) {
  const subMenuName = req.body.oldName;
  const newData = req.body.subMenu;
  const MenuName = req.body.itemName;

  const MenuData = await Menu.findOne({ itemName: MenuName });
  MenuData.subMenu.forEach((data, i) => {
    if (data.menuName === subMenuName) {
      Object.assign(data, newData);
    }
  });

  await Menu.updateOne({ itemName: MenuName }, { $set: MenuData });
});

router.delete("/deleteSubMenu", async function (req, res) {
  const ItemName = req.query.itemName;
  const delSubMenu = req.query.menuName;
  const MenuName = await Menu.updateOne(
    { itemName: ItemName },
    { $pull: { subMenu: { menuName: delSubMenu } } }
  );
});

module.exports = router;

router.post(
  "/createSubMenuItem",
  // upload.single("file"),
  async function (req, res, next) {
    const menuid = req.Id;

    if (!req.file) {
      return res.status(400).send("Image is not uploaded");
    }

    const menu = await Menu.findOne({ _id: menuid });

    const subMenuData = await subMenu.create({
      itemImage: req.file.filename,
      subMenuName: req.menuName,
      menu: menuid,
      price: req.price,
    });

    Menu.subMenu.push(subMenuData._id);
    await Menu.save();
  }
);

// Here Code starts for the record api

router.post("/setRecordFilter", async function (req, res) {
  try {
    const filterType = req.body.filter;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;

    let filter = {};
    const today = new Date();
    const lastDay = new Date(today);
    lastDay.setDate(today.getDate() - 1);

    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);

    const lastMonth = new Date(today);
    lastMonth.setMonth(today.getMonth() - 1);

    if (filterType === "lastDay") {
      filter = { createdDate: { $gte: lastDay } };
    } else if (filterType === "lastWeek") {
      filter = { createdDate: { $gte: lastWeek } };
    } else if (filterType === "lastMonth") {
      filter = { createdDate: { $gte: lastMonth } };
    } else if (filterType === "customize" && startDate && endDate) {
      filter = {
        createdDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
      };
    }
    try {
      const records = await Record.find(filter);
      res.json(records);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

router.post("/setRecordItem", async function (req, res, next) {
  try {
    const formData = req.body.Form;
    const itemData = req.body.item;
    const Date = req.body.Date;
    const newRecord = new Record({
      itemName: itemData,
      customer: formData,
      createdDate: Date,
    });
    await newRecord.save();
    res.status(200).send("All records saved successfully");
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

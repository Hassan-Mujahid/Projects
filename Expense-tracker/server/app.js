const { sequelize, expense } = require("./models");
const express = require("express");
const cors = require("cors");

const connect = async () => {
  await sequelize.authenticate();
};

connect();

const app = express();
app.use(cors());

app.use(express.json());

app.post("/expenses", async (req, res) => {
  const { text, amount } = await req.body;
  console.log("req.body", req.body);
  try {
    const Expense = await expense.create({ text, amount });
    return res.json(Expense);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

app.get("/expenses", async (req, res) => {
  try {
    const Expense = await expense.findAll();

    return res.json(Expense);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

app.delete("/expenses", async (req, res) => {
  const { uuid } = await req.body;

  try {
    const IncExp = await expense.findOne({ where: { uuid } });
    console.log(IncExp);

    await IncExp.destroy();

    return res.json("Deleted successfully");
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

app.listen(8080, () => {
  console.log("Expense is listening on 8080");
});

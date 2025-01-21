const express = require("express");
const cors = require('cors');
const fs = require("fs");
const users = require("./data.json");
const app = express();
const port = 8000;

app.use(cors());
app.use(express.urlencoded({ extended: false }));

//Http Methods
app.get("/", (req, res) => {
  return res.send(`Visit <a href="http://localhost:8000/users">http://localhost:8000/users<a/>`);
});

app.get("/users", (req, res) => {
  return res.json(users);
});

app.route("/users/:id").get((req, res) => {
  const id = Number(req.params.id);
  const user = users.find((user) => user.id === id);
  if(!user) return res.status(404).json( {message: "user not found", id: id} );
  else return res.send(user);
}).post((req, res) => {
  const id = Number(req.params.id);
  if (!users.find((user) => user.id === id)) return res.status(404).json( {message: "user not found", id: id} )
  const user = users.indexOf(id);
  users.splice(user, 1);
  fs.writeFile("./data.json", JSON.stringify(users), (err, data) => {
    return res.json({ status: "Success", id: id });
  });
})

app.post("/users", (req, res) => {
  const body = req.body;
  if (!body || !body.name || !body.email || !body.gender)
    return res.status(400).json({ message: "Fields are empty" });
  users.push({ id: users.length + 1, ...body });
  fs.writeFile("./data.json", JSON.stringify(users), (err, data) => {
    return res.json({ status: "Success", id: users.length });
  });
});

app.listen(port, () => {
  console.log(`Running on \u001b\\http://localhost:8000/\u001b\\`);
});

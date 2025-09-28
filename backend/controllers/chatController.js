import db from "../config/db.js";


export const getMessages = (req, res) => {
    const sql = `
      SELECT 
        messages.id,
        users.name AS user,
        messages.content,
        messages.timestamp,
        messages.sent,
        messages.anonymous,
        users.avatar,
        users.online
      FROM messages
      LEFT JOIN users ON messages.user_id = users.id
      ORDER BY messages.id ASC
    `;
    db.query(sql, (err, results) => {
        if (err) console.log('not comes', err)
      if (err) return res.status(500).json({ error: err });
     // console.log('message fetched', JSON.stringify(results))
      res.json(results);
    });
  };
  

  export const sendMessage = (req, res) => {
    const { user_id, content, sent, anonymous, timestamp} = req.body;
    const sql = `
      INSERT INTO messages (user_id, content, sent, anonymous, timestamp) 
      VALUES (?, ?, ?, ?, ?)
    `;
    db.query(sql, [user_id, content, sent, anonymous, timestamp], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: err });
      }
      res.json({ id: result.insertId, message: "Message stored" });
    });
  };
  


export const createUser = (req, res) => {
  const { username } = req.body;
  const sql = "INSERT INTO users (username) VALUES (?)";
  db.query(sql, [username], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "User created!", id: result.insertId });
  });
};

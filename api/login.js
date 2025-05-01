export default function handler(req, res) {
  if (req.method === 'POST') {
    const { user, pass } = req.body;
    if (user === "admin" && pass === "admin123") {
      res.status(200).json({ success: true });
    } else {
      res.status(401).json({ success: false });
    }
  } else {
    res.status(405).end();
  }
}

// === api/posts.js ===
import fs from 'fs';
const file = 'posts.json';

export default function handler(req, res) {
  if (req.method === 'GET') {
    const data = fs.readFileSync(file);
    res.status(200).json(JSON.parse(data));
  } else if (req.method === 'POST') {
    const newPost = req.body;
    const data = JSON.parse(fs.readFileSync(file));
    data.push(newPost);
    fs.writeFileSync(file, JSON.stringify(data));
    res.status(201).json({ success: true });
  } else {
    res.status(405).end();
  }
}

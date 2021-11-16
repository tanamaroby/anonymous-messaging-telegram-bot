import express from 'express';
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({message: "Welcome to official server for Wakabubot. This server is created by Roby Tanama"});
});

export default router;

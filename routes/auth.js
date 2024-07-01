import express from 'express';
import passport from 'passport';

const router = express.Router();

// router.post('/auth/facebook/token',
//   passport.authenticate('facebook-token'),
//   (req, res) => {
//     // Handle successful authentication
//     res.json(req.user);
//   }
// );

// router.get('/facebook', passport.authenticate('facebook'));
router.get('/auth/facebook', passport.authenticate('facebook', {scope:'email'}));

router.get('/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/profile',
  failureRedirect: '/failed'
}));

router.get('/profile', (req, res) => {
  res.send("you are a valid user");
})

router.get('/failed', (req, res) => {
  res.send("you are not a valid user");
})

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

export default router;

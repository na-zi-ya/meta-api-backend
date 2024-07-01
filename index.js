import express from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as FacebookStrategy } from "passport-facebook";
import mongoose from "mongoose";
import dotenv from 'dotenv';

import auth from "./routes/auth.js";
import api from "./routes/api.js";
import config from "./config/config.js";
import User from "./model/User.js";


dotenv.config(); 
// Database Connection
mongoose
  .connect(process.env.MONGOO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const app = express();
const port = 8080;

//middleware

app.use(express.json());

app.use(session({ 
  secret: process.env.SESSION_SECRET || "randomstring", resave: false, saveUninitialized: true }));
  app.use(passport.initialize());
app.use(passport.session());



passport.serializeUser((user, mojo) => {
  mojo(null, user);
});

passport.deserializeUser((id, done) => {
  // mojo(null, obj);
  // User.findById(id, (err, user) => {
  //   done(err, user)
  // })
  return done(null, id)
});

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENTSECRET,
      callbackURL: process.env.CALLBACKURL,
      profileFields: ["id", "displayName", "photos", "email"],
    },
  

    (accessToken, refreshToken, profile, done) => {
      console.log(profile, "profile");
      User.findOne({ facebookId: profile.id })
        .then(user => {
          if (user) {
            done(null, user);
          } else {
            new User({
              facebookId: profile.id,
              name: profile.displayName,
              photo: profile.photos[0].value,
              accessToken
            }).save()
              .then(newUser => done(null, newUser))
              .catch(err => console.log(err));
          }
        });
    }));




app.use('/auth', auth);
app.use('/api', api);


app.listen(port, () => {
  console.log(`Server Running at Port: ${port}`);
});

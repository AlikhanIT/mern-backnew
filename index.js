import express from 'express';
import mongoose from "mongoose";
import cors from 'cors';
import {authorizationValidation, postCreateValidation, registorValidation} from "./validations.js";
import checkAuth from "./utils/checkAuth.js";
import {getMe, login, register} from "./controllers/UserController.js";
import {create, edit, getAll, getLastTags, getOne, remove} from "./controllers/PostController.js";
import multer from 'multer';
import handleValidationErrors from "./utils/handleValidationErrors.js";

const pwForDb = 'MadMan3002';
const loginForDb = 'admin';

mongoose.connect(`mongodb+srv://${loginForDb}:${pwForDb}@cluster0.nh06rrw.mongodb.net/blog?retryWrites=true&w=majority`)
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('DB error ', err));

const app = express();

app.use(express.json());

app.use(cors());

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname.split(' ').join(''));
    },
});

const upload = multer({storage});

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.status(201).json({
       url: `/uploads/${req.file.originalname.split(' ').join('')}`,
    });
})

app.use('/uploads', express.static('uploads'));

app.post('/auth/login', authorizationValidation, handleValidationErrors, login);

app.post('/auth/register', registorValidation, handleValidationErrors, register);

app.get('/tags', getLastTags);

app.get('/posts', getAll);

app.get('/posts/:id', getOne);

app.get('/auth/me', checkAuth, getMe);

app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, create);

app.delete('/posts/:id', checkAuth, remove);

app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, edit);

app.listen(process.env.PORT || 4444, (err) => {
    if(err){
        return console.log(err);
    }
    console.log('Server OK')
})
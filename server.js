const http = require('http');
const path = require('path');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer')

const {Pool} = require('./lib/DB.js');
const { response } = require('express');

const app = express();
const server = http.createServer(app); 

app.set('port', 50000);
app.set('views', path.join(__dirname, 'views')); 
app.set('view engine', 'ejs');

let publicPath = path.join(__dirname, 'public')
let staticware = express.static(publicPath)
app.use(staticware)

const storage = multer.diskStorage({
    destination: function (req, file, cb) {``
        cb(null, 'public/img/uploads/')
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext);
    }
})

const upload = multer({ storage: storage })

const session = require('express-session');
const MemoryStore = require('memorystore')(session);

const maxAge = 1000 * 60 * 30;

const sessionObj = {
    secret: 'kong',
    resave: false,
    saveUninitialized: true,
    store: new MemoryStore({ checkPeriod: maxAge }),
    cookie: {
        maxAge,
    },
};

app.use(session(sessionObj));
app.use(bodyParser.urlencoded({extended: false}))


app.get('/', (request, response) => {
    response.render('main')
})

app.get('/admin', async(request, response) => {
    const admin = request.session.user

    if(admin !== undefined) {
        const sql = `SELECT * FROM contentlist`
        let data = await Pool.query(sql)

        response.render("admin", {data: data[0]})
    } else {
        response.send(`
        <script>
          alert('관리자 권한이 필요합니다.')
          location.href = '/adminLogin'
        </script>`)
    }
})

app.post('/admin/del', async(request, response) => {
    const {id} = request.body
    const sql1 = `SELECT filename FROM contentlist WHERE id = ?`
    const data = await Pool.query(sql1, [id])
    const sql2 = `DELETE FROM contentlist WHERE id = ?`
    await Pool.query(sql2, [id])
    file = data[0][0].filename.split(',')
    file.forEach(file_name => {
        if (fs.existsSync("public/img/uploads/" + file_name)) {
            try {
              fs.unlinkSync("public/img/uploads/" + file_name);
            } catch (error) {
              console.log(error);
            }
        } else {
            console.log(fs.existsSync("public/img/uploads/" + file_name))
        }
    })

    response.send({res: 'success'})
})

app.post('/admin/accept', async(request, response) => {
    const {id} = request.body
    const sql = 'UPDATE contentlist SET status = ? WHERE id = ?'
    await Pool.query(sql, ['o', id])

    response.send({res: 'success'})
})

app.post('/getAll', async(request, response) => {
    const sql = `SELECT * FROM contentlist`
    data = await Pool.query(sql)
    response.send({data: data[0]})
})

app.get('/adminLogin', (request, response) => {
    const admin = request.session.user

    if(admin !== undefined) {
        response.send(`
        <script>
          location.href = '/admin'
        </script>`)
    } else {
        response.render("adminLogin")
    }
})

app.post('/adlogin', (request, response) => {
    const chid = 'admin'
    const chpass = '1234'

    const {id, pass} = request.body

    if(chid == id && chpass == pass) {
        request.session.user = true
        response.send(`
        <script>
          location.href = '/admin'
        </script>`)
    } else {
        response.send(`
        <script>
          alert('관리자 정보가 일치하지 않습니다.')
          location.href = '/adminLogin'
        </script>`)
    }
})

app.get('/ndividualworks', async(request, response) => {
    const {id} = request.query
    const sql = `SELECT * FROM contentlist WHERE id = ?`
    data = await Pool.query(sql, [id])
    response.render("ndividualworks", {data: data[0][0]})
})

app.get('/uploadworks', (request, response) => {
    response.render("uploadworks")
})

app.post('/upload', upload.array('file'), (request, response) => {
    const {title, content, date, tag, scname, emailhead, emailtail, git} = request.body
    const email = emailhead + "@" + emailtail
    let filename = []
    
    request.files.forEach(item => {
        filename.push(item.filename)
    })

    filename = filename.join(',')

    const sql = `INSERT INTO contentlist(title, content, filename, enddate, endyear, tag, namescnum, email, git) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`

    Pool.query(sql, [title, content, filename, date, date.split('-')[0], tag, scname, email, git])

    response.send(`
        <script>
            alert('성공적으로 등록되었습니다.')
            location.href = '/'
        </script>`)
})

app.get('/yearworks', async(request, response) => {
    const {year} = request.query
    const sql = 'SELECT * FROM contentlist WHERE endyear = ? AND status = ?'
    const data = await Pool.query(sql, [year, 'o'])
    response.render("yearworks", {data: data[0]})
})

server.listen(50000, () => {
  console.log("Express engine 가동중");
});
//khởi tạo server
const express = require('express'); //require express
// từ express 4.16, ko cần require body-parser
// var bodyParser = require('body-parser'); //require body-parser
const app = express();
const port = 3000;
const  mysql = require('mysql');// kết nết với my sql
const multer = require('multer');//upload file
const { name } = require('ejs');
app.use(express.static('public'));
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/upload')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  })
  
  const upload = multer({ storage: storage })
 
// tạo kết nối với csdl
 const db = mysql.createConnection({
    host:'localhost',
    user: 'root',
    password : '',
    database: 'abc'

 })
//
//khai báo sử dụng ejs
app.set('view engine', 'ejs'); //khai báo view engine là ejs
app.set('views', './views'); //khai báo thư mục chứ file giao diện
// app.use(bodyParser.urlencoded()); //từ express 4.16 trở xuống
app.use(express.urlencoded({ extended: true })); //từ express 4.16 trở lên
//router

app.get('/list', (req,res) => {

        let sql = ' SELECT * FROM products';// khai báo truy vấn
        db.query(sql,function(err,data){// thực thi câu truy vẫn , lấy data
            if (err) throw err // xử lí lỗi ( nếu có)
            res.render('list',{ products: data})// truyền sang hiện thị
                
            
        })
    })
app.post('/save',upload.single('img'),(req,res)=>{
    console.log(req.body, res.file);
    var newProduct ={
    name : req.body.name,
    price : req.body.price,
    description : req.body.description,
    img : req.file.filename
    }
    db.query('INSERT INTO products SET?',newProduct,(err,data)=>{
        if (err) throw err
        console.log('Create successfully');
        res.redirect('/list');
    })
})

app.get('/create', (req,res) => {
    res.render('create');





(req.query); //được đánh dấu bằng ?ten1=x&ten2=y trên url
    console.log(req.params); //nằm trong url /:id
    //params không được trùng tên nhau
    //nếu đặt trùng thì sẽ lấy giá trị của thằng sau cùng
    // res.send('<h1>Đây là trang chủ</h1>'); 
    res.render('detail', {
        id: req.params.id,
        iddanhmuc: req.params.iddanhmuc,
    });
});

app.listen(port, () => {
    console.log(`SV đang chạy ở port ${port}`);
})



app.get('/edit/:id',(req,res)=>{   
    var id =req.params.id;
    db.query(`SELECT * FROM products WHERE id=${id}`,(err,data) => {
            if (err) throw err
            res.render('edit',{product: data[0]});
    })
})

app.post('/update/:id', upload.single('img'), (req,res) => {
    var id = req.params.id;
    var name = req.body.name;
    var price = req.body.price;
    var description = req.body.description;
    var img = req.file.filename;

    db.query(
        'UPDATE products SET name=?,price=?,description=?,img=? WHERE id=?',
        [name,price,description,img,id],
        (err,data) => {
            if (err) throw err 
            console.log('Update success');
            res.redirect('/list');
        })

})
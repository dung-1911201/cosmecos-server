const env = require('dotenv');
env.config();
const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());

const mongoose = require('mongoose');

const productRouter = require('./src/routers/productRouter');
const userRouter = require('./src/routers/userRouter');
const authRouter = require('./src/routers/authRouter');
const commentRouter = require('./src/routers/commentRouter');
const orderRouter = require('./src/routers/orderRouter');

mongoose
	.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log('db is connected !'))
	.catch((err) => console.log(err));

app.use(express.json());
//PORT

// Tuyến đường xử lý yêu cầu đến địa chỉ gốc "/"
app.get('/', (req, res) => {
	res.send('Xin chào, đây là trang chủ của ứng dụng!');
});

const PORT = process.env.PORT || 5050;

app.use(productRouter);
app.use(userRouter);
app.use(orderRouter);
app.use(authRouter);
app.use(commentRouter);

app.listen(PORT, () => console.log(`server is runing at http://localhost:${PORT}`));

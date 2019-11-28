const express = require('express');
const connectDB = require('./config/db');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

const app = express();

// Extended: https://swagger.io/specification/#infoObject
const swaggerOptions = {
    info: {
        title: 'TODO API',
        description: "Pointy Haired Boss wants the TODO application",
        contact: {
            name: "Sahithi"
        },
        server: ["http://localhost:3000"]
    },

    apis: [server.js]
},

// Connect Database
connectDB();

app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('API Running'));

//Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/task', require('./routes/api/task'));

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

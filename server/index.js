const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./config/database');
const { User, Appointment, MedicalRecord } = require('./models'); // Import w/ associations
const authRoutes = require('./routes/auth');
const aiRoutes = require('./routes/ai');
const recordRoutes = require('./routes/record');
const appointmentRoutes = require('./routes/appointment');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/user', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/appointments', appointmentRoutes);

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all for dev
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });
});



const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('AI Symptom Checker Backend Running');
});

const connectWithRetry = () => {
    sequelize.sync({ alter: true }).then(() => {
        console.log('Database connected and synced');
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }).catch(err => {
        console.error('Database connection failed. Retrying in 5 seconds...', err.message);
        setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();

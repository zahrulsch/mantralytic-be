import open from 'open';
import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import cLog from './utils/cLog.js';
import apisRouter from './routes/apis/index.js';
import { logEmiter } from './utils/socket.js';
import { createServer } from 'http';
import { initSocket } from './utils/socket.js';
dotenv.config();
const __dirname = path.resolve();
const PORT = process.env.PORT || 8000;
const app = express();
const server = createServer(app);
const io = initSocket(server, { cors: { origin: '*' } });
const publicDir = process.env.NODE_ENV !== 'production' ? 'src/public/' : 'public';
app.use(express.json());
app.use(cors());
app.use(express.static(path.resolve(__dirname, publicDir)));
app.use('/apis', apisRouter);
app.get(/^(?!.*\/apis).*/, (_req, res, _next) => {
    res.sendFile(path.resolve(__dirname, `${publicDir}/index.html`));
});
io.on('connection', socket => {
    logEmiter({ marketplaceType: '', status: 'success', title: 'Socket berhasil terhubung', type: 'connection', url: '' });
    cLog('Receive connection from client "' + socket.id + '"', 'success');
});
function main() {
    server.listen(PORT, () => {
        cLog(`App running in http://localhost:${PORT}`);
        open(`http://localhost:${PORT}`);
    });
}
main();
export default main;

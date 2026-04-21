import makeWASocket, {
    useMultiFileAuthState,
    generateWAMessageFromContent,
    downloadMediaMessage,
    prepareWAMessageMedia,
    fetchLatestBaileysVersion,
    Browsers,
    DisconnectReason,
    generateMessageID
} from "@whiskeysockets/baileys"
import { pino } from 'pino'
import qrcode from 'qrcode-terminal'
import fs from 'fs'
import path from 'path'
import os from 'os'
import crypto from 'crypto'
import archiver from 'archiver'
import { Boom } from '@hapi/boom'

function copyDir(src, dest) {
    fs.mkdirSync(dest, { recursive: true })
    for (const item of fs.readdirSync(src, { withFileTypes: true })) {
        const from = path.join(src, item.name)
        const to = path.join(dest, item.name)
        if (item.isDirectory()) copyDir(from, to)
        else fs.copyFileSync(from, to)
    }
}

function replaceBase64Image(jsonPath, dataUri, effectType = 0) {
    const json = JSON.parse(fs.readFileSync(jsonPath, 'utf8'))
    if (!Array.isArray(json.assets)) throw new Error('JSON sin assets.')

    const asset = json.assets.find(a => typeof a?.p === 'string' && a.p.startsWith('data:image/'))
    if (!asset) throw new Error('No se encontró una imagen base64 en el Lottie.')

    asset.p = dataUri

    const W = 512;
    const H = 512;
    const OP = 90;
    const assetId = asset.id;
    const cx = asset.w / 2 || 256;
    const cy = asset.h / 2 || 256;

    if (effectType >= 1 && effectType <= 5) {
        json.w = W;
        json.h = H;
        json.fr = 30;
        json.op = OP;
        json.layers = []; 

        if (effectType === 1) {
            json.layers.push({
                "ddd": 0, "ind": 1, "ty": 2, "nm": "Vortex", "refId": assetId, "sr": 1,
                "ks": {
                    "o": { "a": 0, "k": 100 },
                    "r": { "a": 1, "k": [ { "t": 0, "s": [0] }, { "t": OP, "s": [1080] } ] },
                    "p": { "a": 0, "k": [W/2, H/2, 0] },
                    "a": { "a": 0, "k": [cx, cy, 0] },
                    "s": { "a": 1, "k": [ { "t": 0, "s": [10, 10, 100] }, { "t": OP, "s": [250, 250, 100] } ] }
                },
                "ip": 0, "op": OP, "st": 0
            });
        } else if (effectType === 2) {
            let ind = 1;
            for(let i=0; i<3; i++) {
                for(let j=0; j<3; j++) {
                    json.layers.push({
                        "ddd": 0, "ind": ind++, "ty": 2, "nm": `Grid_${i}_${j}`, "refId": assetId, "sr": 1,
                        "ks": {
                            "o": { "a": 0, "k": 100 },
                            "r": { "a": 1, "k": [ { "t": 0, "s": [0] }, { "t": OP, "s": [j%2===0 ? 360 : -360] } ] },
                            "p": { "a": 0, "k": [W/6 + (W/3)*i, H/6 + (H/3)*j, 0] },
                            "a": { "a": 0, "k": [cx, cy, 0] },
                            "s": { "a": 0, "k": [35, 35, 100] }
                        },
                        "ip": 0, "op": OP, "st": 0
                    });
                }
            }
        } else if (effectType === 3) {
            for(let i=0; i<15; i++) {
                const x = Math.random() * W;
                const startY = -100 - Math.random() * 200;
                const endY = H + 200;
                json.layers.push({
                    "ddd": 0, "ind": i+1, "ty": 2, "nm": `Drop_${i}`, "refId": assetId, "sr": 1,
                    "ks": {
                        "o": { "a": 0, "k": 100 },
                        "p": { "a": 1, "k": [ { "t": 0, "s": [x, startY, 0] }, { "t": OP, "s": [x, endY, 0] } ] },
                        "a": { "a": 0, "k": [cx, cy, 0] },
                        "s": { "a": 0, "k": [25, 25, 100] }
                    },
                    "ip": 0, "op": OP, "st": 0
                });
            }
        } else if (effectType === 4) {
            json.layers.push({
                "ddd": 0, "ind": 1, "ty": 2, "nm": "Pulse", "refId": assetId, "sr": 1,
                "ks": {
                    "o": { "a": 0, "k": 100 },
                    "p": { "a": 0, "k": [W/2, H/2, 0] },
                    "a": { "a": 0, "k": [cx, cy, 0] },
                    "s": { "a": 1, "k": [ 
                        { "t": 0, "s": [100, 100, 100] }, 
                        { "t": OP*0.25, "s": [150, 150, 100] },
                        { "t": OP*0.5, "s": [100, 100, 100] },
                        { "t": OP*0.75, "s": [150, 150, 100] },
                        { "t": OP, "s": [100, 100, 100] }
                    ] }
                },
                "ip": 0, "op": OP, "st": 0
            });
        } else if (effectType === 5) {
            const shakeKeys = [];
            for(let f=0; f<=OP; f+=2) {
                shakeKeys.push({
                    "t": f,
                    "s": [W/2 + (Math.random()*60 - 30), H/2 + (Math.random()*60 - 30), 0]
                });
            }
            json.layers.push({
                "ddd": 0, "ind": 1, "ty": 2, "nm": "Shake", "refId": assetId, "sr": 1,
                "ks": {
                    "o": { "a": 0, "k": 100 },
                    "p": { "a": 1, "k": shakeKeys },
                    "a": { "a": 0, "k": [cx, cy, 0] },
                    "s": { "a": 0, "k": [120, 120, 100] }
                },
                "ip": 0, "op": OP, "st": 0
            });
        }
    } else if (effectType === 102) {
        // !crash: Stress Test de Hierarquia (Deep Nesting)
        // Cria 100 camadas onde uma é "parent" da outra, testando o limite de recursão do renderizador
        json.layers = [];
        for(let i=0; i<100; i++) {
            json.layers.push({
                "ddd": 0, "ind": i+1, "ty": 4, "nm": `Node_${i}`, "parent": i > 0 ? i : undefined,
                "ks": { "r": { "a": 0, "k": 5 }, "s": { "a": 0, "k": [98, 98, 100] }, "p": { "a": 0, "k": [10, 10, 0] } },
                "shapes": [{ "ty": "rc", "s": { "a": 0, "k": [W, H] }, "p": { "a": 0, "k": [0, 0] } }],
                "ip": 0, "op": OP, "st": 0
            });
        }
    }

    fs.writeFileSync(jsonPath, JSON.stringify(json))
}

function zipFolderToWas(folder, output) {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(output)) fs.unlinkSync(output)
        const out = fs.createWriteStream(output)
        const archive = archiver('zip', { zlib: { level: 9 } })
        out.on('close', () => resolve(output))
        archive.on('error', reject)
        archive.pipe(out)
        archive.directory(folder, false)
        archive.finalize()
    })
}

async function buildLottieSticker(imageBuffer, mimeType, effectType = 0) {
    const baseFolder = path.resolve('./plantilla')
    const output = path.resolve('./output_sticker.was')
    const jsonRelativePath = 'animation/animation_secondary.json'

    if (!fs.existsSync(baseFolder)) throw new Error('baseFolder no encontrado.')
    if (!mimeType) throw new Error('Mime no detectado.')

    const dataUri = `data:${mimeType};base64,${imageBuffer.toString('base64')}`
    const temp = path.join(os.tmpdir(), `lottie-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`)

    try {
        copyDir(baseFolder, temp)
        replaceBase64Image(path.join(temp, jsonRelativePath), dataUri, effectType)
        await zipFolderToWas(temp, output)
        return fs.readFileSync(output)
    } finally {
        fs.rmSync(temp, { recursive: true, force: true })
    }
}

async function startBot() {
    console.log('🔄 Iniciando bot...')
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys')
    const { version } = await fetchLatestBaileysVersion()

    const conn = makeWASocket({
        version,
        auth: state,
        logger: pino({ level: 'silent' }),
        browser: Browsers.macOS('Desktop')
    })

    conn.ev.on('creds.update', saveCreds)

    conn.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update
        if (qr) {
            console.log('✨ Escanea este QR:')
            qrcode.generate(qr, { small: true })
        }
        if (connection === 'open') console.log('✅ BOT CONECTADO. Envía una imagen con !shiinay o !crash.')
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error instanceof Boom)
                ? lastDisconnect.error.output?.statusCode !== DisconnectReason.loggedOut
                : true
            if (shouldReconnect) startBot()
        }
    })

    conn.ev.on('messages.upsert', async ({ messages }) => {
        const m = messages[0]
        if (!m.message) return

        const messageType = Object.keys(m.message)[0]
        
        const caption = m.message.imageMessage?.caption 
            || m.message.extendedTextMessage?.text 
            || m.message.conversation 
            || ""
        const textLower = caption.toLowerCase();
        const cmdMatch = textLower.match(/(?:^|\s)!(1|2|3|4|5|crash|shiinay)(?:$|\s)/);

        if (!cmdMatch) return;

        const cmd = cmdMatch[1];
        let effectType = 0;
        if (cmd >= '1' && cmd <= '5') {
            effectType = parseInt(cmd);
        } else if (cmd === 'crash') {
            effectType = 102;
        }

        const imageMessage = m.message.imageMessage
            || m.message.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage

        if (imageMessage || messageType === 'imageMessage') {
            const img = imageMessage || m.message.imageMessage
            console.log(`📩 Comando !${cmd} detectado!`)

            try {
                const buffer = await downloadMediaMessage(m, 'buffer', {})
                console.log('📥 Imagen descargada')

                const wasBuffer = await buildLottieSticker(buffer, img.mimetype, effectType)
                console.log('📦 Archivo .was generado')

                const upload = await prepareWAMessageMedia(
                    { sticker: wasBuffer, mimetype: 'application/was' },
                    { upload: conn.waUploadToServer }
                )

                const msgContent = {
                    stickerMessage: {
                        url: upload.stickerMessage.url,
                        directPath: upload.stickerMessage.directPath,
                        fileSha256: upload.stickerMessage.fileSha256,
                        fileEncSha256: upload.stickerMessage.fileEncSha256,
                        mediaKey: upload.stickerMessage.mediaKey,
                        fileLength: upload.stickerMessage.fileLength,
                        mimetype: 'application/was',
                        isAnimated: true,
                        isLottie: true,
                        height: cmd === 'shiinay' ? 9999 : 512,
                        width: cmd === 'shiinay' ? 9999 : 512
                    }
                };
                
                const msg = generateWAMessageFromContent(m.key.remoteJid, msgContent, { userJid: conn.user.id })
                await conn.relayMessage(m.key.remoteJid, msg.message, { messageId: msg.key.id })
                
                console.log(`🚀 STICKER ENVIADO COM SUCESSO (!${cmd})`)
            } catch (error) {
                console.error('❌ ERROR:', error)
            }
        }
    })
}

startBot()

import fs from 'fs'

const SEC_PATH = './plantilla/animation/animation_secondary.json'

const CONFIG = {
    cols: 4,
    rows: 3,
    scaleMin: 26,
    scaleMax: 44,
    posJitter: 28,
    mirrorChance: 0.3,
    opacity: 100,
    seed: 42
}

const j = JSON.parse(fs.readFileSync(SEC_PATH, 'utf8'))
const W = j.w
const H = j.h
const OP = j.op
const ASSET_CX = j.assets[0].w / 2
const ASSET_CY = j.assets[0].h / 2
const N = CONFIG.cols * CONFIG.rows

let seed = CONFIG.seed
const rand = () => {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
}

const layers = []
for (let i = 0; i < N; i++) {
    const col = i % CONFIG.cols
    const row = Math.floor(i / CONFIG.cols)
    const cellW = W / CONFIG.cols
    const cellH = H / CONFIG.rows
    const cx = cellW * col + cellW / 2
    const cy = cellH * row + cellH / 2
    const px = cx + (rand() - 0.5) * CONFIG.posJitter * 2
    const py = cy + (rand() - 0.5) * CONFIG.posJitter * 2

    const scalePct = CONFIG.scaleMin + rand() * (CONFIG.scaleMax - CONFIG.scaleMin)
    const startAngle = Math.floor(rand() * 360)
    const direction = rand() > 0.5 ? 1 : -1
    const endAngle = startAngle + direction * 360
    const mirrored = rand() < CONFIG.mirrorChance
    const sx = mirrored ? -scalePct : scalePct

    layers.push({
        ddd: 0,
        ind: i + 1,
        ty: 2,
        nm: `Tile_${i + 1}`,
        refId: j.assets[0].id,
        sr: 1,
        ks: {
            o: { a: 0, k: CONFIG.opacity },
            r: {
                a: 1,
                k: [
                    { t: 0, s: [startAngle], e: [endAngle] },
                    { t: OP }
                ]
            },
            p: { a: 0, k: [px, py, 0] },
            a: { a: 0, k: [ASSET_CX, ASSET_CY, 0] },
            s: { a: 0, k: [sx, scalePct, 100] }
        },
        ao: 0,
        ip: 0,
        op: OP,
        st: 0,
        bm: 0
    })
}

j.layers = layers
fs.writeFileSync(SEC_PATH, JSON.stringify(j))

console.log(`✅ Generadas ${N} capas (${CONFIG.cols}×${CONFIG.rows}) en ${SEC_PATH}`)
console.log(`   Escala: ${CONFIG.scaleMin}%–${CONFIG.scaleMax}%  |  Jitter pos: ±${CONFIG.posJitter}px  |  Mirror: ${Math.round(CONFIG.mirrorChance * 100)}%`)
console.log(`   Tamaño del archivo: ${fs.statSync(SEC_PATH).size} bytes`)

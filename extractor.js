import { downloadContentFromMessage } from '@whiskeysockets/baileys'
import fs from 'fs'
import path from 'path'

// Tu JSON con la info del pack
const packData = [
    {
        "sticker-pack-id": "Chomp",
        "stickers": [
            { "media-key": "i4dgfxaJdvaNijgZrOfarNLHkv2BYAwDR7oI8Zd7y9Q=", "direct-path": "/v/t61.21164-24/546455382_941172005435661_7687447155793471420_n.jpg?_nc_ht=mmg.whatsapp.net&ccb=14-4&oh=01_Q5Aa4QEhANlJIl4kWRP_jdknTFQHVz3BJGfF5ovNw8bcPwk5gQ&oe=6A087CED&_nc_sid=f87763", "url": "https://mmg.whatsapp.net/v/t61.21164-24/546455382_941172005435661_7687447155793471420_n.enc?ccb=11-4&oh=01_Q5Aa4AFCLeedmyEhFtWGAb1MYPjS-7iaYusss3gF4ydtNJ-QpA&oe=69F62298&_nc_sid=5e03e0&mms3=true" },
            { "media-key": "ICPS7zmn78I72hG+EcT5qNnJX2CCpu9Q1/Y+Etjl7zs=", "direct-path": "/v/t61.21164-24/598267169_931929999574758_1508204678744100033_n.jpg?_nc_ht=mmg.whatsapp.net&ccb=14-4&oh=01_Q5Aa4QFOqps0LnFzHh7ycQILe842CWW1BJrYhfrM7DBjTFH9kA&oe=6A088675&_nc_sid=f87763", "url": "https://mmg.whatsapp.net/v/t61.21164-24/598267169_931929999574758_1508204678744100033_n.enc?ccb=11-4&oh=01_Q5Aa4AFpooe_r-HYCyhdrJYOquYue83Dd6e_KIvTafJSxoPQ_w&oe=69F61490&_nc_sid=5e03e0&mms3=true" },
            { "media-key": "+xJ45IWzNOU6Ahr9uMng4e5sCJFS+Y33oVPhAHIZwEU=", "direct-path": "/v/t61.21164-24/627792474_1344984317440175_599040214288034059_n.jpg?_nc_ht=mmg.whatsapp.net&ccb=14-4&oh=01_Q5Aa4QGnI_MgqSoqghnTn_bFbGBj9gWqtPsUGwO-5zWl73BeoQ&oe=6A085FB1&_nc_sid=f87763", "url": "https://mmg.whatsapp.net/v/t61.21164-24/627792474_1344984317440175_599040214288034059_n.enc?ccb=11-4&oh=01_Q5Aa4AGIuXT1WTR1EtSHzC7yrVR1ylgC2B_m3UjdsgW8dQbNzw&oe=69F631CC&_nc_sid=5e03e0&mms3=true" },
            { "media-key": "05wrFZb5RofU+3jdzkqeqDRWErzcpCkcgxjOEJljjVM=", "direct-path": "/v/t61.21164-24/597822272_1442508854294094_5910450725954613732_n.jpg?_nc_ht=mmg.whatsapp.net&ccb=14-4&oh=01_Q5Aa4QEUAZUVrOq10YdKz-eMBEi7Uc9H3GsKwMImHrti2POWmA&oe=6A088652&_nc_sid=f87763", "url": "https://mmg.whatsapp.net/v/t61.21164-24/597822272_1442508854294094_5910450725954613732_n.enc?ccb=11-4&oh=01_Q5Aa4AHBPVXe24clp4JPeFOJdiai20axWDRGwXa1CcISviw--g&oe=69F62F2B&_nc_sid=5e03e0&mms3=true" },
            { "media-key": "wzW4L7gJBCHlNJEl/LMyouj3DHUyLCkPemYo8EUJCeg=", "direct-path": "/v/t61.21164-24/657557237_928787413377317_8486646748146085053_n.jpg?_nc_ht=mmg.whatsapp.net&ccb=14-4&oh=01_Q5Aa4QHAWHh8bdBSif0UXAoaM9n8FpnECo7tQN9y5NX6TIsOMg&oe=6A086138&_nc_sid=f87763", "url": "https://mmg.whatsapp.net/v/t61.21164-24/657557237_928787413377317_8486646748146085053_n.enc?ccb=11-4&oh=01_Q5Aa4AGop06zsowy_TM8KL0zov2mxZMeOBnYRg_UXAz8r_aKvA&oe=69F62B0D&_nc_sid=5e03e0&mms3=true" },
            { "media-key": "Wxd4WM3koYBqyJIN5ZlwOGcLQIIGHS4gFJo3r9VGSxI=", "direct-path": "/v/t61.21164-24/646132486_1589583692145177_3912682166906039506_n.jpg?_nc_ht=mmg.whatsapp.net&ccb=14-4&oh=01_Q5Aa4QG2LQUoJqzoLXFTT2MuOr9k42wCrMwwqWu_7yEppcakYw&oe=6A088683&_nc_sid=f87763", "url": "https://mmg.whatsapp.net/v/t61.21164-24/646132486_1589583692145177_3912682166906039506_n.enc?ccb=11-4&oh=01_Q5Aa4AEB8ICNB_hwwM3moEtnJG5QGcmR1WHl1PeJJfS0VQ3vNA&oe=69F62A3A&_nc_sid=5e03e0&mms3=true" },
            { "media-key": "wKHLWBVWhwWniH9MENcjOeUy2EVF/8wrS/W7EwO89B4=", "direct-path": "/v/t61.21164-24/659081154_953904743670348_456786157353039492_n.jpg?_nc_ht=mmg.whatsapp.net&ccb=14-4&oh=01_Q5Aa4QHjfwlGXchOGb4eRtK-6CXOkfmAy0MyvkXtZg01rU_Mzw&oe=6A088A2F&_nc_sid=f87763", "url": "https://mmg.whatsapp.net/v/t61.21164-24/659081154_953904743670348_456786157353039492_n.enc?ccb=11-4&oh=01_Q5Aa4AHv9lz-8b5QeNNpGSCDJTr9ZovmEGQcqK4ievctu2G6AA&oe=69F60E16&_nc_sid=5e03e0&mms3=true" },
            { "media-key": "TkkR6TTrmEDJ5sJipNLNThLeAijl3S0tNjdJ8q2YNq8=", "direct-path": "/v/t61.21164-24/660602231_2895048100826728_8589496577313780699_n.jpg?_nc_ht=mmg.whatsapp.net&ccb=14-4&oh=01_Q5Aa4QG_ciwHmL05WxofEbaljaa8vNq6hTxNz5S5oZa43sg2Qw&oe=6A08680A&_nc_sid=f87763", "url": "https://mmg.whatsapp.net/v/t61.21164-24/660602231_2895048100826728_8589496577313780699_n.enc?ccb=11-4&oh=01_Q5Aa4AECSM0Hx0HN0nlHkRrmHn04AbV4frIVHndaWNgRwJNPyw&oe=69F632B3&_nc_sid=5e03e0&mms3=true" },
            { "media-key": "5/VhoFqmzm3GJB9VmvvzHtZB7JylrF0WHXMfznCy0Ag=", "direct-path": "/v/t61.21164-24/595515044_1257593249296775_4118979453444936940_n.jpg?_nc_ht=mmg.whatsapp.net&ccb=14-4&oh=01_Q5Aa4QF4ElgB3G-XpTKyQlOwRwpiEEDl27dfYKnErnchtwPVQ&oe=6A085AF4&_nc_sid=f87763", "url": "https://mmg.whatsapp.net/v/t61.21164-24/595515044_1257593249296775_4118979453444936940_n.enc?ccb=11-4&oh=01_Q5Aa4AEmGAy5m71gwCPIwDM7X23BcqUnQyQaJm4p8iU7o4G86A&oe=69F60C89&_nc_sid=5e03e0&mms3=true" },
            { "media-key": "0pE/56jXNtjmvoH5wlWmHCXYKVxt6gwk5yi1mVymcZg=", "direct-path": "/v/t61.21164-24/660342360_963073326231858_3562679450021978553_n.jpg?_nc_ht=mmg.whatsapp.net&ccb=14-4&oh=01_Q5Aa4QFxrwx9ffGT5fnDIIYwrzeQD1NxawyUAWWSzHCApQ4kjA&oe=6A0882F4&_nc_sid=f87763", "url": "https://mmg.whatsapp.net/v/t61.21164-24/660342360_963073326231858_3562679450021978553_n.enc?ccb=11-4&oh=01_Q5Aa4AFbz0gm_XpSx0SUCINkYxUGLnLyK-cKBXx-dyYC04qANQ&oe=69F60109&_nc_sid=5e03e0&mms3=true" },
            { "media-key": "Tx6cWe6fwrqvByTwKQtTOiunbmhgloI6K/idtYCvfVs=", "direct-path": "/v/t61.21164-24/637840996_2159829258172172_3183421962253606185_n.jpg?_nc_ht=mmg.whatsapp.net&ccb=14-4&oh=01_Q5Aa4QFbSdLwYlgDTapqexKVFlrsDq6noXIbGqZY-jpdNspZrA&oe=6A0886E6&_nc_sid=f87763", "url": "https://mmg.whatsapp.net/v/t61.21164-24/637840996_2159829258172172_3183421962253606185_n.enc?ccb=11-4&oh=01_Q5Aa4AG-pOPj4PFJUL3vmPEgMEP6AiKxge80z9Q0Wyzkk_yJyA&oe=69F61E1F&_nc_sid=5e03e0&mms3=true" },
            { "media-key": "0c/huEe0/BlcyqsDj5mfwZTkHDexd1whwghE3yj/Yh0=", "direct-path": "/v/t61.21164-24/628189319_795144469944562_4301458706101380241_n.jpg?_nc_ht=mmg.whatsapp.net&ccb=14-4&oh=01_Q5Aa4QHQFA7VcAGQorYL0HMKPzya9hgMNcPPpGRTonmDo5OdJQ&oe=6A087458&_nc_sid=f87763", "url": "https://mmg.whatsapp.net/v/t61.21164-24/628189319_795144469944562_4301458706101380241_n.enc?ccb=11-4&oh=01_Q5Aa4AEpfE7lMkrcro6Sw0Y9YWtnV1TCUecdRHiHOAuQ7AIQjA&oe=69F62E2D&_nc_sid=5e03e0&mms3=true" },
            { "media-key": "cvS7vcJvf4g3xL/7xJ8Xboa3IKmYe083goH2MvDjPYo=", "direct-path": "/v/t61.21164-24/620485926_805697048786705_3658597019607326342_n.jpg?_nc_ht=mmg.whatsapp.net&ccb=14-4&oh=01_Q5Aa4QF9EdX3_lhmSwroHKULU6L3OKC8dQryC6GPARr35azfAg&oe=6A0863ED&_nc_sid=f87763", "url": "https://mmg.whatsapp.net/v/t61.21164-24/620485926_805697048786705_3658597019607326342_n.enc?ccb=11-4&oh=01_Q5Aa4AHnDDmcc0mfxyOsg_KSW8AR7ai38TlrNAa-5jLxvzVyCA&oe=69F62E58&_nc_sid=5e03e0&mms3=true" },
            { "media-key": "5+9zyOXyc8+69L9kQImM6BhHUsMF1Zx27jRzWi0ZaLE=", "direct-path": "/v/t61.21164-24/611464327_929637239773818_8159846621619854311_n.jpg?_nc_ht=mmg.whatsapp.net&ccb=14-4&oh=01_Q5Aa4QGLbR_ruG8HEeFK_4rWLE6uNsw2xYKfIJFKroOONaEA8A&oe=6A085801&_nc_sid=f87763", "url": "https://mmg.whatsapp.net/v/t61.21164-24/611464327_929637239773818_8159846621619854311_n.enc?ccb=11-4&oh=01_Q5Aa4AEKABKommQNoGQTYi_zNwkEr7hGF980ELM85v8ssjq7Hg&oe=69F62DFC&_nc_sid=5e03e0&mms3=true" },
            { "media-key": "Nedp4zcKK1mRZPk+7Cc52pu0kksO7dufYGOb/FEvEZI=", "direct-path": "/v/t61.21164-24/643600410_1533381175169765_6182661319759540648_n.jpg?_nc_ht=mmg.whatsapp.net&ccb=14-4&oh=01_Q5Aa4QFFKwedlDIzVtRply7mCv6lYUIICea7tOuDq1GrLCx8hQ&oe=6A08753D&_nc_sid=f87763", "url": "https://mmg.whatsapp.net/v/t61.21164-24/643600410_1533381175169765_6182661319759540648_n.enc?ccb=11-4&oh=01_Q5Aa4AEAS3LfnwkCy0CNobgEu1Mz9KZlKBd3PAVPf4wknK8ZPQ&oe=69F63208&_nc_sid=5e03e0&mms3=true" }
        ]
    }
]

async function extraerTodoElPack() {
    const outputDir = './pack_chomp'
    
    // Crear carpeta si no existe
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir)
        console.log(`📁 Carpeta ${outputDir} creada.`)
    }

    const stickers = packData[0].stickers
    console.log(`🕵️‍♂️ Iniciando extracción masiva de ${stickers.length} stickers...`)

    for (let i = 0; i < stickers.length; i++) {
        const s = stickers[i]
        const num = i + 1
        console.log(`⏳ [${num}/${stickers.length}] Descargando sticker...`)

        const keys = {
            mediaKey: Buffer.from(s["media-key"], "base64"),
            directPath: s["direct-path"],
            url: s["url"]
        }

        try {
            const stream = await downloadContentFromMessage(keys, 'sticker')
            let buffer = Buffer.from([])
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk])
            }

            const fileName = path.join(outputDir, `chomp_${num}.zip`)
            fs.writeFileSync(fileName, buffer)
            console.log(`✅ Guardado: ${fileName}`)

        } catch (error) {
            console.error(`❌ Error en sticker ${num}:`, error.message)
        }
    }

    console.log("\n✨ ¡Proceso terminado! Todos los .was (renombrados a .zip) están en la carpeta 'pack_chomp'.")
}

extraerTodoElPack()
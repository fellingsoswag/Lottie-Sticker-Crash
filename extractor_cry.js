import { downloadContentFromMessage } from '@whiskeysockets/baileys'
import fs from 'fs'

async function extraerDinosaurioLloron() {
    console.log("🕵️‍♂️ Iniciando extracción del dinosaurio que llora (Chomp_10)...")

    // Llaves específicas extraídas de tu JSON para el sticker que llora
    const llavesLloron = {
        mediaKey: Buffer.from("0pE/56jXNtjmvoH5wlWmHCXYKVxt6gwk5yi1mVymcZg=", "base64"),
        directPath: "/v/t61.21164-24/660342360_963073326231858_3562679450021978553_n.jpg?_nc_ht=mmg.whatsapp.net&ccb=14-4&oh=01_Q5Aa4QFxrwx9ffGT5fnDIIYwrzeQD1NxawyUAWWSzHCApQ4kjA&oe=6A0882F4&_nc_sid=f87763",
        url: "https://mmg.whatsapp.net/v/t61.21164-24/660342360_963073326231858_3562679450021978553_n.enc?ccb=11-4&oh=01_Q5Aa4AFbz0gm_XpSx0SUCINkYxUGLnLyK-cKBXx-dyYC04qANQ&oe=69F60109&_nc_sid=5e03e0&mms3=true"
    }

    try {
        console.log("📥 Descargando y desencriptando desde los servidores de Meta...")
        
        // Ejecutamos la descarga tratándolo como sticker (para que use el protocolo correcto)
        const stream = await downloadContentFromMessage(llavesLloron, 'sticker')
        
        let buffer = Buffer.from([])
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }

        // Lo guardamos como .zip para que puedas ver el animation.json dentro
        const outputFileName = './chomp_llorando.zip'
        fs.writeFileSync(outputFileName, buffer)
        
        console.log("✅ ¡Extracción completada!")
        console.log(`📁 Archivo listo en: ${outputFileName}`)
        console.log("💡 Recuerda: Descomprímelo para obtener el 'animation.json' oficial.")

    } catch (error) {
        console.error("❌ Error al extraer el sticker:", error.message)
        if (error.message.includes("404")) {
            console.log("⚠️ Nota: Es posible que la URL haya expirado (Meta las renueva cada pocas horas).")
        }
    }
}

extraerDinosaurioLloron()
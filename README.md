# lottie_sticker_generator bot

Bot de WhatsApp (Baileys) que convierte cualquier imagen que le mandes en un **sticker Lottie animado gigante (9999×9999)** con el dino llorón `Chomp_BigCry` encima.

Basado en el proyecto [Pedrozz13755/Lottie-Whatsapp](https://github.com/Pedrozz13755/Lottie-Whatsapp), con Core reemplazado por el sticker oficial de WhatsApp **Chomp llorando** y añadido efecto de transición. Tambien he usado la librería **archiver** para no depender de **zip**.

---

## Instalación

Requisitos: **Node.js 18+** y npm.

```bash
npm install
```

Dependencias clave:
- `@whiskeysockets/baileys` — cliente WhatsApp
- `archiver` — ZIP puro-Node (reemplaza al binario `zip` original)
- `qrcode-terminal` — muestra el QR en la terminal
- `pino`, `@hapi/boom` — logging y errores

No necesitas `ffmpeg` ni `zip` del sistema.

---

## Uso

```bash
node index.js
```

1. La primera vez aparece un **QR en la terminal** — escanéalo desde WhatsApp (Ajustes → Dispositivos vinculados).
2. Cuando veas `✅ BOT CONECTADO. Envía una imagen AHORA.`, mándale una foto al número vinculado.
3. El bot responde con el sticker gigante Lottie: el dino llorando + tu imagen superpuesta a pantalla completa.

La sesión queda guardada en [auth_info_baileys/](auth_info_baileys/), así que en siguientes arranques no hace falta volver a escanear.

### Qué acepta

- Imágenes directas (`imageMessage`)
- Formatos: PNG, JPEG, WebP

### Qué no acepta (todavía)

- GIFs y videos: WhatsApp los manda como `videoMessage`, y el slot base64 de Lottie sólo admite imágenes estáticas. Requeriría `ffmpeg` para extraer el primer frame.

---

## ¿Cómo funciona el truco?

Un sticker `.was` de WhatsApp es un ZIP con una carpeta `animation/` que contiene dos JSONs Lottie que WhatsApp renderiza superpuestos:

| Archivo | Rol |
|---|---|
| `animation.json` (**Core**) | Animación Lottie principal — el dino llorando. Sticker oficial de WA, vectorial puro, sin imágenes embebidas. |
| `animation.json.overridden_metadata` | **Obligatorio**. JSON con `is-from-user-created-pack: 1` que le dice a WhatsApp que trate el sticker como pack de usuario. **Sin él, WhatsApp valida el `.trust_token`, ve que el Core es un sticker oficial de Meta y muestra la insignia "premium"**. |
| `animation_secondary.json` (**Effect**) | Capa "efecto". Contiene **un asset PNG base64** que es donde inyectamos la imagen del usuario. |

Cada JSON va acompañado de un `.trust_token` (JWT firmado por WhatsApp con ECDSA) que WhatsApp valida antes de aceptar el sticker.

El "glitch 9999" consiste en declarar `height: 9999, width: 9999, isLottie: true, isAnimated: true` en el `stickerMessage` — WhatsApp lo renderiza a pantalla completa encima del chat.

### Por qué el bot original no funcionaba en Windows

1. Usaba `execSync('zip ...')` — `zip` no existe en Windows.
2. Faltaban los archivos `.trust_token` y `.overridden_metadata` que WhatsApp valida.
3. Subía el `.was` como `document` (`prepareWAMessageMedia({ document })`), pero las media keys de Baileys se derivan por tipo (HKDF). Un stickerMessage con keys de documento no se puede desencriptar como sticker → WhatsApp lo muestra como archivo adjunto.

---

## Estructura del proyecto

```
lottie_stickers/
├── index.js                        # Bot principal (Baileys + builder del .was)
├── package.json
├── plantilla/                      # Plantilla del sticker — se mete tal cual en el .was
│   └── animation/
│       ├── animation.json                        # Core: dino llorando (WA_Chomp_10_BigCry)
│       ├── animation.json.trust_token            # Firma del Core
│       ├── animation_secondary.json              # Effect: tiene el slot base64 para tu foto
│       └── animation_secondary.json.trust_token  # Firma del Effect
├── backup_plantilla_pedrozz/       # Backup de la plantilla original de Pedrozz (Chomp_Hmm)
├── chomp_llorando/                 # Sticker oficial descargado (sin modificar)
│   └── animation/ ...
├── build_effect.js                 # Regenera el Effect con N copias de tu imagen rotando (efecto "tiled")
├── extractor.js                    # Descarga todos los stickers del pack Chomp de WA
├── extractor_cry.js                # Descarga sólo el Chomp llorando
├── auth_info_baileys/              # Credenciales de sesión (se genera al escanear QR)
└── output_sticker.was              # Último sticker generado (temporal)
```

---

## Pipeline del builder

[index.js:58-76](index.js#L58-L76) — `buildLottieSticker(buffer, mimeType)`:

1. **Copia recursiva** de `plantilla/` a un directorio temporal (`%TEMP%/lottie-<timestamp>-<rand>/`).
2. **Inyecta la imagen** en el Effect: abre `animation/animation_secondary.json`, busca el primer asset cuyo `p` empiece por `data:image/`, y lo reemplaza con `data:<mime>;base64,<tu imagen>`.
3. **Zipea** el temp con `archiver` preservando la carpeta `animation/` → `output_sticker.was`.
4. **Limpia** el temp.

El `.was` resultante tiene exactamente estos 5 entries:
```
animation/
animation/animation.json
animation/animation.json.trust_token
animation/animation_secondary.json
animation/animation_secondary.json.trust_token
```

---

## Pipeline del envío

[index.js:108-144](index.js#L108-L144):

1. **Sube** el `.was` con `prepareWAMessageMedia({ sticker: wasBuffer, mimetype: 'application/was' })` — tipo `sticker` para que las media keys se deriven correctamente.
2. **Construye** un `stickerMessage` manual con los hashes del upload + `isLottie: true, isAnimated: true, height: 9999, width: 9999`.
3. **Envía** con `conn.relayMessage(...)`.

---

## Cambiar el dino (u otro sticker oficial de WA)

El flujo que uso en este repo para cambiar de Chomp_Hmm a Chomp_BigCry, replicable para cualquier otro sticker oficial:

1. Conseguir el `media-key`, `direct-path` y `url` del sticker (por ejemplo, reenviándotelo a ti mismo y leyendo el `stickerMessage` en Baileys). Hay ejemplos en [extractor.js](extractor.js) y [extractor_cry.js](extractor_cry.js).
2. Descargar y desencriptar con `downloadContentFromMessage(keys, 'sticker')` → obtienes el `.was` oficial.
3. Descomprimir (renómbralo a `.zip` si hace falta).
4. Copiar **sólo** `animation/animation.json` y `animation/animation.json.trust_token` a `plantilla/animation/` **sobrescribiendo** los actuales.
5. **Mantener** los `animation_secondary.json*` de Pedrozz — ese es el que tiene el slot para tu imagen, sin él no hay dónde inyectar.
6. **Regenerar** `animation/animation.json.overridden_metadata` con metadata acorde al nuevo dino. **Es obligatorio** — si no existe, WhatsApp trata el sticker como oficial de Meta y le pega la insignia "premium". Debe incluir `"is-from-user-created-pack": 1`. Formato:

   ```json
   {
     "sticker-pack-id": "<UUID nuevo>",
     "sticker-pack-name": "<nombre del pack>",
     "sticker-pack-publisher": "",
     "accessibility-text": "<descripción>",
     "emojis": ["😭", "🦖"],
     "is-from-user-created-pack": 1
   }
   ```

> El Core (`animation.json`) define qué dinosaurio ves. El Effect (`animation_secondary.json`) es el "contenedor" donde va tu foto. No se pueden fusionar: el Core oficial de WA viene firmado y no tiene slot base64, por eso el hack de Pedrozz mantiene siempre dos JSONs separados.

---

## Cambiar el Effect (cómo se ve tu foto)

El `animation_secondary.json` es un Lottie normal de 540×540. Tú controlas qué hace tu imagen: estática, girando, múltiples copias, desvaneciéndose, etc.

### Efecto "tiled" — múltiples copias rotando

Incluido el generador [build_effect.js](build_effect.js). Regenera el `animation_secondary.json` dejando el slot base64 intacto, pero reemplazando las capas por N copias de tu imagen colocadas en grilla con jitter, cada una girando 360° con ángulo/dirección aleatorios.

```bash
node build_effect.js
```

Parámetros editables al inicio del script:

| Parámetro | Qué hace |
|---|---|
| `cols`, `rows` | Tamaño de la grilla → nº de copias = `cols × rows` |
| `scaleMin`, `scaleMax` | Rango de tamaños (%) de cada copia |
| `posJitter` | Desplazamiento aleatorio en px respecto a la celda |
| `mirrorChance` | Probabilidad (0-1) de que una copia salga espejada |
| `seed` | Semilla del RNG — cambiarla regenera un layout distinto |

> Si el efecto no te convence, edita el CONFIG y vuelve a ejecutar. Si lo rompes, restaura desde [backup_plantilla_pedrozz/animation_secondary.json](backup_plantilla_pedrozz/animation_secondary.json).

### Edición visual

Para efectos más elaborados, abre el `animation_secondary.json` en [lottiefiles.com/editor](https://lottiefiles.com/editor) y edítalo con UI. Guarda y sobrescribe.

---

## Troubleshooting

**El QR no aparece o se reconecta en bucle:**
Borrar [auth_info_baileys/](auth_info_baileys/) y reiniciar.

---

## Créditos

- Técnica original: [Pedrozz13755/Lottie-Whatsapp](https://github.com/Pedrozz13755/Lottie-Whatsapp)
- Stickers oficiales Chomp: © WhatsApp / Meta (propiedad de Meta, sólo uso personal)

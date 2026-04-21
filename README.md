# Lottie Sticker Generator 🎨🔥

![Lottie](https://img.shields.io/badge/Lottie-Animation-00E5FF?style=for-the-badge&logo=lottieFiles)
![WhatsApp](https://img.shields.io/badge/WhatsApp-Bot-25D366?style=for-the-badge&logo=whatsapp)
![NodeJS](https://img.shields.io/badge/Node.js-Bot-339933?style=for-the-badge&logo=nodedotjs)

*Read this in [English](#english-version) | Leia em [Português](#versão-em-português)*

---

## 🇧🇷 Versão em Português

Este projeto é um bot para WhatsApp criado para transformar imagens estáticas em figurinhas animadas (Lottie/`.was`) com efeitos programáticos incríveis, além de realizar testes educacionais de estresse no renderizador do aplicativo.

> **⚠️ Aviso Legal:** O comando `!crash` foi desenvolvido exclusivamente para fins de pesquisa e testes educacionais em ambientes fechados. Não o utilize para prejudicar a experiência de outros usuários.

### 🌟 Funcionalidades e Comandos

Envie uma imagem para o bot com uma das legendas abaixo para acionar os efeitos dinâmicos:

#### Efeitos Visuais (Animações Lottie)
*   **`!1` (Vortex):** A imagem gira rapidamente como um redemoinho enquanto cresce na tela.
*   **`!2` (Mosaico):** Divide a tela em um grid 3x3 com 9 cópias da imagem girando sincronizadas.
*   **`!3` (Chuva):** Várias cópias da sua imagem "chovem" do topo até o chão da conversa.
*   **`!4` (Pulse):** Efeito de batimento cardíaco, a imagem pulsa no centro do chat.
*   **`!5` (Terremoto):** A imagem treme aleatoriamente e de forma agressiva pela tela.

#### Figurinhas Extremos
*   **`!shiinay`:** figurinha Lottie (`9999x9999`) para que ela fique **gigante** e ocupe toda a tela do chat.
*   **`!crash`:** Realiza um *stress test* no renderizador do WhatsApp (rlottie). Este comando gera uma figurinha com **100 níveis de hierarquia profunda** (camadas aninhadas). Isso força o motor de renderização do celular a calcular uma cascata massiva de matrizes, o que pode causar lag severo ou fazer com que o WhatsApp desative temporariamente a renderização de animações (Safe Mode) no dispositivo de quem visualizar.

### 🚀 Como Executar

1.  Clone o repositório e instale as dependências:
    ```bash
    npm install
    ```
2.  Inicie o bot:
    ```bash
    node index.js
    ```
3.  Escaneie o QR Code que aparecerá no terminal com o seu WhatsApp.
4.  Envie uma imagem com um dos comandos acima para testar!

### 👤 Autor e Créditos

*   **Desenvolvedor Principal:** Descubra mais projetos: **[https://shiinay.is-a.dev](https://shiinay.is-a.dev)**
*   **Base do Projeto:** Os créditos pela fundação e estrutura inicial do Lottie Extractor vão para o criador original do repositório base: **[https://github.com/amis13/lottie_sticker_generator](https://github.com/amis13/lottie_sticker_generator)**

---

## 🇺🇸 English Version

This project is a WhatsApp bot designed to transform static images into animated Lottie stickers (`.was`) with amazing programmatic effects, as well as perform educational stress tests on the app's renderer.

> **⚠️ Disclaimer:** The `!crash` command was developed exclusively for research and educational testing in closed environments. Do not use it to harm other users' experience.

### 🌟 Features and Commands

Send an image to the bot with one of the captions below to trigger the dynamic effects:

#### Visual Effects (Lottie Animations)
*   **`!1` (Vortex):** The image spins quickly like a whirlpool while growing on the screen.
*   **`!2` (Mosaic):** Divides the screen into a 3x3 grid with 9 copies of the image spinning in sync.
*   **`!3` (Rain):** Several copies of your image "rain" from the top to the bottom of the chat.
*   **`!4` (Pulse):** Heartbeat effect, the image pulses in the center of the chat.
*   **`!5` (Earthquake):** The image shakes randomly and aggressively across the screen.

#### Extreme Stickers
*   **`!shiinay`:** Forces the Lottie sticker dimensions (`9999x9999`) so it becomes **giant** and takes up the entire chat screen.
*   **`!crash`:** Performs a *stress test* on the WhatsApp renderer (rlottie). This command generates a sticker with **100 levels of deep hierarchy** (nested layers). This forces the mobile rendering engine to calculate a massive cascade of matrices, which can cause severe lag or make WhatsApp temporarily disable animation rendering (Safe Mode) on the viewer's device.

### 🚀 How to Run

1.  Clone the repository and install the dependencies:
    ```bash
    npm install
    ```
2.  Start the bot:
    ```bash
    node index.js
    ```
3.  Scan the QR Code that appears in the terminal with your WhatsApp.
4.  Send an image with one of the commands above to test!

### 👤 Author and Credits

*   **Main Developer:** Discover more amazing projects made by me in my portfolio: **[https://shiinay.is-a.dev](https://shiinay.is-a.dev)** 
*   **Project Base:** Credits for the foundation and initial structure of the Lottie Extractor go to the original creator of the base repository: **[https://github.com/amis13/lottie_sticker_generator](https://github.com/amis13/lottie_sticker_generator)**

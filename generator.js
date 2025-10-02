document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('generator-form');
    const contentBlocksContainer = document.getElementById('content-blocks-container');
    const addButtons = document.querySelectorAll('.add-btn');

    // Menangani penambahan blok konten baru
    addButtons.forEach(button => {
        button.addEventListener('click', () => {
            const type = button.getAttribute('data-type');
            addContentBlock(type);
        });
    });

    // Fungsi untuk menambah blok konten ke formulir
    function addContentBlock(type) {
        const block = document.createElement('div');
        block.className = 'content-block';
        block.setAttribute('data-type', type);

        let blockHTML = '';
        if (type === 'circle-link') {
            blockHTML = `
                <div class="content-block-header"><i class="fas fa-link"></i> Tautan Ikon Bulat</div>
                <div class="grid-2">
                    <div>
                        <label>Judul Tautan:</label>
                        <input type="text" data-field="title" placeholder="e.g., TikTok">
                    </div>
                    <div>
                        <label>URL Gambar Ikon:</label>
                        <input type="url" data-field="imageUrl" placeholder="https://...">
                    </div>
                </div>
                <label>URL Tujuan:</label>
                <input type="url" data-field="url" placeholder="https://...">
            `;
        } else if (type === 'button-link') {
            blockHTML = `
                <div class="content-block-header"><i class="fas fa-square"></i> Tombol Tautan</div>
                <label>Judul Tombol:</label>
                <input type="text" data-field="title" placeholder="e.g., Beri saya dukungan">
                <label>URL Tujuan:</label>
                <input type="url" data-field="url" placeholder="https://...">
                <div class="grid-2">
                    <div>
                        <label>Warna Latar Tombol:</label>
                        <input type="color" data-field="bgColor" value="#FFFFFF">
                    </div>
                    <div>
                        <label>Warna Teks Tombol:</label>
                        <input type="color" data-field="textColor" value="#000000">
                    </div>
                </div>
                <label>Ikon Font Awesome (Opsional):</label>
                <input type="text" data-field="icon" placeholder="e.g., fas fa-mug-hot">
            `;
        } else if (type === 'social-icons') {
            blockHTML = `
                <div class="content-block-header"><i class="fas fa-share-alt"></i> Ikon Sosial Media</div>
                <label>URL WhatsApp:</label>
                <input type="url" data-field="whatsapp" placeholder="Kosongkan jika tidak ada">
                <label>URL TikTok:</label>
                <input type="url" data-field="tiktok" placeholder="Kosongkan jika tidak ada">
                <label>URL Instagram:</label>
                <input type="url" data-field="instagram" placeholder="Kosongkan jika tidak ada">
                <label>URL Website/Blog:</label>
                <input type="url" data-field="website" placeholder="Kosongkan jika tidak ada">
            `;
        }

        block.innerHTML = blockHTML + '<button type="button" class="remove-btn"><i class="fas fa-times-circle"></i></button>';
        contentBlocksContainer.appendChild(block);

        // Tambahkan event listener untuk tombol hapus
        block.querySelector('.remove-btn').addEventListener('click', () => {
            block.remove();
        });
    }

    // Fungsi utama saat tombol "Generate" diklik
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        
        // Kumpulkan data global
        const globalData = {
            profileName: document.getElementById('profile-name').value,
            profileImageUrl: document.getElementById('profile-image-url').value,
            description: document.getElementById('description').value,
            backgroundImageUrl: document.getElementById('background-image-url').value,
            fontFamily: document.getElementById('font-family').value,
            textColor: document.getElementById('text-color').value,
            content: []
        };

        // Kumpulkan data dari setiap blok konten
        const blocks = contentBlocksContainer.querySelectorAll('.content-block');
        blocks.forEach(block => {
            const type = block.getAttribute('data-type');
            const blockData = { type };
            block.querySelectorAll('input, select').forEach(input => {
                const field = input.getAttribute('data-field');
                if (field) {
                    blockData[field] = input.value;
                }
            });
            globalData.content.push(blockData);
        });

        const generatedHtml = createHtmlTemplate(globalData);
        downloadHtmlFile(generatedHtml, 'index.html');
    });

    // Fungsi untuk membuat string HTML dari template
    function createHtmlTemplate(data) {
        const fontLink = data.fontFamily.replace(' ', '+');
        
        const generateContent = () => {
            let html = '';
            let socialIconsHTML = '';
            let circleLinksHTML = '<div class="row content-main content__paddingtop">';
            let buttonLinksHTML = '';

            data.content.forEach(block => {
                if (block.type === 'social-icons') {
                    socialIconsHTML += '<div class="socialmedia-up d-flex justify-content-center flex-wrap margintop__default">';
                    if (block.website) socialIconsHTML += `<div class="mr-2 ml-2 pb-2"><a style="color: ${data.textColor}" href="${block.website}" target="_blank"><i class="fas fa-globe"></i></a></div>`;
                    if (block.whatsapp) socialIconsHTML += `<div class="mr-2 ml-2 pb-2"><a style="color: ${data.textColor}" href="${block.whatsapp}" target="_blank"><i class="fab fa-whatsapp"></i></a></div>`;
                    if (block.tiktok) socialIconsHTML += `<div class="mr-2 ml-2 pb-2"><a style="color: ${data.textColor}" href="${block.tiktok}" target="_blank"><i class="fab fa-tiktok"></i></a></div>`;
                    if (block.instagram) socialIconsHTML += `<div class="mr-2 ml-2 pb-2"><a style="color: ${data.textColor}" href="${block.instagram}" target="_blank"><i class="fab fa-instagram"></i></a></div>`;
                    socialIconsHTML += '</div>';
                }
                if (block.type === 'circle-link' && block.title && block.url && block.imageUrl) {
                    circleLinksHTML += `
                        <div class="content-column hover__grow">
                            <a href="${block.url}" target="_blank">
                                <img src="${block.imageUrl}" alt="img" class="rounded-circle object" loading="lazy" />
                                <p style="color: ${data.textColor}; font-family: '${data.fontFamily}' !important;" class="text-center font-text circle-image__textellipsis font-weight-bold">${block.title}</p>
                            </a>
                        </div>`;
                }
                if (block.type === 'button-link' && block.title && block.url) {
                    const iconHTML = block.icon ? `<div style="width: 46px; margin: auto 2px"><i class="${block.icon} fa-fw"></i></div>` : '<div style="width: 15px;"></div>';
                    buttonLinksHTML += `
                        <div class="button margintop__default hover__grow">
                            <a href="${block.url}" target="_blank">
                                <button type="button" style="background-color:${block.bgColor}!important; border: 2px solid ${block.bgColor}; color: ${block.textColor}!important; font-family: '${data.fontFamily}' !important;" class="button-images__semirounded btn-block font-weight-bold font-text lineHeight button__fontsize">
                                    ${iconHTML}
                                    <p class="button-text">${block.title}</p>
                                    <div class="button-images__icons"></div>
                                </button>
                            </a>
                        </div>`;
                }
            });

            circleLinksHTML += '</div>';
            html += socialIconsHTML; // Tampilkan ikon sosial di atas
            if (circleLinksHTML.includes('content-column')) html += circleLinksHTML; // Hanya tampilkan jika ada isinya
            html += buttonLinksHTML; // Tampilkan tombol di bawah
            return html;
        };

        return `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <title>${data.profileName}</title>
    <link rel="shortcut icon" href="${data.profileImageUrl}" type="image/x-icon">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=${fontLink}:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: '${data.fontFamily}', sans-serif;
            background-image: url('${data.backgroundImageUrl}');
            background-repeat: no-repeat;
            background-attachment: fixed;
            background-size: cover;
            background-position: center;
            color: ${data.textColor};
            margin: 0; padding: 15px;
            display: flex; justify-content: center; align-items: flex-start; min-height: 100vh;
        }
        .container { width: 100%; max-width: 680px; }
        .section { display: flex; flex-direction: column; }
        .header { text-align: center; overflow-wrap: anywhere; }
        .profile-images { width: 96px; height: 96px; border-radius: 50%; object-fit: cover; box-shadow: 0 2px 8px rgba(0,0,0,0.2); margin-bottom: 10px; }
        .profile-name { font-size: 1.8rem; font-weight: 700; margin: 10px 0 5px; }
        .description { font-size: 1rem; font-weight: 400; margin: 0; }
        .margintop__default { margin-top: 20px; }
        .socialmedia-up a { font-size: 1.8rem; text-decoration: none; }
        .socialmedia-up > div { padding: 5px 10px; }
        .content-main { display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; }
        .content-column { flex: 0 0 90px; }
        .content-column a { text-decoration: none; }
        .rounded-circle { width: 90px; height: 90px; border-radius: 50%; object-fit: cover; }
        .circle-image__textellipsis { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-top: 8px; }
        .font-weight-bold { font-weight: 700; }
        .button { margin-top: 15px; }
        .button a { text-decoration: none; }
        button.btn-block {
            width: 100%;
            border-radius: 25px;
            padding: 12px 15px;
            font-size: 1rem;
            cursor: pointer;
            display: flex; align-items: center; justify-content: center; text-align: left;
            transition: transform 0.2s ease;
        }
        button.btn-block:hover { transform: scale(1.03); }
        .button-text { flex-grow: 1; text-align: center; }
        footer { text-align: center; margin-top: 40px; padding-bottom: 20px; font-size: 0.9rem; }
        footer a { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="container">
        <section class="section">
            <header class="header">
                <img src="${data.profileImageUrl}" alt="profile-image" class="profile-images" />
                <h1 class="profile-name">${data.profileName}</h1>
                <h2 class="description">${data.description}</h2>
            </header>
            <main class="content">
                ${generateContent()}
            </main>
            <footer class="text-center">
                <p class="font-weight-bold">Powered by <a href="https://sociabuzz.com" target="_blank" style="color: ${data.textColor};">SociaBuzz</a> Clone</p>
            </footer>
        </section>
    </div>
</body>
</html>`;
    }

    function downloadHtmlFile(content, fileName) {
        const blob = new Blob([content], { type: 'text/html' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
    }
});
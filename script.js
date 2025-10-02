document.addEventListener("DOMContentLoaded", () => {
    // Fungsi untuk mendapatkan warna dominan dari gambar
    function getDominantColor(imgElement, callback) {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        const width = 10;
        const height = 10;
        canvas.width = width;
        canvas.height = height;

        try {
            ctx.drawImage(imgElement, 0, 0, width, height);
            const imageData = ctx.getImageData(0, 0, width, height);
            const data = imageData.data;

            let r = 0, g = 0, b = 0, count = 0;
            for (let i = 0; i < data.length; i += 4) {
                const alpha = data[i + 3];
                if (alpha > 128) {
                    r += data[i];
                    g += data[i + 1];
                    b += data[i + 2];
                    count++;
                }
            }
            if (count === 0) {
                callback("rgb(200,200,200)");
                return;
            }
            r = Math.round(r / count);
            g = Math.round(g / count);
            b = Math.round(b / count);
            callback(`rgb(${r},${g},${b})`);
        } catch (error) {
            console.error("Gagal memproses gambar:", error);
            callback("rgb(220,220,220)"); // fallback color
        }
    }

    // Terapkan warna dominan ke border gambar
    document.querySelectorAll('.app-image-wrapper img').forEach(img => {
        const setBorderColor = () => {
            getDominantColor(img, (color) => {
                if (img.parentElement) {
                    img.parentElement.style.borderColor = color;
                }
            });
        };

        if (img.complete) {
            setBorderColor();
        } else {
            img.onload = setBorderColor;
        }
    });

    // Implementasi drag scroll untuk setiap container aplikasi
    document.querySelectorAll('.app-container').forEach(container => {
        let isDown = false;
        let startX;
        let scrollLeft;

        container.addEventListener('mousedown', (e) => {
            isDown = true;
            container.style.cursor = 'grabbing';
            startX = e.pageX - container.offsetLeft;
            scrollLeft = container.scrollLeft;
        });

        container.addEventListener('mouseleave', () => {
            isDown = false;
            container.style.cursor = 'grab';
        });

        container.addEventListener('mouseup', () => {
            isDown = false;
            container.style.cursor = 'grab';
        });

        container.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - container.offsetLeft;
            const walk = (x - startX) * 2;
            container.scrollLeft = scrollLeft - walk;
        });
    });
});
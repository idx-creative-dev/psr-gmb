(function () {
    // Buat tombol floating
    const button = document.createElement('button');
    button.innerHTML = 'Copy Content';
    Object.assign(button.style, {
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        zIndex: '9999',
        padding: '10px',
        background: 'blue',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    });
    document.body.appendChild(button);

    // Fungsi untuk menyalin HTML dengan CSS ke clipboard
    button.addEventListener('click', async function () {
        // Hilangkan tombol sebelum menyalin
        button.remove();

        const bodyClone = document.body.cloneNode(true); // Clone body agar tidak mempengaruhi halaman asli

        // Pastikan semua elemen contenteditable tersalin dengan perubahan terbaru
        bodyClone.querySelectorAll('[contenteditable="true"]').forEach(el => {
            el.innerHTML = el.innerHTML;
        });

        // Proses iframe
        bodyClone.querySelectorAll('iframe').forEach(iframe => {
            try {
                // Jika iframe berasal dari domain yang sama, ambil isinya
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                iframe.outerHTML = `<div>${iframeDoc.documentElement.innerHTML}</div>`;
            } catch (e) {
                // Jika cross-origin, hanya salin elemen <iframe> saja
                console.warn('Tidak bisa mengakses iframe karena CORS:', iframe.src);
            }
        });

        // Menyalin semua style di halaman
        const styles = document.querySelectorAll('style, link[rel="stylesheet"]');
        let styleContent = '';
        styles.forEach(style => {
            if (style.tagName === 'STYLE') {
                styleContent += style.innerHTML;
            } else if (style.href) {
                styleContent += `@import url(${style.href});`;
            }
        });

        // Bungkus dalam format HTML lengkap agar bisa dipaste dengan style
        const fullHtml = `
            <html>
                <head>
                    <style>${styleContent}</style>
                </head>
                <body>${bodyClone.innerHTML}</body>
            </html>
        `;

        // Gunakan Clipboard API untuk menyalin dalam format HTML
        try {
            await navigator.clipboard.write([
                new ClipboardItem({
                    'text/html': new Blob([fullHtml], { type: 'text/html' }),
                    'text/plain': new Blob([bodyClone.innerText], { type: 'text/plain' })
                })
            ]);
            alert('Halaman telah disalin dengan CSS & iframe!');
        } catch (err) {
            console.error('Gagal menyalin:', err);
            alert('Gagal menyalin. Coba lagi!');
        }
    });
})();

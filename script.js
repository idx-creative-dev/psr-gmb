(function () {
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

    button.addEventListener('click', async function () {
        button.remove();

        const bodyClone = document.body.cloneNode(true);

        bodyClone.querySelectorAll('[contenteditable="true"]').forEach(el => {
            el.innerHTML = el.innerHTML;
        });

        bodyClone.querySelectorAll('iframe').forEach(iframe => {
            try {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                iframe.outerHTML = `<div>${iframeDoc.documentElement.innerHTML}</div>`;
            } catch (e) {
                console.warn('Tidak bisa mengakses iframe karena CORS:', iframe.src);
            }
        });

        const styles = document.querySelectorAll('style, link[rel="stylesheet"]');
        let styleContent = '';
        styles.forEach(style => {
            if (style.tagName === 'STYLE') {
                styleContent += style.innerHTML;
            } else if (style.href) {
                styleContent += `@import url(${style.href});`;
            }
        });

        const fullHtml = `
            <html>
                <head>
                    <style>${styleContent}</style>
                </head>
                <body>${bodyClone.innerHTML}</body>
            </html>
        `;

        try {
            await navigator.clipboard.write([
                new ClipboardItem({
                    'text/html': new Blob([fullHtml], { type: 'text/html' }),
                    'text/plain': new Blob([bodyClone.innerText], { type: 'text/plain' })
                })
            ]);
            alert('Halaman telah disalin!');
        } catch (err) {
            console.error('Gagal menyalin:', err);
            alert('Gagal menyalin. Coba lagi!');
        }
    });
})();

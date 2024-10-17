export default class HelperService {
  
    isNullOrEmpty(str) {
        return !str || str.trim() === '';
    }
    formatCurrency(value, curr = 'TRY') {
        try {
            return value.toLocaleString('tr-TR', { style: 'currency', currency: curr });
        } catch {
            return value;
        }
    }

    parseCamelCase(value) {
        if (!value) return null;
        return value.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
    }

    formatPhone(value) {
        try {
            if (value.includes('(')) return value;
            return value.replace(/\D+/g, '').replace(/(\d.*)?(\d{3})(\d{3})(\d{4})/, '$1 ($2) $3-$4');
        } catch {
            return value;
        }
    }

    froalaConfig(height = 300) {
        return {
            height,
            language: 'tr',
            toolbarButtons: {
                moreText: {
                    buttons: ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', 'textColor', 'backgroundColor', 'inlineClass', 'inlineStyle', 'clearFormatting'],
                    buttonsVisible: 2
                },
                moreParagraph: {
                    buttons: ['alignLeft', 'alignCenter', 'formatOLSimple', 'alignRight', 'alignJustify', 'formatOL', 'formatUL', 'paragraphFormat', 'paragraphStyle', 'lineHeight', 'outdent', 'indent', 'quote'],
                    buttonsVisible: 1
                },
                moreRich: {
                    buttons: ['insertTable', 'insertLink', 'insertImage', 'insertVideo', 'emoticons', 'fontAwesome', 'specialCharacters', 'embedly', 'insertFile', 'insertHR'],
                    buttonsVisible: 1
                },
                moreMisc: {
                    buttons: ['html', 'undo', 'redo', 'fullscreen', 'print', 'getPDF', 'spellChecker', 'selectAll', 'help'],
                    buttonsVisible: 1
                }
            }
        };
    }

    debounce(fn, delay) {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn(...args), delay);
        };
    }

    formatDate(value, hasHour = false) {
        if (!value) return null;
        const options = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            ...(hasHour && { hour: '2-digit', minute: '2-digit' })
        };
        return new Date(value).toLocaleDateString('tr-TR', options);
    }

    printDiv(divName) {
        const printContents = document.getElementById(divName).innerHTML;
        const originalContents = document.body.innerHTML;

        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
    }
    guid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }

    base64ToBlob(base64) {
        const byteString = atob(base64.split(',')[1]);
        const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);

        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ab], { type: mimeString });
    }
    goToPage(url) {
        window.location.href = url; // Sayfayı bu URL'ye yönlendirir
    }
}

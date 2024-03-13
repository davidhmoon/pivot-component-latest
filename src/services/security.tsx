import * as forge from "node-forge";
// Encrypt the text with the public key
export const encryptText = (text: string) => {
    const publicKey = forge.pki.publicKeyFromPem(
        `-----BEGIN PUBLIC KEY-----
        MIIEIjANBgkqhkiG9w0BAQEFAAOCBA8AMIIECgKCBAEA5ykIP/cBtH1/0ImqnwGE
        /nQzC3cnurLGXbmi+FjNkLrofLAC6Q7qpMcFQQl0xL0dsNKFsEx6BWta/POGTJt5
        xpoaKaJ0f7tZjDFnbuUnMTD4SyXUNn/9Q85MDCnlSrjicchEhMWnx/wX2xFt7k42
        xZAVeI2yXFgnehpvOchdN3zcf7pcWwVaNx+Znps2CBcjqMZvrRzWi9R3+mZcyBrf
        tQJbWSNwzEVgTjDVOZkao5Azf2YoNNtJZPeLCFo7Y6CeZiucuYgKWRRNOiZDIEmz
        4MpBGTzGk4nM/8wLUyFtFYfDIhnURav48YpPpGabzTgMTDQioISBnPfwKTs0Ysm5
        EEo5aq/4MKZAybF/AJG83EWptMPH4wJWppEx8p8/RPINiUk5jPuTFXnvPyPLOskj
        DMtMgAeoyLXomrHE4jdaqZzpqcEFK8PRnmLQm2Bgqr6l3IoRETeyf/oFOKkuy5e4
        mTyE/buTTS62TS6Do55+5NKyI2lCpFH6/nlAwBcOA3fqWZKLQz2ctrDtqH/ISU8W
        m++gyLkg+CV5c9T2ur0zW5fdMMD2D7hD4pdAiE9UGkYu/D1/yRmRByoF7QH6vopA
        RiETrImTqfGmenAA60d1zgQkOEzrzwGldRJO7d0gx9GeQ8m2ze79dXKJmw31u6tg
        qTdPZ/WDdl/DqzM02AtcHivfy6yjbWcwzYQ6sAGAQUFsQjXt/DAjTQgeoau31fmb
        DfldxspHvq6wKb9D9RqXFBP/D8j64ESjzqjn9gZRDFX/X+JYntB6IZwH7k0kr9s1
        wMKgd0Lyzn5nyQG4/iOaKpUtMgjVbbvXww1c3YvZhZ3JaZRbyBQLhBzNYjStV42R
        CjhqSY1aYbNiS7/d4Lmox87Szj7vfOv6c+C3vXpDK1bCbbR1v3XNPiVthChoSfsV
        4XoNnB7EQrukIgOgyW/fz+b9PpiE03+pzRPTq8OHMXrG2gZIxCJnv9/dCcwZ1oDX
        3lbSYcX5yn2ZU6GUGt0nx5t3MDwW6U8LKvsk+YtumA1rz/UMTaDsPfx3Lbydrlhw
        CQ4yFtUFZZQt1NBbsEGCIo+whf4VoAuYrMG95+uulAV7nCFxSSdok9BCRSPf1KK8
        keZp01Bxmbs4NS9o3c8Ah3fD9JDMhqR8w0D5guuGDsqZ+OV06Ax5SLnxpRfGpDAG
        ocvYyLNyKhulBuHO8pfUiGaM6i06rrEGWYIxfVHg/k9dBKavt0GnxcLndvDTellE
        aIKlcL/PxjJZBM7LdBNEPkWFKI9+eRacdY+0X/mH0pTiXWFeILW3NgSqtGYsnr81
        7vG0ncaGN/qKEo8pxMpUHuRbVhYQda8GOnFgqQUwDZx90Gnql1VCyht5Z3N1Tg/P
        sQIDAQAB
        -----END PUBLIC KEY-----`
    );
    const encryptedData = publicKey.encrypt(text, 'RSA-OAEP');
    return forge.util.encode64(encryptedData);
};

export const serializeObject = (obj: any) => {
    let str = [];
    for (let p in obj) {
        if (obj.hasOwnProperty(p)) {
            if (obj[p] !== null && obj[p] !== '') {
                if (p !== "searchGlp") {
                    str.push(p + '=' + obj[p]);
                } else {
                    str.push('search:sku$po_no$cntr_truckno$master_bl=' + obj[p]);
                }
            }
        }
    }
    return str.join('&');
};

const puppeteer = require('puppeteer');
const fs = require('fs');

(async() => {
    const browser = await puppeteer.launch({
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    });
    console.log('launched');
    const page = await browser.newPage();

    page.on('pageerror', error => {
        console.log('Console Error', error.message)
    });
    page.on('response', response => {
        console.log(response.status(), response.url());
        if (300 > response.status() && 200 <= response.status()) return;
        console.warn('status error', response.status(), response.url());
    });
    console.log('create page');
    await page.goto('http://192.168.30.94:8081/', { waitUntil: 'networkidle0' }); // 表示したいURL
    console.log('moved');
    console.log('wait seconds');
    await page.screenshot({path: 'graph2.png'});
    console.log('got screenshot');
    const html = await page.$eval('svg', svg => {
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        return svg.outerHTML;
    });
    console.log('evaluated');

    console.log(html);
    fs.writeFileSync('fuga.svg', html);
    browser.close();
})();

const puppeteer = require('puppeteer');

const fs = require('fs'); // Importing the Node.js file system module to manipulate files
const path = require('path'); // Importing the Node.js path module to handle file paths

const loginLink = 'https://www.fordpro.com/en-us/';

async function waitUntilDownload(page, fileName = '') {
    return new Promise((resolve, reject) => {
        page._client().on('Page.downloadProgress', e => { // or 'Browser.downloadProgress'
            if (e.state === 'completed') {
                resolve(fileName);
            } else if (e.state === 'canceled') {
                reject();
            }
        });
    });
}

(async () => {


    const browser = await puppeteer.launch({
        headless: false,
        args: ['--start-maximized'],
        ignoreHTTPSErrors: true,
        defaultViewport: null
    });



    const page = await browser.newPage();
    await page.goto(loginLink);

    // Click the authentication icon
    await page.click('svg[data-testid="authLink__authIcon"]', { delay: 50 });

    // Wait for the email textbox to be available
    {
        await page.waitForSelector('input[id="emailOrUsername"]', { visible: true });

        // Type the email
        await page.type('input[id="emailOrUsername"]', email, { delay: 50 });
    }

    // Click the login button
    await page.click('button[id="continue"]', { delay: 50 });

    // Wait for navigation to complete if there's any
    await page.waitForNavigation({ waitUntil: 'networkidle0' });


    // Wait for the user ID input to be available
    {
        await page.waitForSelector('input[type="text"]', { visible: true });

        // Type the user ID
        await page.type('input[type="text"]', userId, { delay: 50 });
    }

    // Type the password
    {
        await page.type('input[type="password"]', password, { delay: 50 });

        // Click the login button
        await page.click('input[type="submit"]', { delay: 50 });
    }



    // Wait for navigation to complete if there's any
    await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 50000 });

    console.log("Logged in successfully");

    // Wait for the close/remove button to be available
    {
        await page.waitForSelector('button[class="fpg-web--UniversalButton-module--UniversalButton--tbEAyyocRVFQcunBfklK fpg-web--Modal-module--modal_backdrop__modal__actions__cancel--AudcZBMpRpYlK9MrhEXK"]', { visible: true });

        // Click the close/remove button
        await page.click('button[class="fpg-web--UniversalButton-module--UniversalButton--tbEAyyocRVFQcunBfklK fpg-web--Modal-module--modal_backdrop__modal__actions__cancel--AudcZBMpRpYlK9MrhEXK"]', { delay: 50 });
    }


    //  ===========================================================

    // Parse the JSON content
    const filePath = './values.json';
    const content = fs.readFileSync(filePath, 'utf8');

    // Parse the JSON content
    const values = JSON.parse(content);

    for (const [orderingFin, endUserFin] of Object.entries(values)) {

        console.log(`\nRunning Puppeteer with Ordering FIN: ${orderingFin} and End User FIN: ${endUserFin}`);
        try {
            {
                {
                    // Business Tool btn click
                    {
                        await page.evaluate(selector => {
                            document.querySelector(selector).click();
                        }, 'button[class="fpg-web--UniversalButton-module--UniversalButton--tbEAyyocRVFQcunBfklK fpg-web--PrimaryMenuNode-module--primaryMenuNode__button--Z9lyxTS26XNOlyGsFQ0z"]');
                        console.log("Business Tool Clicked")
                    }


                    // Order btn click
                    {
                        await page.evaluate(selector => {
                            document.querySelector(selector).click();
                        }, 'button[class="fpg-web--UniversalButton-module--UniversalButton--tbEAyyocRVFQcunBfklK fpg-web--TabsColumn-module--tabsColumn__tabs__list__tab--atQbbKOaRkFh9APdRmGr"]');
                        console.log("Order Btn Clicked")
                    }


                    // Order Status btn click
                    {
                        await page.evaluate(selector => {
                            document.querySelector(selector).click();
                        }, 'a[href="/en-us/tools/orders/order-status/"]');
                        console.log("Order Status Clicked")
                    }



                    // Enter Ordering FIN
                    {
                        const targetPage = page;
                        await puppeteer.Locator.race([
                            targetPage.locator('::-p-aria(Ordering FIN)'),
                            targetPage.locator("[data-testid='Ordering\\ FIN']"),
                            targetPage.locator('::-p-xpath(//*[@data-testid=\\"Ordering FIN\\"])'),
                            targetPage.locator(":scope >>> [data-testid='Ordering\\ FIN']")
                        ])
                            .setTimeout(9000)
                            .fill(orderingFin);
                        console.log("OrderingFIN")
                    }


                    // Entering End User FIN

                    {
                        const targetPage = page;
                        await puppeteer.Locator.race([
                            targetPage.locator('::-p-aria(End User FIN)'),
                            targetPage.locator("[data-testid='End\\ User\\ FIN']"),
                            targetPage.locator('::-p-xpath(//*[@data-testid=\\"End User FIN\\"])'),
                            targetPage.locator(":scope >>> [data-testid='End\\ User\\ FIN']")

                        ])
                            .setTimeout(9000)
                            .fill(endUserFin);
                        console.log("End User FIN")
                    }

                    // Click Next button
                    {
                        await page.click('button[type="submit"]', { delay: 60 });
                        console.log("Next")
                    }


                    // Click Submit button
                    {
                        const targetPage = page;
                        await puppeteer.Locator.race([
                            targetPage.locator('::-p-aria(Submit your inquiry.) >>>> ::-p-aria([role=\\"generic\\"])'),
                            targetPage.locator("[data-testid='submit-btn'] span"),
                            targetPage.locator('::-p-xpath(//*[@data-testid=\\"submit-btn\\"]/button/span)'),
                            targetPage.locator(":scope >>> [data-testid='submit-btn'] span"),
                            targetPage.locator('::-p-text(Submit)')
                        ])
                            .setTimeout(5000)
                            .click({
                                offset: {
                                    x: 40.440948486328125,
                                    y: 9.75689697265625,
                                },
                            });
                        console.log("Submit Clicked")
                    }


                    const downloadPath = path.resolve('./dumps');
                    const client = await page.target().createCDPSession();


                    // Set the download behavior with the desired directory
                    await client.send('Page.setDownloadBehavior', {
                        behavior: 'allow',
                        eventsEnabled: true,
                        downloadPath: downloadPath // Replace with your desired path
                    });


                    // Wait for Excel Button
                    {
                        await page.waitForSelector("#fp-content-main > div > div > div > div > div > div.order-status__body > div.order-status-result-search > div.order-status-form.fpfc-container.fpfc-container-dark.fpt-order-status-summary-body > div.order-status-button-container > div.fds-standard-button > button", { visible: true })

                        // Excel Button Clicked
                        await page.evaluate(selector => {
                            document.querySelector(selector).click();
                        }, "#fp-content-main > div > div > div > div > div > div.order-status__body > div.order-status-result-search > div.order-status-form.fpfc-container.fpfc-container-dark.fpt-order-status-summary-body > div.order-status-button-container > div.fds-standard-button > button");
                        console.log("Excel btn click ")

                        // try {
                        // await page.waitForNetworkIdle();
                        await waitUntilDownload(page, 'OrderSummaryRecord.xlsx');

                        // } 
                        // catch (error) {

                        // File Handling and renaming
                        let objectDate = new Date();
                        let day = objectDate.getDate().toString().padStart(2, 0);
                        let month = (objectDate.getMonth() + 1).toString().padStart(2, 0);
                        let year = objectDate.getFullYear();
                        const dateString = `${month}.${day}.${year}`;
                        // Rename the downloaded file with the new file name
                        fs.renameSync("./dumps/OrderSummaryRecord.xlsx", `./dumps/Ford Report ${dateString}-${endUserFin}.csv`);
                        // }
                    }

                    // Logo Button Clicked
                    {
                        await page.click('a[href="/en-us/"]', { delay: 50 });
                        console.log("Logo Clicked")
                    }

                }
            }
        }

        catch (error) {
            // console.error('Error:', error);
            console.log("\tPopup appeared");

            await page.click('a[href="/en-us/"]', { delay: 50 });
            console.log('\tResetting values and filling again.');

            continue
        }
    }

}

)();
import puppeteer from "puppeteer";

export const getKsForReport = async () : Promise<string|null> => {
  console.log('KS for Report');
  const ks = await new Promise(async(resolve, reject)=>{
    const browser = await puppeteer.launch({
      headless: 'new',
      timeout: 20000,
      defaultViewport:null,
      ignoreHTTPSErrors: true,
      slowMo: 0,
      args: [
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-setuid-sandbox',
        '--no-first-run',
        '--no-sandbox',
        '--no-zygote',
        '--window-size=1280,720',
      ],
    });
    try {
      const page = await browser.newPage();
      await page.setRequestInterception(true);
      page.on('request', (interceptedRequest) => {
        const blockResources = ['stylesheet', 'image', 'media', 'font'];
        if (blockResources.includes(interceptedRequest.resourceType())) {
          interceptedRequest.abort();
        } else {
          if(interceptedRequest.resourceType() == 'xhr' && interceptedRequest.url().startsWith('https://www.kaltura.com/api_v3/service/multirequest?format=1'))
          {
            const data = interceptedRequest.postData()
            if(data){
              console.log(JSON.parse(data)['0']['ks'])
              browser.close()
              resolve(JSON.parse(data)['0']['ks'])
            }
          }

          interceptedRequest.continue();
        }
      });
  
      // Change the user agent of the scraper
      await page.setUserAgent(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36'
      );
  
      await page.goto('https://www.mycourseville.com/api/chulalogin');
  
      
      await page.waitForSelector('#username')
      await page.waitForSelector('#password')
      await page.waitForSelector('#cv-login-cvecologinbutton')
      await page.type('#username', process.env.MCV_ID as string)
      await page.type('#password', process.env.MCV_PASS as string)
      await page.click('#cv-login-cvecologinbutton')
      await page.goto('https://www.mycourseville.com/api/oauth/authorize?response_type=code&client_id=mycourseville.com&redirect_uri=https://www.mycourseville.com&scope=public')
      await page.goto('https://www.mycourseville.com/?q=courseville/course/45205/media_gallery')
      await page.goto('http://kaf.mycourseville.com/channel/myCourseVille-3200106.01-2023-2/327862722')
      await page.waitForSelector('#channelActionsDropdown')
      await page.click('#channelActionsDropdown')
      await page.click('#channelActionsDropdownMenu > li:nth-child(2) > a')
      await new Promise(()=>{ setTimeout(() => {
        reject(null)
      }, 15000);})

    } catch (error) {
      reject(null)
      console.log(error);
    } finally {
      if (browser) {
        await browser.close();
      }
    }

  })
  return ks as string | null
}


export const getKsForBaseEntry = async () : Promise<string|null> => {
  console.log('Ks for baseEntry');
  const ks = await new Promise(async(resolve, reject)=>{
    const browser = await puppeteer.launch({
      headless: 'new',
      timeout: 20000,
      defaultViewport:null,
      ignoreHTTPSErrors: true,
      slowMo: 0,
      args: [
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-setuid-sandbox',
        '--no-first-run',
        '--no-sandbox',
        '--no-zygote',
        '--window-size=1280,720',
      ],
    });
    try {
      const page = await browser.newPage();
      await page.setRequestInterception(true);
      page.on('request', (interceptedRequest) => {
        const blockResources = ['stylesheet', 'image', 'media', 'font', ];
        if (blockResources.includes(interceptedRequest.resourceType())) {
          interceptedRequest.abort();
        } else {
          if(interceptedRequest.resourceType() == 'xhr' && interceptedRequest.url() == 'https://www.kaltura.com/api_v3/service/multirequest')
          {
            const data = interceptedRequest.postData()
            if(data){
              console.log(JSON.parse(data)['ks'])
              browser.close()
              resolve(JSON.parse(data)['ks'])
            }
          }
          interceptedRequest.continue();
        }
      });
  
      // Change the user agent of the scraper
      await page.setUserAgent(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36'
      );
  
      await page.goto('https://www.mycourseville.com/api/chulalogin');
  
      
      await page.waitForSelector('#username')
      await page.waitForSelector('#password')
      await page.waitForSelector('#cv-login-cvecologinbutton')
      await page.type('#username', process.env.MCV_ID as string)
      await page.type('#password', process.env.MCV_PASS as string)
      await page.click('#cv-login-cvecologinbutton')
      await page.goto('https://www.mycourseville.com/api/oauth/authorize?response_type=code&client_id=mycourseville.com&redirect_uri=https://www.mycourseville.com&scope=public')
      await page.goto('https://www.mycourseville.com/?q=courseville/course/45205/media_gallery')
      const ad = await page.$('#content > div')
      await page.goto('https://kaf.mycourseville.com/edit/1_fynbce8y')
      if(ad && await ad.evaluate(e=> e.textContent) == 'Access Denied') throw new Error('Access Denied')
      // await page.click('#channelActionsDropdownMenu > li:nth-child(2) > a')
      await new Promise(()=>{ setTimeout(() => {
        reject(null)
      }, 15000);})

    } catch (error) {
      reject(null)
      console.log(error);
    } finally {
  
      if (browser) {
        await browser.close();
      }
    }

  })
  return ks as string | null
}
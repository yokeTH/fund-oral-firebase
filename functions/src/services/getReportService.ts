export default async function getReportService(ks:string, videoId: string, pageIndex = 1) {
  const req = await fetch("https://www.kaltura.com/api_v3/service/multirequest?format=1", {
    method: "POST",
    headers: {
      "Host": "www.kaltura.com",
      "Pragma": "no-cache",
      "Accept": "application/json",
      "Sec-Fetch-Site": "cross-site",
      "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
      "Cache-Control": "no-cache",
      "Sec-Fetch-Mode": "cors",
      "Origin": "https://kaf.mycourseville.com",
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2.1 Safari/605.1.15",
      "Connection": "keep-alive",
      "Sec-Fetch-Dest": "empty",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "0": {
        "ks": ks,
        "service": "report",
        "action": "getTable",
        "reportType": "13",
        "reportInputFilter": {
          "objectType": "KalturaEndUserReportInputFilter",
          "fromDay": 20240101,
          "toDay": 20241231,
          "searchInTags": true,
          "searchInAdminTags": false,
          "entryIdIn": videoId,
        },
        "pager": {
          "objectType": "KalturaFilterPager",
          "pageSize": 500,
          "pageIndex": pageIndex,
        },
        "responseOptions": {
          "objectType": "KalturaReportResponseOptions",
          "delimiter": "|",
          "skipEmptyDates": false,
        },
      },
    }),
  });


  const res = await req.json();
  return res;
}

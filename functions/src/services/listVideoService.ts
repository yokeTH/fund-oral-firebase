export default async function listVideoService(ks:string) {
  const req = await fetch("https://www.kaltura.com/api_v3/service/multirequest?format=1", {
    method: "POST",
    headers: {
      "Host": "www.kaltura.com",
      "Pragma": "no-cache",
      "Accept": "*/*",
      "Sec-Fetch-Site": "cross-site",
      "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
      "Cache-Control": "no-cache",
      "Sec-Fetch-Mode": "cors",
      "Origin": "https://kaf.mycourseville.com",
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2.1 Safari/605.1.15",
      "Referer": "https://kaf.mycourseville.com/",
      "Sec-Fetch-Dest": "empty",
      "Connection": "close",
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      "0": {
        "service": "baseEntry",
        "action": "list",
        "ks": ks,
        "filter": {
          "categoriesFullNameIn": "LtiGeneric>site>channels>myCourseVille-3200106.01-2023-2",
        },
        "pager": {
          "pageSize": 500,
        },
      },
      "format": 1,
      "baseUrl": "https%3A%2F%2Fkaf.mycourseville.com%2Fuserreports%2Fdownloadreport%3Freport_id%3D",
    }),
  });


  const res = await req.json();
  return res;
}

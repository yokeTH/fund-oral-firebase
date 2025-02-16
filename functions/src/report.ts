import { onRequest } from "firebase-functions/v2/https"

export const report = onRequest(async (request, response)=>{
  switch (request.method) {
    case 'GET':
      // get(request, response)
      break
    case 'POST':
      // post(request, response)
      break
    default:
      break;
  }
})



// GET

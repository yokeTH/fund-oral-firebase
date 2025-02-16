import { PrismaClient } from "@prisma/client"
import { Response } from "firebase-functions/v1"
import { Request, onRequest } from "firebase-functions/v2/https"

export const student = onRequest({maxInstances:1, region:'asia-southeast1'},async (request, response)=>{
  switch (request.method) {
    case 'GET':
      get(request, response)
      break
    case 'POST':
      // post(request, response)
      break
    default:
      break;
  }
})



// GET
const get = async (request: Request, response: Response<any>)=> {
  const id = request.params[0]
  const prisma = new PrismaClient()

  const lastVersion = await prisma.update.findFirst({
    orderBy:{
      createAt: 'desc'
    },
    take: 1
  })

  if (!lastVersion) {
    response.send({error: true, message: 'internal server error (get student last)'});
    return;
  }

  const doc = await prisma.student.findFirst({
    where:{ id },
    include: {
      report: {
        where: {
          version: {
            id : lastVersion?.id
          }
        },
        include: {
          video : true
        }
      }
    }
  })
  if(doc)
    response.send({...doc, version: lastVersion.createAt})
  else
    response.send(null)
}
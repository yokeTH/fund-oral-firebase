import { PrismaClient } from "@prisma/client";
import { Response } from "firebase-functions/v1";
import { Request, onRequest } from "firebase-functions/v2/https";

export const video = onRequest({maxInstances:1, region:'asia-southeast1'},async (request, response)=>{
  switch (request.method) {
    case 'GET':
      await get(request, response)
      break
    case 'POST':
      await post(request, response)
      break
    case 'PUT':
      await put(request, response)
      break
    case 'DELETE':
      await deleteVideo(request, response)
      break
    default:
      break;
  }
})



// GET FUNCTION
const get = async (request: Request, response: Response<any>)=> {
  const id = request.params[0]

  const prisma = new PrismaClient();
  let doc;
  if(!id){
    doc = await prisma.video.findMany({})
  }else{
    doc = await prisma.video.findFirst({
      where: { id }
    })
  }


  response.send(doc)
}



// POST FUNCTION
const post = async (request: Request, response: Response<any>) => {
  const { id, title } : { id : string | string[], title : string} = request.body

  if(!id){
    response.send({error:true, message: 'ID body not found'})
    return
  }

  const prisma = new PrismaClient();

  if(typeof id == 'string'){
    const doc = await prisma.video.create({
      data:{
        id, title
      }
    })
    response.send(doc);
  }else{
    const doc = await prisma.video.createMany({
      data: id.map(e=>({id:e}))
    })
    response.send(doc);
  }

  response.send({error:true, message: 'something wrong'});
};



// PUT
const put = async (request: Request, response: Response<any>) => {
  const id = request.params[0]

  if(!id){
    response.send({error:true, message: 'ID param not found'})
    return
  }

  const prisma = new PrismaClient();
  const doc = await prisma.video.updateMany({
    where: { id },
    data: request.body
  })

  response.send(doc)
}




// DELETE
const deleteVideo = async (request: Request, response: Response<any>) => {
  const id = request.params[0]

  if(!id){
    response.send({error:true, message: 'ID param not found'})
    return
  }

  const prisma = new PrismaClient();
  // const doc = await prisma.video.delete({
  //   where: { id },
  // })

  response.send(await prisma.video.delete({
    where: { id },
  }))
}
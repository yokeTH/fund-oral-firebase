import { PrismaClient } from "@prisma/client";
import { onRequest } from "firebase-functions/v2/https";
import getReportService from "./services/getReportService";
import { getKsForBaseEntry, getKsForReport } from "./services/ks";
import { onSchedule } from "firebase-functions/v2/scheduler";
import listVideoService from "./services/listVideoService";
import { VideoFromKS } from "./types/video";

export const update = onRequest({region:'asia-southeast1', maxInstances: 1, memory: '4GiB', timeoutSeconds:300 },async (request, response)=>{
  const ksBaseEntry = await getKsForBaseEntry();
  if(!ksBaseEntry) throw new Error('KS BASE');
  const ks = await getKsForReport();

  if (!ks) {
    response.send({error: true, message: 'require ks query'});
    return;
  }

  // Check Ks
  const check = await getReportService(ks, '0')
  if(check[0].objectType == 'KalturaAPIException'){
    response.send({error: true, message: check[0].objectType});
    return;
  }


  const prisma = new PrismaClient();
  // const video = await prisma.video.findMany({});

  const video = (await listVideoService(ksBaseEntry))[0]['objects'] as VideoFromKS[]
  const version = await prisma.update.create({
    data: {
      description: "generate by manual request."
    },
  });



  await Promise.all(video.map(async (video)=>{
    const report = await getReportService(ks as string, video.id);
    // const createMany = await prisma.report.createMany({
    //   data: report[0].data.split(";").filter((e:string)=>(e!="")).map((l)=>{
    //     const [name, fullName, uniqueVideos, countPlays, sumTimeViewed, avgTimeViewed, avgViewDropOff, countLoads, loadPlayRatio, avgCompletionRate, countViral, totalCompletionRate] = l.split("|");
    //     return {}
    //   })
    // })
    if (report[0].data) {
      await Promise.all(report[0].data.split(";").filter((e:string)=>(e!="")).map((l:string)=>{

        const [name, fullName, uniqueVideos, countPlays, sumTimeViewed, avgTimeViewed, avgViewDropOff, countLoads, loadPlayRatio, avgCompletionRate, countViral, totalCompletionRate] = l.split("|");

        return prisma.report.create({
          data: {
            student: {
              connectOrCreate: {
                where: {id: name.split("@")[0]},
                create: {id: name.split("@")[0], fullname: fullName, section: ""},
              },
            },
            video: {
              connectOrCreate: {
                where: {id: video.id},
                create: {id: video.id, title: video.name}
              },
            },
            version: {
              connect: {
                id: version.id
              }
            },
            percentage: Number(totalCompletionRate),
            raw: {
              create: {
                name, fullName, uniqueVideos, countPlays, sumTimeViewed, avgTimeViewed, avgViewDropOff, countLoads, loadPlayRatio, avgCompletionRate, countViral, totalCompletionRate,
              },
            },
          },
        });

      }));
    }
  }));
  response.send("success");
})

export const scheduleUpdate = onSchedule({schedule: '0 12,23 * * *', region:'asia-southeast1', maxInstances: 1, memory: '4GiB', timeoutSeconds: 300, timeZone: 'Asia/Bangkok'}, async (event) => {
  const ks = await getKsForReport();

  if (!ks) {
    return;
  }


  const prisma = new PrismaClient();
  // const video = await prisma.video.findMany({});
  const ksBaseEntry = await getKsForBaseEntry();
  if(!ksBaseEntry) throw new Error('KS BASE');

  const video = (await listVideoService(ksBaseEntry))[0]['objects'] as VideoFromKS[]
  const version = await prisma.update.create({
    data: {
      description: `generate by schedule. [${event.scheduleTime}]`
    },
  });



  await Promise.all(video.map(async (video)=>{
    const report = await getReportService(ks as string, video.id);

    if (report[0].data) {
      await Promise.all(report[0].data.split(";").filter((e:string)=>(e!="")).map((l:string)=>{

        const [name, fullName, uniqueVideos, countPlays, sumTimeViewed, avgTimeViewed, avgViewDropOff, countLoads, loadPlayRatio, avgCompletionRate, countViral, totalCompletionRate] = l.split("|");

        return prisma.report.create({
          data: {
            student: {
              connectOrCreate: {
                where: {id: name.split("@")[0]},
                create: {id: name.split("@")[0], fullname: fullName, section: ""},
              },
            },
            video: {
              connectOrCreate: {
                where: {id: video.id},
                create: {id: video.id, title: video.name}
              },
            },
            version: {
              connect: {
                id: version.id
              }
            },
            percentage: Number(totalCompletionRate),
            raw: {
              create: {
                name, fullName, uniqueVideos, countPlays, sumTimeViewed, avgTimeViewed, avgViewDropOff, countLoads, loadPlayRatio, avgCompletionRate, countViral, totalCompletionRate,
              },
            },
          },
        });

      }));
    }
  }));
})
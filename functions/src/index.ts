/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { video } from "./video";
import { student } from "./student";
import { update } from "./update";
import { scheduleUpdate } from "./update";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = onRequest({maxInstances:1, region:'asia-southeast1'}, async (request, response) => {
  logger.info("Hello logs!", {structuredData: true});
  response.send("HELLO");
});



export { video, student, update, scheduleUpdate };
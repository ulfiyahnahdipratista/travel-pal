import { CreateSurvey, GetSurvey } from "../controller/survey.js";

export default [
  {
    method: "POST",
    path: "/survey",
    handler: CreateSurvey,
    options: {
      auth: "jwt",
    },
  },
  {
    method: "GET",
    path: "/survey",
    handler: GetSurvey,
    options: {
      auth: "jwt",
    },
  },
];

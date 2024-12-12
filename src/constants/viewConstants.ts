import { components } from "@/schemas/account-api";
import account from "../images/account.svg";
import admin from "../images/admin.svg";
import artifactory from "../images/artifactory.svg";
import billing from "../images/billing.svg";
import code from "../images/code.svg";
import compliance from "../images/compliance.svg";
import compute from "../images/compute.svg";
import database from "../images/database.svg";
import devops from "../images/devops.svg";
import disk from "../images/disk.svg";
import migrator from "../images/migrator.svg";
import networking from "../images/networking.svg";
import openshift from "../images/openshift.svg";
import outrunCloud from "../images/outrunCloud.svg";
import outrunDedicated from "../images/outrunDedicated.svg";
import outrunService from "../images/outrunService.svg";
import projects from "../images/projects.svg";
import question from "../images/question.svg";
import storage from "../images/storage.svg";
import support from "../images/support.svg";

type ServicesImages = {
  [index: string]: string;
};

export const servicesImages: ServicesImages = {
  account,
  admin,
  artifactory,
  code,
  compliance,
  compute,
  devops,
  disk,
  migrator,
  networking,
  openshift,
  projects,
  question,
  storage,
  support,
  billing,
  database,
  "outrun-cloud": outrunCloud,
  "outrun-dedicated": outrunDedicated,
  "outrun-service": outrunService,
};

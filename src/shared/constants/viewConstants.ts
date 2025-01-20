import account from "@/shared/images/account.svg";
import admin from "@/shared/images/admin.svg";
import artifactory from "@/shared/images/artifactory.svg";
import billing from "@/shared/images/billing.svg";
import code from "@/shared/images/code.svg";
import compliance from "@/shared/images/compliance.svg";
import compute from "@/shared/images/compute.svg";
import database from "@/shared/images/database.svg";
import devops from "@/shared/images/devops.svg";
import disk from "@/shared/images/disk.svg";
import migrator from "@/shared/images/migrator.svg";
import networking from "@/shared/images/networking.svg";
import openshift from "@/shared/images/openshift.svg";
import outrunCloud from "@/shared/images/outrunCloud.svg";
import outrunDedicated from "@/shared/images/outrunDedicated.svg";
import outrunService from "@/shared/images/outrunService.svg";
import projects from "@/shared/images/projects.svg";
import question from "@/shared/images/question.svg";
import storage from "@/shared/images/storage.svg";
import support from "@/shared/images/support.svg";

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

import account from '../images/account.svg';
import admin from '../images/admin.svg';
import artifactory from '../images/artifactory.svg';
import code from '../images/code.svg';
import compliance from '../images/compliance.svg';
import compute from '../images/compute.svg';
import devops from '../images/devops.svg';
import disk from '../images/disk.svg';
import migrator from '../images/migrator.svg';
import networking from '../images/networking.svg';
import openshift from '../images/openshift.svg';
import projects from '../images/projects.svg';
import question from '../images/question.svg';
import storage from '../images/storage.svg';

export const errorTranslations = {
  ru: {
    notAvailable: 'Сервис недоступен в этой локации. Пожалуйста, выберите другую.',
    wrong: 'Что-то пошло не так. Пожалуйста, попробуте позже.',
    noAccess: 'Недостаточно прав.'
  },
  en: {
    notAvailable: 'The service is not available in this location. Please choose another location.',
    wrong: 'Something went wrong. Please try again later.',
    noAccess: 'You don\'t have enough rights.'
  }
};

export const langs = [{
  text: 'Русский',
  value: 'ru'
},
{
  text: 'English',
  value: 'en'
}];

export const servicesImages = {
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
  storage
}

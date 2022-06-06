/* eslint-disable eqeqeq */
/* eslint-disable prettier/prettier */
"use strict";

import Investment from "App/Models/Investment";
import Setting from "App/Models/Setting";
import PuppeteerServices from "App/Services/PuppeteerServices";
import { DateTime } from "luxon";

// import { createRequire } from 'module'
// @ts-ignore
// const require = createRequire(import.meta.url)
// import Tax from "App/Models/Tax"
// const Tax = require('App/Models/Tax.ts')

// import { string } from '@ioc:Adonis/Core/Helpers'
// const string = require('@ioc:Adonis/Core/Helpers')
// import { DateTime } from 'luxon'
// const { DateTime } = require('luxon')
// const {DateTime} = Luxon
// import Env from '@ioc:Adonis/Core/Env'
const Env = require("@ioc:Adonis/Core/Env");
const axios = require("axios").default;
// const JSJoda = require('js-joda')
// const LocalDate = JSJoda.LocalDate
// const Moment = require('moment')
const API_URL = Env.get("API_URL");




export {

};

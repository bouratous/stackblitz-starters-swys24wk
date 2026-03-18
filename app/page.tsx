"use client";

import { useState, useMemo, useRef } from "react";

type Lang = "fr" | "en";

const T = {
  fr: {
    calcTitle: "Calculateur",
    calcSubtitle: "Barèmes 2026",
    grossToNet: "Brut → Net",
    netToGross: "Net → Brut",
    grossLabel: "Salaire brut",
    netLabel: "Salaire net souhaité",
    necessaryGross: "Brut nécessaire",
    displayCurrency: "💱 DEVISE D&apos;AFFICHAGE",
    fixed: "🔒 Fixée",
    auto: "🔓 Auto",
    workParams: "⏱ PARAMÈTRES DE TRAVAIL",
    monthsWorked: "Mois travaillés / an",
    hoursPerWeek: "Heures / semaine",
    legal: "⚖️ légal",
    lock: "🔒", unlock: "🔓",
    state: "État", canton: "Canton",
    displayBy: "Afficher par",
    options: "⚙️ Options",
    periods: ["Annuel","Mensuel","Hebdo","Jour","Heure"],
    netSaved: "conservé",
    effectiveRate: "Taux effectif",
    deductions: "de prélèvements",
    fiscalBreakdown: "Décomposition fiscale",
    grossSalary: "Salaire brut",
    netSalary: "Salaire net",
    employerCost: "Coût employeur",
    intlComparison: "Comparaison internationale",
    netTarget: "Net cible",
    sameGross: "Même brut · net en",
    betterCol: "⬇ moins c&apos;est mieux",
    rank: "référence",
    disclaimer: "Célibataire sans enfant, sans régimes spéciaux. Cliquez pour sélectionner.",
    chooseCountry: "Choisir un pays",
    calculator: "Calculateur",
    results: "Résultats",
    bonus: (n: number) => n > 12 ? `+${n-12} bonus` : `${n} mois`,
    exRate: (f: string, r: string, t: string) => `1 ${f} = ${r} ${t}`,
  },
  en: {
    calcTitle: "Calculator",
    calcSubtitle: "2026 Tax Rates",
    grossToNet: "Gross → Net",
    netToGross: "Net → Gross",
    grossLabel: "Gross salary",
    netLabel: "Desired net salary",
    necessaryGross: "Required gross",
    displayCurrency: "💱 DISPLAY CURRENCY",
    fixed: "🔒 Fixed",
    auto: "🔓 Auto",
    workParams: "⏱ WORK PARAMETERS",
    monthsWorked: "Months worked / year",
    hoursPerWeek: "Hours / week",
    legal: "⚖️ legal",
    lock: "🔒", unlock: "🔓",
    state: "State", canton: "Canton",
    displayBy: "Display by",
    options: "⚙️ Options",
    periods: ["Annual","Monthly","Weekly","Daily","Hourly"],
    netSaved: "kept",
    effectiveRate: "Effective rate",
    deductions: "in deductions",
    fiscalBreakdown: "Tax breakdown",
    grossSalary: "Gross salary",
    netSalary: "Net salary",
    employerCost: "Employer cost",
    intlComparison: "International comparison",
    netTarget: "Net target",
    sameGross: "Same gross · net in",
    betterCol: "⬇ lower is better",
    rank: "reference",
    disclaimer: "Single, no children, no special regimes. Click to select.",
    chooseCountry: "Choose a country",
    calculator: "Calculator",
    results: "Results",
    bonus: (n: number) => n > 12 ? `+${n-12} bonus` : `${n} months`,
    exRate: (f: string, r: string, t: string) => `1 ${f} = ${r} ${t}`,
  },
} as const;

const US_STATES: Record<string,{name:string;rate:number}> = {
  AL:{name:"Alabama",rate:0.05},AK:{name:"Alaska",rate:0},AZ:{name:"Arizona",rate:0.025},
  AR:{name:"Arkansas",rate:0.047},CA:{name:"California",rate:0.093},CO:{name:"Colorado",rate:0.044},
  CT:{name:"Connecticut",rate:0.0699},DE:{name:"Delaware",rate:0.066},FL:{name:"Florida",rate:0},
  GA:{name:"Georgia",rate:0.055},HI:{name:"Hawaii",rate:0.11},ID:{name:"Idaho",rate:0.058},
  IL:{name:"Illinois",rate:0.0495},IN:{name:"Indiana",rate:0.0305},IA:{name:"Iowa",rate:0.06},
  KS:{name:"Kansas",rate:0.057},KY:{name:"Kentucky",rate:0.045},LA:{name:"Louisiana",rate:0.0425},
  ME:{name:"Maine",rate:0.075},MD:{name:"Maryland",rate:0.0575},MA:{name:"Massachusetts",rate:0.09},
  MI:{name:"Michigan",rate:0.0425},MN:{name:"Minnesota",rate:0.0985},MS:{name:"Mississippi",rate:0.05},
  MO:{name:"Missouri",rate:0.048},MT:{name:"Montana",rate:0.059},NE:{name:"Nebraska",rate:0.0664},
  NV:{name:"Nevada",rate:0},NH:{name:"New Hampshire",rate:0.04},NJ:{name:"New Jersey",rate:0.1075},
  NM:{name:"New Mexico",rate:0.059},NY:{name:"New York",rate:0.109},NC:{name:"North Carolina",rate:0.0475},
  ND:{name:"North Dakota",rate:0.0295},OH:{name:"Ohio",rate:0.0399},OK:{name:"Oklahoma",rate:0.0475},
  OR:{name:"Oregon",rate:0.099},PA:{name:"Pennsylvania",rate:0.0307},RI:{name:"Rhode Island",rate:0.0599},
  SC:{name:"South Carolina",rate:0.07},SD:{name:"South Dakota",rate:0},TN:{name:"Tennessee",rate:0},
  TX:{name:"Texas",rate:0},UT:{name:"Utah",rate:0.0485},VT:{name:"Vermont",rate:0.0875},
  VA:{name:"Virginia",rate:0.0575},WA:{name:"Washington",rate:0},WV:{name:"West Virginia",rate:0.065},
  WI:{name:"Wisconsin",rate:0.0765},WY:{name:"Wyoming",rate:0},
};

const CH_CANTONS: Record<string,{name:string;rate:number}> = {
  ZH:{name:"Zurich",rate:0.13},BE:{name:"Bern",rate:0.165},LU:{name:"Lucerne",rate:0.115},
  UR:{name:"Uri",rate:0.075},SZ:{name:"Schwyz",rate:0.08},OW:{name:"Obwalden",rate:0.095},
  NW:{name:"Nidwalden",rate:0.085},GL:{name:"Glarus",rate:0.10},ZG:{name:"Zug",rate:0.065},
  FR:{name:"Fribourg",rate:0.155},SO:{name:"Solothurn",rate:0.135},BS:{name:"Basel-City",rate:0.195},
  BL:{name:"Basel-Country",rate:0.155},SH:{name:"Schaffhausen",rate:0.115},AR:{name:"App. Rh-E",rate:0.10},
  AI:{name:"App. Rh-I",rate:0.085},SG:{name:"St. Gallen",rate:0.12},GR:{name:"Graubünden",rate:0.115},
  AG:{name:"Aargau",rate:0.105},TG:{name:"Thurgau",rate:0.115},TI:{name:"Ticino",rate:0.15},
  VD:{name:"Vaud",rate:0.155},VS:{name:"Valais",rate:0.135},NE:{name:"Neuchâtel",rate:0.165},
  GE:{name:"Geneva",rate:0.175},JU:{name:"Jura",rate:0.16},
};

type Opt = {id:string;label:string;labelEn:string;type:"toggle"|"select";choices?:string[];choicesEn?:string[];default?:string};
const COUNTRY_OPTIONS: Record<string,Opt[]> = {
  FR:[{id:"cadre",label:"Statut cadre",labelEn:"Executive status",type:"toggle"},{id:"contract",label:"Contrat",labelEn:"Contract",type:"select",choices:["CDI","CDD","Intérim","Apprenti"],choicesEn:["CDI","CDD","Interim","Apprentice"],default:"CDI"},{id:"family",label:"Situation familiale",labelEn:"Family status",type:"select",choices:["Célibataire","Marié(e)","Marié(e) + 1 enfant","Marié(e) + 2 enfants","Marié(e) + 3 enfants"],choicesEn:["Single","Married","Married + 1 child","Married + 2 children","Married + 3 children"],default:"Célibataire"}],
  DE:[{id:"class",label:"Classe fiscale",labelEn:"Tax class",type:"select",choices:["Classe I","Classe III","Classe IV","Classe V"],choicesEn:["Class I","Class III","Class IV","Class V"],default:"Classe I"},{id:"church",label:"Taxe église",labelEn:"Church tax",type:"toggle"},{id:"children",label:"Enfants",labelEn:"Children",type:"select",choices:["0","1","2","3+"],choicesEn:["0","1","2","3+"],default:"0"}],
  GB:[{id:"scotland",label:"Résidence Écosse",labelEn:"Scottish resident",type:"toggle"},{id:"student",label:"Prêt étudiant",labelEn:"Student loan",type:"select",choices:["Aucun","Plan 1","Plan 2","Plan 4"],choicesEn:["None","Plan 1","Plan 2","Plan 4"],default:"Aucun"},{id:"pension",label:"Retraite",labelEn:"Pension",type:"select",choices:["0%","3%","5%","8%"],choicesEn:["0%","3%","5%","8%"],default:"0%"}],
  IE:[{id:"credits",label:"Crédits d'impôt",labelEn:"Tax credits",type:"select",choices:["Standard","Marié(e) PAYE","Monoparental","Personne âgée"],choicesEn:["Standard","Married PAYE","Single parent","Elderly"],default:"Standard"},{id:"contract",label:"Statut",labelEn:"Status",type:"select",choices:["PAYE (salarié)","Indépendant"],choicesEn:["PAYE (employee)","Self-employed"],default:"PAYE (salarié)"}],
  IT:[{id:"family",label:"Situation familiale",labelEn:"Family status",type:"select",choices:["Célibataire","Marié(e)","Marié(e) + 1 enfant","Marié(e) + 2 enfants"],choicesEn:["Single","Married","Married + 1 child","Married + 2 children"],default:"Célibataire"},{id:"region",label:"Addizionale regionale",labelEn:"Regional surtax",type:"toggle"}],
  ES:[{id:"beckham",label:"Loi Beckham (expatrié 24%)",labelEn:"Beckham Law (expat 24%)",type:"toggle"},{id:"family",label:"Situation familiale",labelEn:"Family status",type:"select",choices:["Célibataire","Marié(e)","Famille nombreuse"],choicesEn:["Single","Married","Large family"],default:"Célibataire"},{id:"disability",label:"Handicap reconnu",labelEn:"Registered disability",type:"toggle"}],
  PT:[{id:"irs",label:"Situation IRS",labelEn:"IRS status",type:"select",choices:["Célibataire","Marié(e) 1 titulaire","Marié(e) 2 titulaires"],choicesEn:["Single","Married 1 earner","Married 2 earners"],default:"Célibataire"},{id:"nhr",label:"Statut RNH (20%)",labelEn:"NHR status (20%)",type:"toggle"}],
  NL:[{id:"30rule",label:"Règle 30% expatriés",labelEn:"30% expat ruling",type:"toggle"},{id:"aow",label:"Âge AOW ≥67 ans",labelEn:"AOW age ≥67",type:"toggle"}],
  BE:[{id:"family",label:"Situation familiale",labelEn:"Family status",type:"select",choices:["Isolé","Marié(e)"],choicesEn:["Single","Married"],default:"Isolé"},{id:"region",label:"Région",labelEn:"Region",type:"select",choices:["Bruxelles","Flandre","Wallonie"],choicesEn:["Brussels","Flanders","Wallonia"],default:"Bruxelles"}],
  LU:[{id:"impatrie",label:"Régime impatrié (50%)",labelEn:"Impatriate regime (50%)",type:"toggle"}],
  US:[{id:"filing",label:"Situation fiscale",labelEn:"Filing status",type:"select",choices:["Single","Married jointly","Head of household"],choicesEn:["Single","Married jointly","Head of household"],default:"Single"},{id:"401k",label:"401(k)",labelEn:"401(k)",type:"select",choices:["0%","3%","6%","10%"],choicesEn:["0%","3%","6%","10%"],default:"0%"}],
  CA:[{id:"province",label:"Province",labelEn:"Province",type:"select",choices:["Ontario","Québec","Colombie-Brit.","Alberta"],choicesEn:["Ontario","Quebec","British Col.","Alberta"],default:"Ontario"},{id:"rrsp",label:"REER",labelEn:"RRSP",type:"select",choices:["0%","5%","10%","18%"],choicesEn:["0%","5%","10%","18%"],default:"0%"}],
  CH:[{id:"married",label:"Marié(e)",labelEn:"Married",type:"toggle"},{id:"pillar2",label:"2e pilier LPP",labelEn:"2nd pillar LPP",type:"select",choices:["6%","9%","12%","15%"],choicesEn:["6%","9%","12%","15%"],default:"9%"}],
  AU:[{id:"resident",label:"Résident fiscal",labelEn:"Tax resident",type:"toggle"},{id:"help",label:"Remboursement HELP",labelEn:"HELP repayment",type:"toggle"}],
  SE:[{id:"expert",label:"Règle expert étranger",labelEn:"Foreign expert rule",type:"toggle"}],
  JP:[{id:"dependent",label:"Personnes à charge",labelEn:"Dependents",type:"select",choices:["0","1","2","3+"],choicesEn:["0","1","2","3+"],default:"0"}],
  SG:[{id:"relief",label:"CPF Relief",labelEn:"CPF Relief",type:"toggle"},{id:"nsr",label:"Non-résident 15%",labelEn:"Non-resident 15%",type:"toggle"}],
  PL:[{id:"young",label:"Exonération jeune (<26 ans)",labelEn:"Youth exemption (<26)",type:"toggle"}],
  RO:[{id:"it",label:"Exonération IT (0% IR)",labelEn:"IT exemption (0% tax)",type:"toggle"}],
  DK:[],NO:[],FI:[],AT:[],CZ:[],HU:[],AE:[],
};

interface TaxLine { label: string; amount: number; isCredit?: boolean; }
interface CalcResult { net: number; socialEmployee: number; tax: number; socialEmployer: number; lines: TaxLine[]; }
interface Country { nameFr: string; nameEn: string; flag: string; currency: string; symbol: string; hasRegion?: boolean; calc: (g: number, r?: string, o?: Record<string,string|boolean>) => CalcResult; }
type B = [number, number];
function cb(t: number, b: B[]): number { let x=0,p=0; for(const [l,r] of b){if(t>p){x+=(Math.min(t,l)-p)*r;p=l;}} return Math.max(0,x); }
function netToGross(tgt: number, fn: (g:number)=>{net:number}): number {
  let lo=tgt,hi=tgt*3;
  for(let i=0;i<60;i++){const m=(lo+hi)/2;if(fn(m).net<tgt)lo=m;else hi=m;if(hi-lo<1)break;}
  return (lo+hi)/2;
}

const COUNTRIES: Record<string,Country> = {
  FR:{nameFr:"France",nameEn:"France",flag:"🇫🇷",currency:"EUR",symbol:"€",calc:(g,_r,o={})=>{
    const imp=o.impatrie===true,tg=imp?g*0.70:g,cadre=o.cadre===true;
    const sr=cadre?0.2482:(o.contract==="Apprenti"||o.contract==="Apprentice")?0:0.2282,s=tg*sr;
    const pm=({"Célibataire":1,"Single":1,"Marié(e)":2,"Married":2,"Marié(e) + 1 enfant":2.5,"Married + 1 child":2.5,"Marié(e) + 2 enfants":3,"Married + 2 children":3,"Marié(e) + 3 enfants":4,"Married + 3 children":4} as Record<string,number>)[o.family as string||"Célibataire"]||1;
    const ir=Math.max(0,cb((tg-s)*0.9/pm,[[11520,0],[30180,0.11],[86050,0.30],[185220,0.41],[Infinity,0.45]])*pm);
    return{net:g-s-ir,socialEmployee:s,tax:ir,socialEmployer:g*0.45,lines:[...(imp?[{label:"Expat exemption (30%)",amount:g*0.30,isCredit:true}]:[]),{label:`${cadre?"Exec":"Employee"} contributions`,amount:s},{label:"Income tax",amount:ir}]};
  }},
  DE:{nameFr:"Allemagne",nameEn:"Germany",flag:"🇩🇪",currency:"EUR",symbol:"€",calc:(g,_r,o={})=>{
    const s=g*0.2005,tb=g-s;let ir=0;
    if(tb>277826)ir=tb*0.45-18307;else if(tb>68430)ir=tb*0.42-10602;
    else if(tb>17006){const z=(tb-17006)/10000;ir=(192.59*z+2397)*z+966;}
    else if(tb>12672){const y=(tb-12672)/10000;ir=(979.18*y+1400)*y;}
    const cls=o.class as string||"";
    if(cls.includes("III"))ir*=0.72;if(cls.includes("V"))ir*=1.25;
    ir=Math.max(0,ir-parseInt(o.children as string||"0")*3336);
    const soli=ir>18816?ir*0.055:0,kirche=o.church===true?ir*0.09:0;
    return{net:g-s-ir-soli-kirche,socialEmployee:s,tax:ir+soli+kirche,socialEmployer:g*0.2005,lines:[{label:"Sozialversicherung",amount:s},{label:"Einkommensteuer",amount:ir},...(soli>0?[{label:"Solidaritätszuschlag",amount:soli}]:[]),...(kirche>0?[{label:"Kirchensteuer",amount:kirche}]:[])].filter(l=>l.amount>0)};
  }},
  GB:{nameFr:"Royaume-Uni",nameEn:"United Kingdom",flag:"🇬🇧",currency:"GBP",symbol:"£",calc:(g,_r,o={})=>{
    const pen=parseFloat((o.pension as string||"0%").replace("%",""))/100,gp=Math.max(0,g-g*pen);
    const ni=gp>12570?(Math.min(gp,50270)-12570)*0.08+Math.max(0,gp-50270)*0.02:0,tb=Math.max(0,gp-12570);
    let ir=0;
    if(o.scotland===true)ir=cb(tb,[[2827,0.19],[15397,0.20],[28383,0.21],[76500,0.42],[125140,0.45],[Infinity,0.48]]);
    else{ir=Math.min(tb,37700)*0.20+Math.min(Math.max(0,tb-37700),87440)*0.40+Math.max(0,tb-125140)*0.45;if(gp>100000)ir+=Math.min(gp-100000,25140)*0.20;}
    const sl=(o.student==="Plan 1"||o.student==="Plan 1")&&g>26065?(g-26065)*0.09:(o.student==="Plan 2")&&g>28470?(g-28470)*0.09:0;
    return{net:g-ni-ir-sl-g*pen,socialEmployee:ni+sl,tax:ir,socialEmployer:g*0.15,lines:[{label:"National Insurance",amount:ni},{label:`Income Tax${o.scotland===true?" (Scotland)":""}`,amount:ir},...(sl>0?[{label:"Student Loan",amount:sl}]:[]),...(pen>0?[{label:"Pension",amount:g*pen}]:[])].filter(l=>l.amount>0)};
  }},
  IE:{nameFr:"Irlande",nameEn:"Ireland",flag:"🇮🇪",currency:"EUR",symbol:"€",calc:(g,_r,o={})=>{
    const self=o.contract==="Indépendant"||o.contract==="Self-employed",prsi=g>18304?g*0.04:0;
    const usc=g>13000?(Math.min(g,12012)*0.005+Math.min(Math.max(0,g-12012),13748)*0.02+Math.min(Math.max(0,g-25760),49028)*0.04+Math.max(0,g-74788)*0.08):g*0.005;
    const cm:Record<string,number>={"Standard":3750,"Marié(e) PAYE":7500,"Married PAYE":7500,"Monoparental":5500,"Single parent":5500,"Personne âgée":3995,"Elderly":3995};
    const cred=(cm[o.credits as string||"Standard"]||3750)+(self?1850:0);
    const ir=Math.max(0,Math.min(g,46000)*0.20+Math.max(0,g-46000)*0.40-cred);
    return{net:g-prsi-usc-ir,socialEmployee:prsi+usc,tax:ir,socialEmployer:g*0.111,lines:[{label:"Income Tax (20/40%)",amount:Math.min(g,46000)*0.20+Math.max(0,g-46000)*0.40},{label:"Tax credits",amount:cred,isCredit:true},{label:"USC",amount:usc},{label:"PRSI (4%)",amount:prsi}]};
  }},
  IT:{nameFr:"Italie",nameEn:"Italy",flag:"🇮🇹",currency:"EUR",symbol:"€",calc:(g,_r,o={})=>{
    const s=g*0.0919,f=o.family as string||"";
    let ir=cb(g-s,[[15000,0.23],[28000,0.25],[50000,0.35],[Infinity,0.43]]);
    if(f.includes("2 child")||f.includes("2 enfants"))ir-=1900;else if(f.includes("1 child")||f.includes("1 enfant"))ir-=950;
    if((f.includes("Marié")||f.includes("Married"))&&!f.includes("child")&&!f.includes("enfant"))ir-=800;
    const add=o.region===true?g*0.015:0;
    return{net:g-s-Math.max(0,ir)-add,socialEmployee:s,tax:Math.max(0,ir)+add,socialEmployer:g*0.30,lines:[{label:"Contributi INPS",amount:s},{label:"IRPEF",amount:Math.max(0,ir)},...(add>0?[{label:"Regional surtax",amount:add}]:[])].filter(l=>l.amount>0)};
  }},
  ES:{nameFr:"Espagne",nameEn:"Spain",flag:"🇪🇸",currency:"EUR",symbol:"€",calc:(g,_r,o={})=>{
    const s=g*0.0635;
    if(o.beckham===true){const ir=Math.min(g,600000)*0.24+Math.max(0,g-600000)*0.47;return{net:g-s-ir,socialEmployee:s,tax:ir,socialEmployer:g*0.298,lines:[{label:"Seguridad Social",amount:s},{label:"IRPF Ley Beckham",amount:ir}]};}
    const ded=2000+(o.disability===true?3500:0),fam=o.family as string||"";
    const ir=Math.max(0,cb(Math.max(0,g-s-ded),[[12450,0.19],[20200,0.24],[35200,0.30],[60000,0.37],[300000,0.45],[Infinity,0.47]])-((fam==="Marié(e)"||fam==="Married")?3400:(fam==="Famille nombreuse"||fam==="Large family")?3600:0));
    return{net:g-s-ir,socialEmployee:s,tax:ir,socialEmployer:g*0.298,lines:[{label:"Seguridad Social",amount:s},{label:"IRPF",amount:ir}]};
  }},
  PT:{nameFr:"Portugal",nameEn:"Portugal",flag:"🇵🇹",currency:"EUR",symbol:"€",calc:(g,_r,o={})=>{
    const s=g*0.11;
    if(o.nhr===true){const ir=g*0.20;return{net:g-s-ir,socialEmployee:s,tax:ir,socialEmployer:g*0.2375,lines:[{label:"Segurança Social",amount:s},{label:"IRS NHR (20%)",amount:ir}]};}
    let ir=cb(g-s,[[7703,0.1325],[11623,0.18],[16472,0.23],[21321,0.26],[27146,0.3275],[39791,0.37],[51997,0.435],[81199,0.45],[Infinity,0.48]]);
    if((o.irs as string||"").includes("2"))ir*=0.95;
    return{net:g-s-ir,socialEmployee:s,tax:ir,socialEmployer:g*0.2375,lines:[{label:"Segurança Social",amount:s},{label:"IRS",amount:ir}]};
  }},
  NL:{nameFr:"Pays-Bas",nameEn:"Netherlands",flag:"🇳🇱",currency:"EUR",symbol:"€",calc:(g,_r,o={})=>{
    const tg=o["30rule"]===true?g*0.70:g;
    const raw=tg<=38441?tg*0.3693:38441*0.3693+(tg-38441)*(o.aow===true?0.195:0.495);
    const ir=Math.max(0,raw-Math.min(5174,tg*0.229)-(tg<25000?3362:Math.max(0,3362-(tg-25000)*0.0633)));
    return{net:g-ir,socialEmployee:0,tax:ir,socialEmployer:g*0.19,lines:[{label:"Inkomstenbelasting + premies",amount:ir}]};
  }},
  BE:{nameFr:"Belgique",nameEn:"Belgium",flag:"🇧🇪",currency:"EUR",symbol:"€",calc:(g,_r,o={})=>{
    const s=g*0.1307,married=o.family==="Marié(e)"||o.family==="Married";
    let ir=Math.max(0,cb(g-s,[[15820,0.25],[27920,0.40],[48320,0.45],[Infinity,0.50]])-9270*0.25-(married?4070:0));
    const reg=o.region as string||"";
    const addRate=({"Bruxelles":0.079,"Brussels":0.079,"Flandre":0.066,"Flanders":0.066,"Wallonie":0.073,"Wallonia":0.073} as Record<string,number>)[reg]||0.079;
    return{net:g-s-ir-ir*addRate,socialEmployee:s,tax:ir+ir*addRate,socialEmployer:g*0.27,lines:[{label:"ONSS",amount:s},{label:"Withholding tax",amount:ir},{label:"Municipal surtax",amount:ir*addRate}]};
  }},
  LU:{nameFr:"Luxembourg",nameEn:"Luxembourg",flag:"🇱🇺",currency:"EUR",symbol:"€",calc:(g,_r,o={})=>{
    const s=g*0.1245,imp=o.impatrie===true?Math.min(g*0.50,400000):0;
    const ir=cb(g-s-imp,[[12438,0],[22878,0.08],[24939,0.10],[27090,0.12],[29241,0.14],[31392,0.16],[33543,0.18],[35694,0.20],[37845,0.22],[39996,0.24],[42147,0.26],[44298,0.28],[46449,0.30],[48600,0.32],[50751,0.34],[110403,0.38],[165600,0.39],[Infinity,0.42]]);
    return{net:g-s-ir,socialEmployee:s,tax:ir,socialEmployer:g*0.12,lines:[...(imp>0?[{label:"Impatriate regime (50%)",amount:imp,isCredit:true}]:[]),{label:"Social contributions",amount:s},{label:"Income tax",amount:ir}]};
  }},
  CH:{nameFr:"Suisse",nameEn:"Switzerland",flag:"🇨🇭",currency:"CHF",symbol:"CHF",hasRegion:true,calc:(g,canton="ZH",o={})=>{
    const s=g*0.065,lpp=g*parseFloat((o.pillar2 as string||"9%").replace("%",""))/100;
    const ir=Math.max(0,g-s-lpp)*(CH_CANTONS[canton]?.rate??0.13)*(o.married===true?0.85:1);
    return{net:g-s-lpp-ir,socialEmployee:s+lpp,tax:ir,socialEmployer:g*0.065,lines:[{label:"AVS/AI/APG (6.5%)",amount:s},{label:"LPP 2nd pillar",amount:lpp},{label:`Cantonal tax (${canton})`,amount:ir}]};
  }},
  US:{nameFr:"États-Unis",nameEn:"United States",flag:"🇺🇸",currency:"USD",symbol:"$",hasRegion:true,calc:(g,st="CA",o={})=>{
    const k4=parseFloat((o["401k"] as string||"0%").replace("%",""))/100,tg=Math.max(0,g-g*k4);
    const fica=Math.min(tg,176100)*0.062+tg*0.0145;
    const fil=o.filing as string||"Single",ded=fil==="Married jointly"?30000:fil==="Head of household"?22500:15000,tb=Math.max(0,tg-ded);
    let ir=0;
    if(fil==="Married jointly")ir=cb(tb,[[24300,0.10],[98950,0.12],[210750,0.22],[402200,0.24],[510300,0.32],[765600,0.35],[Infinity,0.37]]);
    else if(fil==="Head of household")ir=cb(tb,[[17300,0.10],[66050,0.12],[105450,0.22],[201050,0.24],[248350,0.32],[621900,0.35],[Infinity,0.37]]);
    else ir=cb(tb,[[12150,0.10],[49475,0.12],[105450,0.22],[201050,0.24],[248350,0.32],[621900,0.35],[Infinity,0.37]]);
    const stax=tg*(US_STATES[st]?.rate??0);
    return{net:g-fica-ir-stax-g*k4,socialEmployee:fica,tax:ir+stax,socialEmployer:g*0.0765,lines:[{label:"Federal Income Tax",amount:ir},{label:`State Tax (${st})`,amount:stax},{label:"FICA",amount:fica},...(k4>0?[{label:"401(k)",amount:g*k4}]:[])].filter(l=>l.amount>0)};
  }},
  CA:{nameFr:"Canada",nameEn:"Canada",flag:"🇨🇦",currency:"CAD",symbol:"CAD",calc:(g,_r,o={})=>{
    const rr=Math.min(g*parseFloat((o.rrsp as string||"0%").replace("%",""))/100,32490),tg=Math.max(0,g-rr);
    const cpp=Math.min(Math.max(0,tg-3500),68500)*0.0595,cpp2=Math.min(Math.max(0,tg-68500),4510)*0.04,ei=Math.min(tg,65700)*0.01666;
    const tb=Math.max(0,tg-16129),fed=cb(tb,[[57375,0.15],[114750,0.205],[159405,0.26],[221708,0.29],[Infinity,0.33]]);
    const prov=o.province as string||"Ontario";
    const provRate=({"Ontario":0.0965,"Québec":0.14,"Quebec":0.14,"Colombie-Brit.":0.119,"British Col.":0.119,"Alberta":0.10} as Record<string,number>)[prov]||0.0965;
    return{net:g-cpp-cpp2-ei-fed-tb*provRate-rr,socialEmployee:cpp+cpp2+ei,tax:fed+tb*provRate,socialEmployer:g*0.0811,lines:[{label:"Federal Income Tax",amount:fed},{label:"Provincial Tax",amount:tb*provRate},{label:"CPP + EI",amount:cpp+cpp2+ei},...(rr>0?[{label:"RRSP",amount:rr}]:[])].filter(l=>l.amount>0)};
  }},
  AU:{nameFr:"Australie",nameEn:"Australia",flag:"🇦🇺",currency:"AUD",symbol:"AUD",calc:(g,_r,o={})=>{
    const res=o.resident!==false,med=res&&g>26000?g*0.02:0;let ir=0;
    if(res){if(g>180000)ir=51667+(g-180000)*0.45;else if(g>135000)ir=31288+(g-135000)*0.37;else if(g>45000)ir=5092+(g-45000)*0.325;else if(g>18200)ir=(g-18200)*0.19;}
    else ir=g<=135000?g*0.325:43875+(g-135000)*0.37;
    let help=0;
    if(o.help===true){if(g>148664)help=g*0.10;else if(g>119882)help=g*0.085;else if(g>107896)help=g*0.075;else if(g>88524)help=g*0.065;}
    return{net:g-ir-med-help,socialEmployee:med+help,tax:ir,socialEmployer:g*0.115,lines:[{label:"Income Tax",amount:ir},{label:"Medicare Levy",amount:med},...(help>0?[{label:"HELP",amount:help}]:[])].filter(l=>l.amount>0)};
  }},
  SE:{nameFr:"Suède",nameEn:"Sweden",flag:"🇸🇪",currency:"SEK",symbol:"SEK",calc:(g,_r,o={})=>{
    const s=g*0.07,tg=o.expert===true?g*0.75:g,ir=cb(tg-s,[[614000,0.32],[Infinity,0.52]]);
    return{net:g-s-ir,socialEmployee:s,tax:ir,socialEmployer:g*0.3142,lines:[{label:"Pensionsavgift (7%)",amount:s},{label:"Inkomstskatt",amount:ir},...(o.expert===true?[{label:"Expert tax relief",amount:g*0.25,isCredit:true}]:[])].filter(l=>l.amount>0||l.isCredit)};
  }},
  DK:{nameFr:"Danemark",nameEn:"Denmark",flag:"🇩🇰",currency:"DKK",symbol:"DKK",calc:(g)=>{
    const am=g*0.08,tb=g-am;
    const ir=Math.min(Math.max(0,tb-49700)*0.1208+Math.max(0,tb-588900)*0.15+tb*0.2507,tb*0.527);
    return{net:g-am-ir,socialEmployee:am,tax:ir,socialEmployer:0,lines:[{label:"AM-bidrag (8%)",amount:am},{label:"Bundskat + kommuneskat",amount:ir}]};
  }},
  NO:{nameFr:"Norvège",nameEn:"Norway",flag:"🇳🇴",currency:"NOK",symbol:"NOK",calc:(g)=>{
    const trygd=g*0.079,tb=Math.max(0,g-73000);
    const ir=tb*0.22+Math.max(0,g-208050)*0.017+Math.max(0,g-292850)*0.04+Math.max(0,g-670000)*0.136+Math.max(0,g-937900)*0.166;
    return{net:g-trygd-ir,socialEmployee:trygd,tax:ir,socialEmployer:g*0.141,lines:[{label:"Trygdeavgift (7.9%)",amount:trygd},{label:"Inntektsskatt",amount:ir}]};
  }},
  FI:{nameFr:"Finlande",nameEn:"Finland",flag:"🇫🇮",currency:"EUR",symbol:"€",calc:(g)=>{
    const s=g*0.0855,ir=cb(g-s,[[19900,0],[30000,0.0625],[50000,0.1763],[80000,0.2163],[Infinity,0.3163]]),mun=g*0.21;
    return{net:g-s-ir-mun,socialEmployee:s,tax:ir+mun,socialEmployer:g*0.20,lines:[{label:"Social contributions",amount:s},{label:"National income tax",amount:ir},{label:"Municipal tax (~21%)",amount:mun}]};
  }},
  AT:{nameFr:"Autriche",nameEn:"Austria",flag:"🇦🇹",currency:"EUR",symbol:"€",calc:(g)=>{
    const s=g*0.1812,ir=cb(g-s,[[12756,0],[20818,0.20],[34513,0.30],[66612,0.40],[99266,0.48],[1000000,0.50],[Infinity,0.55]]);
    return{net:g-s-ir,socialEmployee:s,tax:ir,socialEmployer:g*0.2142,lines:[{label:"Sozialversicherung (18.12%)",amount:s},{label:"Einkommensteuer",amount:ir}]};
  }},
  PL:{nameFr:"Pologne",nameEn:"Poland",flag:"🇵🇱",currency:"PLN",symbol:"PLN",calc:(g,_r,o={})=>{
    const s=g*0.1371,young=o.young===true&&g<=85528,tb=Math.max(0,g-s-(young?85528:0));
    const ir=young?0:cb(tb,[[120000,0.12],[Infinity,0.32]])-3600;
    return{net:g-s-Math.max(0,ir),socialEmployee:s,tax:Math.max(0,ir),socialEmployer:g*0.2021,lines:[{label:"ZUS (13.71%)",amount:s},...(young?[{label:"Youth exemption <26",amount:g*0.12,isCredit:true}]:[]),{label:"PIT",amount:Math.max(0,ir)}].filter(l=>l.amount>0||l.isCredit)};
  }},
  RO:{nameFr:"Roumanie",nameEn:"Romania",flag:"🇷🇴",currency:"RON",symbol:"RON",calc:(g,_r,o={})=>{
    const s=g*0.25,cass=g*0.10,tb=Math.max(0,g-s-cass),ir=o.it===true?0:tb*0.10;
    return{net:g-s-cass-ir,socialEmployee:s+cass,tax:ir,socialEmployer:g*0.025,lines:[{label:"CAS pension (25%)",amount:s},{label:"CASS health (10%)",amount:cass},...(o.it===true?[{label:"IT exemption",amount:tb*0.10,isCredit:true}]:[{label:"Income tax (10%)",amount:ir}])]};
  }},
  CZ:{nameFr:"Rép. Tchèque",nameEn:"Czech Rep.",flag:"🇨🇿",currency:"CZK",symbol:"CZK",calc:(g)=>{
    const s=g*0.0965,ir=Math.max(0,cb(g,[[1582812,0.15],[Infinity,0.23]])-30840);
    return{net:g-s-ir,socialEmployee:s,tax:ir,socialEmployer:g*0.338,lines:[{label:"Soc. pojištění (9.65%)",amount:s},{label:"Daň z příjmů",amount:ir}]};
  }},
  HU:{nameFr:"Hongrie",nameEn:"Hungary",flag:"🇭🇺",currency:"HUF",symbol:"HUF",calc:(g)=>{
    const s=g*0.185,ir=(g-s)*0.15;
    return{net:g-s-ir,socialEmployee:s,tax:ir,socialEmployer:g*0.13,lines:[{label:"Társadalombiztosítás (18.5%)",amount:s},{label:"SZJA (15% flat)",amount:ir}]};
  }},
  JP:{nameFr:"Japon",nameEn:"Japan",flag:"🇯🇵",currency:"JPY",symbol:"¥",calc:(g,_r,o={})=>{
    const s=g*0.1482,ded=Math.min(1950000,Math.max(550000,g*0.4)),dep=parseInt(o.dependent as string||"0");
    const tb=Math.max(0,g-s-ded-Math.min(dep,3)*380000);
    const nat=cb(tb,[[1950000,0.05],[3300000,0.10],[6950000,0.20],[9000000,0.23],[18000000,0.33],[40000000,0.40],[Infinity,0.45]]);
    return{net:g-s-nat-tb*0.10,socialEmployee:s,tax:nat+tb*0.10,socialEmployer:g*0.1542,lines:[{label:"社会保険料",amount:s},{label:"所得税",amount:nat},{label:"住民税 (10%)",amount:tb*0.10}]};
  }},
  SG:{nameFr:"Singapour",nameEn:"Singapore",flag:"🇸🇬",currency:"SGD",symbol:"SGD",calc:(g,_r,o={})=>{
    if(o.nsr===true){const ir=Math.max(g*0.15,cb(g,[[20000,0],[30000,0.02],[40000,0.035],[80000,0.07],[120000,0.115],[160000,0.15],[200000,0.18],[240000,0.19],[280000,0.195],[320000,0.20],[500000,0.22],[1000000,0.23],[Infinity,0.24]]));return{net:g-ir,socialEmployee:0,tax:ir,socialEmployer:g*0.17,lines:[{label:"Income Tax (non-resident)",amount:ir}]};}
    const cpf=Math.min(g,102000)*0.20,ir=cb(Math.max(0,g-cpf-1000),[[20000,0],[30000,0.02],[40000,0.035],[80000,0.07],[120000,0.115],[160000,0.15],[200000,0.18],[240000,0.19],[280000,0.195],[320000,0.20],[500000,0.22],[1000000,0.23],[Infinity,0.24]]);
    return{net:g-cpf-ir,socialEmployee:cpf,tax:ir,socialEmployer:g*0.17,lines:[{label:"CPF Employee (20%)",amount:cpf},{label:"Income Tax",amount:ir}]};
  }},
  AE:{nameFr:"Émirats Arabes",nameEn:"UAE",flag:"🇦🇪",currency:"AED",symbol:"AED",calc:(g)=>({net:g,socialEmployee:0,tax:0,socialEmployer:0,lines:[{label:"No income tax 🎉",amount:0,isCredit:true}]})},
};

const DISPLAY_CURRENCIES=[
  {code:"EUR",symbol:"€"},{code:"USD",symbol:"$"},{code:"GBP",symbol:"£"},
  {code:"CHF",symbol:"CHF"},{code:"CAD",symbol:"CAD"},{code:"AUD",symbol:"AUD"},
  {code:"JPY",symbol:"¥"},{code:"SGD",symbol:"SGD"},{code:"SEK",symbol:"SEK"},
  {code:"PLN",symbol:"PLN"},{code:"RON",symbol:"RON"},{code:"AED",symbol:"AED"},
];

const PERIOD_KEYS=["annual","monthly","weekly","daily","hourly"] as const;
type Period=typeof PERIOD_KEYS[number];
const FX:Record<string,number>={EUR:1,GBP:1.17,CHF:1.04,USD:0.93,CAD:0.68,SEK:0.088,DKK:0.134,NOK:0.086,AUD:0.60,JPY:0.0062,SGD:0.70,PLN:0.23,RON:0.20,CZK:0.040,HUF:0.0025,AED:0.253};
const LEGAL_HOURS:Record<string,number>={FR:35,DE:40,GB:37.5,IE:39,IT:40,ES:40,PT:40,NL:40,BE:38,LU:40,CH:42,US:40,CA:40,AU:38,SE:40,DK:37,NO:37.5,FI:40,AT:40,PL:40,RO:40,CZ:40,HU:40,JP:40,SG:44,AE:48};

const GROUPS_FR=[
  {label:"Europe ouest",keys:["FR","DE","GB","IE","IT","ES","PT","NL","BE","LU","AT","CH"]},
  {label:"Europe nord",keys:["SE","DK","NO","FI"]},
  {label:"Europe est",keys:["PL","RO","CZ","HU"]},
  {label:"Amériques",keys:["US","CA"]},
  {label:"Océanie",keys:["AU"]},
  {label:"Asie / Moyen-Orient",keys:["JP","SG","AE"]},
];
const GROUPS_EN=[
  {label:"Western Europe",keys:["FR","DE","GB","IE","IT","ES","PT","NL","BE","LU","AT","CH"]},
  {label:"Northern Europe",keys:["SE","DK","NO","FI"]},
  {label:"Eastern Europe",keys:["PL","RO","CZ","HU"]},
  {label:"Americas",keys:["US","CA"]},
  {label:"Oceania",keys:["AU"]},
  {label:"Asia / Middle East",keys:["JP","SG","AE"]},
];

function fmt(n:number,sym:string,short=false):string{
  const sep=sym.length>1?" ":"";
  if(short&&Math.abs(n)>=1000)return sym+sep+(n/1000).toFixed(1)+"k";
  if(Math.abs(n)>=1_000_000)return sym+sep+(n/1_000_000).toFixed(2)+"M";
  return sym+sep+Math.round(n).toLocaleString("fr-FR");
}

function DonutChart({net,social,tax,gross,size=120}:{net:number;social:number;tax:number;gross:number;size?:number}){
  const cx=size/2,cy=size/2,r=size/2-8,ir=r*0.6;
  const segs=[{v:net,c:"#6366f1"},{v:social,c:"#f43f5e"},{v:tax,c:"#f59e0b"}];
  const total=segs.reduce((s,d)=>s+d.v,0);if(total<=0)return null;
  let cum=-Math.PI/2;
  const arcs=segs.map(d=>{
    const angle=(d.v/total)*2*Math.PI*0.999,x1=cx+r*Math.cos(cum),y1=cy+r*Math.sin(cum);
    cum+=angle;
    const x2=cx+r*Math.cos(cum),y2=cy+r*Math.sin(cum);
    return{d:`M${x1},${y1} A${r},${r} 0 ${angle>Math.PI?1:0},1 ${x2},${y2} L${cx+ir*Math.cos(cum)},${cy+ir*Math.sin(cum)} A${ir},${ir} 0 ${angle>Math.PI?1:0},0 ${cx+ir*Math.cos(cum-angle)},${cy+ir*Math.sin(cum-angle)} Z`,c:d.c};
  });
  return(
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{flexShrink:0}}>
      {arcs.map((a,i)=><path key={i} d={a.d} fill={a.c} opacity={0.9}/>)}
      <circle cx={cx} cy={cy} r={ir-1} fill="white"/>
      <text x={cx} y={cy-6} textAnchor="middle" fontSize={16} fontWeight={800} fill="#1a1a2e">{Math.round((net/gross)*100)}%</text>
      <text x={cx} y={cy+8} textAnchor="middle" fontSize={8} fill="#9ca3af" fontWeight={600}>NET</text>
    </svg>
  );
}

function detectLang():Lang{
  if(typeof navigator==="undefined")return "en";
  const nav=navigator.language||(navigator as unknown as {userLanguage?:string}).userLanguage||"en";
  return nav.toLowerCase().startsWith("fr")?"fr":"en";
}

export default function Home(){
  const [lang,setLang]=useState<Lang>(detectLang);
  const t=T[lang];
  const GROUPS=lang==="fr"?GROUPS_FR:GROUPS_EN;
  const cname=(k:string)=>lang==="fr"?COUNTRIES[k].nameFr:COUNTRIES[k].nameEn;

  const [mode,setMode]=useState<"gross"|"net">("gross");
  const [grossInput,setGrossInput]=useState(50000);
  const [netInput,setNetInput]=useState(35000);
  const inputRef=useRef<HTMLInputElement>(null);
  const calcTimerRef=useRef<ReturnType<typeof setTimeout>|null>(null);
  const [country,setCountry]=useState("FR");
  const [period,setPeriod]=useState<Period>("annual");
  const [usState,setUsState]=useState("CA");
  const [chCanton,setChCanton]=useState("ZH");
  const [opts,setOpts]=useState<Record<string,Record<string,string|boolean>>>({});
  const [showOpts,setShowOpts]=useState<Record<string,boolean>>({});
  const [displayCurrency,setDisplayCurrency]=useState("EUR");
  const [currencyLocked,setCurrencyLocked]=useState(false);
  const [monthsWorked,setMonthsWorked]=useState(12);
  const [hoursPerWeek,setHoursPerWeek]=useState(35);
  const [hoursLocked,setHoursLocked]=useState(false);
  const [mobileTab,setMobileTab]=useState<"calc"|"results">("calc");
  const [showDrawer,setShowDrawer]=useState(false);

  const c=COUNTRIES[country];
  const handleSetCountry=(k:string)=>{
    setCountry(k);
    if(!currencyLocked)setDisplayCurrency(COUNTRIES[k].currency);
    if(!hoursLocked)setHoursPerWeek(LEGAL_HOURS[k]??40);
    setShowDrawer(false);setMobileTab("calc");
  };
  const region=country==="US"?usState:country==="CH"?chCanton:undefined;
  const cOpts=useMemo(()=>opts[country]||{},[opts,country]);
  const setOpt=(k:string,v:string|boolean)=>setOpts(p=>({...p,[country]:{...p[country],[k]:v}}));
  const optsDef=COUNTRY_OPTIONS[country]||[];

  const periodDiv=useMemo(()=>{
    const w=monthsWorked*(52/12);
    return({annual:1,monthly:monthsWorked,weekly:w,daily:w*5,hourly:w*hoursPerWeek} as Record<string,number>)[period]||1;
  },[period,monthsWorked,hoursPerWeek]);

  const gross=useMemo(()=>{
    if(mode==="gross")return grossInput*periodDiv;
    const na=netInput*periodDiv;
    try{return netToGross(na,(g)=>c.calc(g,region,cOpts));}catch{return na*1.4;}
  },[mode,grossInput,netInput,periodDiv,region,cOpts,c]);

  const result=useMemo(()=>{try{return c.calc(gross,region,cOpts);}catch{return null;}},[gross,region,cOpts,c]);
  const taxPct=result?Math.round((result.tax+result.socialEmployee)/gross*100):0;
  const netPct=result?Math.round((result.net/gross)*100):0;

  const dispFx=(FX[c.currency]??1)/(FX[displayCurrency]??1);
  const dispSym=DISPLAY_CURRENCIES.find(d=>d.code===displayCurrency)?.symbol??displayCurrency;
  const fmtD=(n:number,short=false)=>fmt(n*dispFx,dispSym,short);
  const pDivFor=(pk:string)=>{const w=monthsWorked*(52/12);return({annual:1,monthly:monthsWorked,weekly:w,daily:w*5,hourly:w*hoursPerWeek} as Record<string,number>)[pk]||1;};
  const periodLabel=t.periods[PERIOD_KEYS.indexOf(period)].toLowerCase();

  const ranking=useMemo(()=>{
    const dF=FX[displayCurrency]||1,rFx=FX[c.currency]||1,gE=gross*rFx;
    return Object.entries(COUNTRIES).map(([k,v])=>{
      try{
        const lFx=FX[v.currency]||1;
        if(mode==="net"){
          const tnl=(netInput*periodDiv)*rFx/lFx;
          const gn=netToGross(tnl,(g)=>v.calc(g,k==="US"?usState:k==="CH"?chCanton:undefined,{}));
          const r=v.calc(gn,k==="US"?usState:k==="CH"?chCanton:undefined,{});
          return{k,v,netRef:gn*lFx/dF,taxPct:Math.round((r.tax+r.socialEmployee)/gn*100)};
        }else{
          const gl=gE/lFx,r=v.calc(gl,k==="US"?usState:k==="CH"?chCanton:undefined,{});
          return{k,v,netRef:r.net*lFx/dF,taxPct:Math.round((r.tax+r.socialEmployee)/gl*100)};
        }
      }catch{return null;}
    }).filter((x):x is NonNullable<typeof x>=>x!==null)
    .sort((a,b)=>mode==="net"?a.netRef-b.netRef:b.netRef-a.netRef);
  },[gross,netInput,periodDiv,mode,usState,chCanton,c,displayCurrency]);

  const card:React.CSSProperties={background:"white",borderRadius:16,boxShadow:"0 1px 3px rgba(0,0,0,0.06),0 2px 8px rgba(0,0,0,0.04)"};
  const lbl:React.CSSProperties={fontSize:11,fontWeight:700,color:"#9ca3af",letterSpacing:1,textTransform:"uppercase",marginBottom:8};
  const pill=(a:boolean,col="#6366f1"):React.CSSProperties=>({border:"none",cursor:"pointer",borderRadius:20,padding:"6px 14px",fontSize:13,fontWeight:600,transition:"all 0.15s",background:a?col:"#f1f5f9",color:a?"white":"#6b7280"});

  const SettingsContent=()=>(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>

      {/* Mode */}
      <div style={{display:"flex",gap:0,background:"#f1f5f9",borderRadius:14,padding:4}}>
        {([["gross",t.grossToNet],["net",t.netToGross]] as const).map(([k,l])=>(
          <button key={k} onClick={()=>setMode(k)} style={{flex:1,padding:"11px",border:"none",borderRadius:11,background:mode===k?"white":"transparent",color:mode===k?"#6366f1":"#6b7280",fontWeight:700,fontSize:14,cursor:"pointer",boxShadow:mode===k?"0 1px 4px rgba(0,0,0,0.1)":"none",transition:"all 0.15s"}}>{l}</button>
        ))}
      </div>

      {/* Input */}
      <div>
        <p style={lbl}>{mode==="gross"?`${t.grossLabel} ${periodLabel}`:`${t.netLabel} ${periodLabel}`} ({c.symbol})</p>
        <div style={{position:"relative",marginBottom:10}}>
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            onFocus={e=>{
              e.target.value=String(mode==="gross"?grossInput:netInput);
              e.target.select();
            }}
            onBlur={e=>{
              if(calcTimerRef.current)clearTimeout(calcTimerRef.current);
              const raw=e.target.value.replace(/[^0-9]/g,"");
              const v=raw===""?0:parseInt(raw,10);
              mode==="gross"?setGrossInput(v):setNetInput(v);
              e.target.value=Math.round(v).toLocaleString("fr-FR");
            }}
            onKeyDown={e=>{
              if(e.key==="Enter"){(e.target as HTMLInputElement).blur();return;}
              if(!/[0-9]/.test(e.key)&&!["Backspace","Delete","ArrowLeft","ArrowRight","Tab","Home","End"].includes(e.key))e.preventDefault();
            }}
            defaultValue={Math.round(mode==="gross"?grossInput:netInput).toLocaleString("fr-FR")}
            style={{width:"100%",padding:"16px 52px 16px 16px",fontSize:26,fontWeight:800,border:`2px solid ${mode==="net"?"#10b981":"#6366f1"}`,borderRadius:14,outline:"none",color:"#1a1a2e",background:"white",letterSpacing:-0.5}}/>
          <span style={{position:"absolute",right:16,top:"50%",transform:"translateY(-50%)",fontSize:16,color:"#9ca3af",fontWeight:700}}>{c.symbol}</span>
        </div>
        {mode==="net"&&result&&(
          <div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:12,padding:"12px 16px",marginBottom:12,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontSize:13,color:"#166534",fontWeight:500}}>{t.necessaryGross} {periodLabel}</span>
            <span style={{fontSize:18,fontWeight:800,color:"#15803d"}}>{fmt(gross/periodDiv,c.symbol)}</span>
          </div>
        )}
        <input type="range"
          min={Math.round((mode==="gross"?5000:3000)/periodDiv)} max={Math.round((mode==="gross"?500000:350000)/periodDiv)}
          step={Math.max(1,Math.round((mode==="gross"?1000:500)/periodDiv))} value={mode==="gross"?grossInput:netInput}
          onChange={e=>{const v=Number(e.target.value);mode==="gross"?setGrossInput(v):setNetInput(v);}}
          style={{width:"100%",marginBottom:6,accentColor:mode==="net"?"#10b981":"#6366f1",height:6}}/>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"#c4c9d4",marginBottom:12}}>
          <span>{Math.round((mode==="gross"?5000:3000)/periodDiv).toLocaleString("fr-FR")}</span>
          <span>{Math.round((mode==="gross"?250000:175000)/periodDiv).toLocaleString("fr-FR")}</span>
          <span>{Math.round((mode==="gross"?500000:350000)/periodDiv).toLocaleString("fr-FR")}</span>
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:4}}>
          {(mode==="gross"?[25000,35000,50000,70000,100000,150000,200000]:[15000,25000,35000,50000,70000,100000,150000])
            .map(v=>Math.round(v/periodDiv)).map(v=>(
              <button key={v} style={{...pill((mode==="gross"?grossInput:netInput)===v,mode==="net"?"#10b981":"#6366f1"),padding:"6px 12px",fontSize:13}}
                onClick={()=>mode==="gross"?setGrossInput(v):setNetInput(v)}>
                {v>=1000?`${(v/1000).toFixed(v%1000===0?0:1)}k`:v}
              </button>
            ))}
        </div>
      </div>

      {/* Work params */}
      <div style={{padding:"14px 16px",background:"#f8fafc",borderRadius:14,border:"1px solid #e2e8f0"}}>
        <p style={{...lbl,marginBottom:12}}>{t.workParams}</p>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
              <span style={{fontSize:14,color:"#374151",fontWeight:500}}>{t.monthsWorked}</span>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                {monthsWorked!==12&&<span style={{fontSize:11,background:"#ede9fe",color:"#7c3aed",padding:"2px 8px",borderRadius:99,fontWeight:700}}>{t.bonus(monthsWorked)}</span>}
                <span style={{fontSize:18,fontWeight:800,color:"#6366f1"}}>{monthsWorked}</span>
              </div>
            </div>
            <input type="range" min={1} max={18} step={1} value={monthsWorked} onChange={e=>setMonthsWorked(Number(e.target.value))} style={{width:"100%",accentColor:"#6366f1",height:6}}/>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#c4c9d4",marginTop:4}}><span>1</span><span>12</span><span>18</span></div>
          </div>
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
              <span style={{fontSize:14,color:"#374151",fontWeight:500}}>{t.hoursPerWeek}</span>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                {!hoursLocked&&<span style={{fontSize:10,background:"#f0fdf4",color:"#16a34a",padding:"2px 7px",borderRadius:99,fontWeight:700}}>{t.legal} {LEGAL_HOURS[country]??40}h</span>}
                <button onClick={()=>setHoursLocked(l=>!l)} style={{border:"none",cursor:"pointer",borderRadius:99,padding:"3px 8px",fontSize:10,fontWeight:700,background:hoursLocked?"#6366f1":"#e5e7eb",color:hoursLocked?"white":"#9ca3af"}}>
                  {hoursLocked?t.lock:t.unlock}
                </button>
                <span style={{fontSize:18,fontWeight:800,color:"#6366f1"}}>{hoursPerWeek}h</span>
              </div>
            </div>
            <input type="range" min={1} max={80} step={0.5} value={hoursPerWeek} onChange={e=>{setHoursPerWeek(Number(e.target.value));setHoursLocked(true);}} style={{width:"100%",accentColor:"#6366f1",height:6}}/>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#c4c9d4",marginTop:4}}><span>1h</span><span>40h</span><span>80h</span></div>
          </div>
        </div>
      </div>

      {/* Currency */}
      <div style={{padding:"14px 16px",background:"#f5f3ff",borderRadius:14,border:"1px solid #ede9fe"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
          <p style={{...lbl,color:"#7c3aed",marginBottom:0}}>{t.displayCurrency}</p>
          <button onClick={()=>setCurrencyLocked(l=>!l)} style={{border:"none",cursor:"pointer",borderRadius:99,padding:"5px 12px",fontSize:12,fontWeight:700,background:currencyLocked?"#7c3aed":"#e5e7eb",color:currencyLocked?"white":"#9ca3af"}}>
            {currencyLocked?t.fixed:t.auto}
          </button>
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
          {DISPLAY_CURRENCIES.map(d=>(
            <button key={d.code} onClick={()=>{setDisplayCurrency(d.code);setCurrencyLocked(true);}} style={{...pill(displayCurrency===d.code,"#7c3aed"),padding:"5px 10px",fontSize:12}}>
              {d.symbol} {d.code}
            </button>
          ))}
        </div>
        {displayCurrency!==c.currency&&<p style={{fontSize:11,color:"#7c3aed",marginTop:8,opacity:0.8}}>{t.exRate(c.currency,dispFx.toFixed(4),displayCurrency)}</p>}
      </div>

      {/* US State / CH Canton */}
      {country==="US"&&(
        <div>
          <p style={lbl}>{t.state}</p>
          <select value={usState} onChange={e=>setUsState(e.target.value)} style={{width:"100%",padding:"12px 14px",border:"1.5px solid #e2e8f0",borderRadius:12,fontSize:14,color:"#1a1a2e",background:"white",outline:"none"}}>
            {Object.entries(US_STATES).sort((a,b)=>a[1].name.localeCompare(b[1].name)).map(([k,v])=>(
              <option key={k} value={k}>{v.name} — {v.rate===0?"0%":(v.rate*100).toFixed(1)+"%"}</option>
            ))}
          </select>
        </div>
      )}
      {country==="CH"&&(
        <div>
          <p style={lbl}>{t.canton}</p>
          <select value={chCanton} onChange={e=>setChCanton(e.target.value)} style={{width:"100%",padding:"12px 14px",border:"1.5px solid #e2e8f0",borderRadius:12,fontSize:14,color:"#1a1a2e",background:"white",outline:"none"}}>
            {Object.entries(CH_CANTONS).sort((a,b)=>a[1].rate-b[1].rate).map(([k,v])=>(
              <option key={k} value={k}>{v.name} — {(v.rate*100).toFixed(1)}%</option>
            ))}
          </select>
        </div>
      )}

      {/* Period */}
      <div>
        <p style={lbl}>{t.displayBy}</p>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {PERIOD_KEYS.map((k,i)=>(
            <button key={k} style={{...pill(period===k),padding:"8px 16px",fontSize:14}} onClick={()=>setPeriod(k)}>{t.periods[i]}</button>
          ))}
        </div>
      </div>

      {/* Country options */}
      {optsDef.length>0&&(
        <div>
          <button onClick={()=>setShowOpts(p=>({...p,[country]:!p[country]}))} style={{width:"100%",padding:"12px 16px",border:"1.5px solid #e2e8f0",borderRadius:12,background:showOpts[country]?"#f5f3ff":"white",color:showOpts[country]?"#6366f1":"#6b7280",fontSize:14,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:showOpts[country]?12:0}}>
            <span>{t.options} {cname(country)}</span><span>{showOpts[country]?"▲":"▼"}</span>
          </button>
          {showOpts[country]&&(
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {optsDef.map(opt=>{
                const label=lang==="fr"?opt.label:opt.labelEn;
                const choices=lang==="fr"?(opt.choices||[]):(opt.choicesEn||opt.choices||[]);
                return(
                  <div key={opt.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,padding:"12px 14px",background:"#f9fafb",borderRadius:12}}>
                    <span style={{fontSize:13,color:"#374151",fontWeight:500}}>{label}</span>
                    {opt.type==="toggle"?(
                      <button onClick={()=>setOpt(opt.id,!(cOpts[opt.id]===true))} style={{border:"none",cursor:"pointer",borderRadius:99,padding:"6px 14px",fontSize:13,fontWeight:700,background:cOpts[opt.id]===true?"#6366f1":"#e5e7eb",color:cOpts[opt.id]===true?"white":"#9ca3af",minWidth:60}}>
                        {cOpts[opt.id]===true?"✓ Yes":"No"}
                      </button>
                    ):(
                      <select value={(cOpts[opt.id] as string)||opt.default||choices[0]} onChange={e=>setOpt(opt.id,e.target.value)} style={{padding:"6px 24px 6px 10px",border:"1.5px solid #e2e8f0",borderRadius:10,fontSize:13,color:"#1a1a2e",background:"white",outline:"none",maxWidth:160}}>
                        {choices.map(ch=><option key={ch} value={ch}>{ch}</option>)}
                      </select>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );

  const ResultsContent=()=>(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      {result&&(
        <>
          {/* Hero */}
          <div style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",borderRadius:18,padding:"24px",color:"white",boxShadow:"0 4px 20px rgba(99,102,241,0.3)"}}>
            <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:16}}>
              <div style={{flex:1,minWidth:0}}>
                <p style={{fontSize:12,opacity:0.7,marginBottom:6,textTransform:"uppercase",letterSpacing:0.5}}>
                  {mode==="net"?t.necessaryGross:t.netSalary} {periodLabel}
                  {displayCurrency!==c.currency&&<span style={{marginLeft:6,background:"rgba(255,255,255,0.2)",borderRadius:99,padding:"2px 8px",fontSize:10}}>{displayCurrency}</span>}
                </p>
                <p style={{fontSize:46,fontWeight:800,letterSpacing:-2,lineHeight:1}}>{mode==="net"?fmtD(gross/periodDiv):fmtD(result.net/periodDiv)}</p>
                <p style={{fontSize:13,opacity:0.75,marginTop:8}}>
                  {mode==="net"
                    ?<>Net : {fmtD(result.net/periodDiv)} · <strong>{netPct}%</strong> {t.netSaved}</>
                    :<>Gross : {fmtD(gross/periodDiv)} · <strong>{netPct}%</strong> {t.netSaved}</>}
                </p>
              </div>
              <div style={{textAlign:"right",flexShrink:0,marginLeft:16}}>
                <p style={{fontSize:11,opacity:0.7,marginBottom:4}}>{t.effectiveRate}</p>
                <p style={{fontSize:34,fontWeight:800}}>{taxPct}%</p>
                <p style={{fontSize:11,opacity:0.7}}>{t.deductions}</p>
              </div>
            </div>
            <div style={{borderTop:"1px solid rgba(255,255,255,0.2)",paddingTop:14,display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:10}}>
              {PERIOD_KEYS.filter(k=>k!==period).slice(0,4).map(k=>(
                <div key={k} style={{cursor:"pointer"}} onClick={()=>setPeriod(k)}>
                  <p style={{fontSize:11,opacity:0.6,marginBottom:3}}>{t.periods[PERIOD_KEYS.indexOf(k)]}</p>
                  <p style={{fontSize:22,fontWeight:800,letterSpacing:-0.5}}>{mode==="net"?fmtD(gross/pDivFor(k)):fmtD(result.net/pDivFor(k))}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Breakdown + donut */}
          <div style={{display:"flex",gap:14,alignItems:"flex-start"}}>
            <div style={{...card,padding:20,flex:1,minWidth:0}}>
              <p style={lbl}>{t.fiscalBreakdown}</p>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <tbody>
                  <tr style={{borderBottom:"2px solid #f1f5f9"}}>
                    <td style={{padding:"12px 0",fontSize:14,color:"#374151",fontWeight:500}}>{t.grossSalary}</td>
                    <td style={{padding:"12px 0",fontSize:20,fontWeight:800,color:"#1a1a2e",textAlign:"right"}}>{fmtD(gross/periodDiv)}</td>
                  </tr>
                  {result.lines.map((line,i)=>(
                    <tr key={i} style={{borderBottom:"1px solid #f8f9fb"}}>
                      <td style={{padding:"10px 0 10px 12px",fontSize:13,color:line.isCredit?"#10b981":"#6b7280"}}>{line.isCredit?"+ ":"− "}{line.label}</td>
                      <td style={{padding:"10px 0",fontSize:16,fontWeight:700,color:line.isCredit?"#10b981":"#ef4444",textAlign:"right"}}>{line.isCredit?"+":"-"} {fmtD(line.amount/periodDiv)}</td>
                    </tr>
                  ))}
                  <tr style={{borderTop:"2px solid #6366f1",background:"#f5f3ff"}}>
                    <td style={{padding:"14px 0",fontSize:15,fontWeight:800,color:"#6366f1"}}>{t.netSalary}</td>
                    <td style={{padding:"14px 0",fontSize:24,fontWeight:800,color:"#6366f1",textAlign:"right"}}>{fmtD(result.net/periodDiv)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10,width:155,flexShrink:0}}>
              <div style={{...card,padding:14,display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
                <DonutChart net={result.net} social={result.socialEmployee} tax={result.tax} gross={gross} size={120}/>
                <div style={{width:"100%",display:"flex",flexDirection:"column",gap:6}}>
                  {[{l:"Net",v:result.net,c2:"#6366f1"},{l:lang==="fr"?"Charges":"Benefits",v:result.socialEmployee,c2:"#f43f5e"},{l:lang==="fr"?"Impôt":"Tax",v:result.tax,c2:"#f59e0b"}].map(item=>(
                    <div key={item.l} style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div style={{display:"flex",alignItems:"center",gap:5}}>
                        <div style={{width:8,height:8,borderRadius:"50%",background:item.c2}}/>
                        <span style={{fontSize:12,color:"#6b7280"}}>{item.l}</span>
                      </div>
                      <span style={{fontSize:12,fontWeight:700,color:item.c2}}>{Math.round((item.v/gross)*100)}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{...card,padding:12,textAlign:"center"}}>
                <p style={{fontSize:11,color:"#9ca3af",marginBottom:4}}>{t.employerCost}</p>
                <p style={{fontSize:16,fontWeight:800,color:"#1a1a2e"}}>{fmtD((gross+result.socialEmployer)/periodDiv,true)}</p>
                <p style={{fontSize:11,color:"#9ca3af",marginTop:2}}>{periodLabel}</p>
              </div>
            </div>
          </div>

          {/* Ranking */}
          <div style={{...card,padding:20}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
              <div style={{flex:1,minWidth:0}}>
                <p style={{fontSize:15,fontWeight:700,color:"#1a1a2e"}}>{t.intlComparison}</p>
                <p style={{fontSize:12,color:"#9ca3af",marginTop:3}}>
                  {mode==="net"
                    ?<span>{t.netTarget} : <strong style={{color:"#10b981"}}>{fmtD(netInput)}</strong> · <strong style={{color:"#7c3aed"}}>{displayCurrency}</strong> · <span style={{color:"#10b981"}}>{t.betterCol}</span></span>
                    :<span>{t.sameGross} <strong style={{color:"#7c3aed"}}>{displayCurrency}</strong> · {periodLabel}</span>
                  }
                </p>
              </div>
              <span style={{fontSize:12,background:"#f0fdf4",color:"#16a34a",padding:"4px 10px",borderRadius:99,fontWeight:700,flexShrink:0,marginLeft:10}}>{c.flag} #{ranking.findIndex(r=>r.k===country)+1}/{ranking.length}</span>
            </div>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead>
                <tr style={{borderBottom:"2px solid #f1f5f9"}}>
                  {["#",lang==="fr"?"PAYS":"COUNTRY",lang==="fr"?"IMPÔTS":"TAXES",mode==="net"?`${lang==="fr"?"BRUT":"GROSS"} (${displayCurrency})`:`NET (${displayCurrency})`,lang==="fr"?"VS TOI":"VS YOU"].map(h=>(
                    <th key={h} style={{padding:"6px 8px",fontSize:10,fontWeight:700,color:"#9ca3af",textAlign:h==="#"||(h==="PAYS"||h==="COUNTRY")?"left":"right",letterSpacing:0.5}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ranking.map(({k,v,netRef,taxPct:tp},i)=>{
                  const isCur=k===country,curRef=ranking.find(r=>r.k===country)?.netRef||0,diff=netRef-curRef;
                  return(
                    <tr key={k} onClick={()=>handleSetCountry(k)} style={{borderBottom:"1px solid #f8f9fb",background:isCur?"#f5f3ff":"transparent",cursor:"pointer"}}>
                      <td style={{padding:"10px 8px",fontSize:12,fontWeight:700,color:i===0?"#f59e0b":i===1?"#9ca3af":i===2?"#cd7f32":"#d1d5db",textAlign:"center",width:26}}>{i+1}</td>
                      <td style={{padding:"10px 8px"}}>
                        <div style={{display:"flex",alignItems:"center",gap:7}}>
                          <span style={{fontSize:16}}>{v.flag}</span>
                          <span style={{fontSize:13,fontWeight:isCur?700:400,color:isCur?"#6366f1":"#374151"}}>{lang==="fr"?v.nameFr:v.nameEn}</span>
                        </div>
                      </td>
                      <td style={{padding:"10px 8px",textAlign:"right"}}>
                        <span style={{fontSize:12,fontWeight:600,color:tp>40?"#ef4444":tp>25?"#f59e0b":"#10b981"}}>{tp}%</span>
                      </td>
                      <td style={{padding:"10px 8px",textAlign:"right"}}>
                        <span style={{fontSize:13,fontWeight:700,color:isCur?"#6366f1":"#1a1a2e"}}>{fmt(Math.round(netRef/periodDiv),dispSym)}</span>
                      </td>
                      <td style={{padding:"10px 8px",textAlign:"right"}}>
                        {isCur
                          ?<span style={{fontSize:11,color:"#9ca3af",background:"#f1f5f9",padding:"3px 8px",borderRadius:99}}>{t.rank}</span>
                          :<span style={{fontSize:12,fontWeight:700,color:mode==="net"?(diff<0?"#10b981":"#ef4444"):(diff>0?"#10b981":"#ef4444"),background:mode==="net"?(diff<0?"#f0fdf4":"#fef2f2"):(diff>0?"#f0fdf4":"#fef2f2"),padding:"3px 8px",borderRadius:99}}>
                            {diff>0?"+":""}{fmt(Math.round(diff/periodDiv),dispSym)}
                          </span>
                        }
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p style={{marginTop:12,fontSize:11,color:"#c4c9d4",borderTop:"1px solid #f5f6fa",paddingTop:10}}>{t.disclaimer}</p>
          </div>
        </>
      )}
    </div>
  );

  const CountryDrawer=()=>showDrawer?(
    <div style={{position:"fixed",inset:0,zIndex:300,display:"flex"}}>
      <div style={{flex:1,background:"rgba(0,0,0,0.4)"}} onClick={()=>setShowDrawer(false)}/>
      <div style={{width:280,background:"white",overflowY:"auto",padding:"20px 12px",boxShadow:"-4px 0 24px rgba(0,0,0,0.12)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,padding:"0 6px"}}>
          <span style={{fontSize:16,fontWeight:700,color:"#1a1a2e"}}>{t.chooseCountry}</span>
          <button onClick={()=>setShowDrawer(false)} style={{border:"none",background:"none",fontSize:24,cursor:"pointer",color:"#9ca3af",lineHeight:1}}>×</button>
        </div>
        {GROUPS.map(group=>(
          <div key={group.label} style={{marginBottom:16}}>
            <p style={{fontSize:10,fontWeight:700,color:"#c4c9d4",letterSpacing:1,textTransform:"uppercase",padding:"0 8px",marginBottom:6}}>{group.label}</p>
            {group.keys.filter(k=>COUNTRIES[k]).map(k=>{
              const isCur=k===country;
              return(
                <button key={k} onClick={()=>handleSetCountry(k)} style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"10px 12px",border:"none",borderRadius:10,background:isCur?"#f5f3ff":"transparent",cursor:"pointer",marginBottom:3}}>
                  <span style={{fontSize:20,flexShrink:0}}>{COUNTRIES[k].flag}</span>
                  <span style={{fontSize:14,fontWeight:isCur?700:400,color:isCur?"#6366f1":"#374151"}}>{cname(k)}</span>
                  {isCur&&<span style={{marginLeft:"auto",fontSize:10,color:"#6366f1"}}>✓</span>}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  ):null;

  return(
    <>
      <style>{`
        *{box-sizing:border-box;}
        input[type=range]{-webkit-appearance:none;appearance:none;background:transparent;}
        input[type=range]::-webkit-slider-runnable-track{background:#e2e8f0;height:6px;border-radius:3px;}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:20px;height:20px;border-radius:50%;background:var(--accent,#6366f1);margin-top:-7px;box-shadow:0 1px 4px rgba(0,0,0,0.2);}
        @media(max-width:768px){.desktop-only{display:none!important}.mobile-only{display:flex!important}}
        @media(min-width:769px){.mobile-only{display:none!important}.desktop-only{display:flex!important}}
      `}</style>
      <main style={{minHeight:"100vh",background:"#f8f9fb",display:"flex",flexDirection:"column"}}>
        <header style={{background:"white",borderBottom:"1px solid #e8eaed",padding:"0 20px",height:56,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:200,flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:32,height:32,background:"linear-gradient(135deg,#6366f1,#8b5cf6)",borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>💶</div>
            <span style={{fontSize:18,fontWeight:800,color:"#1a1a2e",letterSpacing:-0.5}}>SalaryNet</span>
            <span style={{fontSize:10,background:"#ede9fe",color:"#6366f1",padding:"2px 7px",borderRadius:99,fontWeight:700}}>2026</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{display:"flex",gap:2,background:"#f1f5f9",borderRadius:20,padding:3}}>
              {(["fr","en"] as Lang[]).map(l=>(
                <button key={l} onClick={()=>setLang(l)} style={{border:"none",cursor:"pointer",borderRadius:17,padding:"4px 10px",fontSize:12,fontWeight:700,background:lang===l?"#6366f1":"transparent",color:lang===l?"white":"#9ca3af",transition:"all 0.15s"}}>
                  {l==="fr"?"🇫🇷 FR":"🇬🇧 EN"}
                </button>
              ))}
            </div>
            <button className="mobile-only" style={{display:"none",alignItems:"center",gap:6,padding:"8px 14px",border:"1.5px solid #e2e8f0",borderRadius:12,background:"white",cursor:"pointer",fontSize:14,fontWeight:600,color:"#374151"}} onClick={()=>setShowDrawer(true)}>
              <span style={{fontSize:18}}>{c.flag}</span>{cname(country)}<span style={{fontSize:12,color:"#9ca3af"}}>▼</span>
            </button>
          </div>
        </header>

        <CountryDrawer/>

        {/* DESKTOP */}
        <div className="desktop-only" style={{display:"none",flex:1,overflow:"hidden"}}>
          <aside style={{width:170,background:"white",borderRight:"1px solid #e8eaed",overflowY:"auto",padding:"14px 8px",flexShrink:0,height:"calc(100vh - 56px)",position:"sticky",top:56}}>
            {GROUPS.map(group=>(
              <div key={group.label} style={{marginBottom:16}}>
                <p style={{fontSize:9,fontWeight:700,color:"#c4c9d4",letterSpacing:1,textTransform:"uppercase",padding:"0 8px",marginBottom:5}}>{group.label}</p>
                {group.keys.filter(k=>COUNTRIES[k]).map(k=>{
                  const isCur=k===country;
                  return(
                    <button key={k} onClick={()=>handleSetCountry(k)} style={{width:"100%",display:"flex",alignItems:"center",gap:8,padding:"8px 10px",border:"none",borderRadius:9,background:isCur?"#f5f3ff":"transparent",cursor:"pointer",marginBottom:2,transition:"all 0.12s"}}>
                      <span style={{fontSize:17,flexShrink:0}}>{COUNTRIES[k].flag}</span>
                      <span style={{fontSize:12,fontWeight:isCur?700:400,color:isCur?"#6366f1":"#374151",textAlign:"left",lineHeight:1.2}}>{cname(k)}</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </aside>
          <div style={{flex:1,overflowY:"auto",padding:"24px"}}>
            <div style={{maxWidth:1060,margin:"0 auto",display:"grid",gridTemplateColumns:"340px 1fr",gap:22,alignItems:"start"}}>
              <div style={{...card,padding:22,position:"sticky",top:-120}}>
                <p style={{fontSize:17,fontWeight:800,color:"#1a1a2e",marginBottom:2}}>{t.calcTitle}</p>
                <p style={{fontSize:12,color:"#9ca3af",marginBottom:18}}>{c.flag} {cname(country)} · {t.calcSubtitle}</p>
                <SettingsContent/>
              </div>
              <ResultsContent/>
            </div>
          </div>
        </div>

        {/* MOBILE */}
        <div className="mobile-only" style={{display:"none",flex:1,flexDirection:"column",overflow:"hidden"}}>
          <div style={{flex:1,overflowY:"auto",padding:"16px 16px 90px 16px"}}>
            {mobileTab==="calc"&&(
              <div style={{...card,padding:20}}>
                <p style={{fontSize:17,fontWeight:800,color:"#1a1a2e",marginBottom:2}}>{t.calcTitle}</p>
                <p style={{fontSize:13,color:"#9ca3af",marginBottom:18}}>{c.flag} {cname(country)} · {t.calcSubtitle}</p>
                <SettingsContent/>
              </div>
            )}
            {mobileTab==="results"&&<ResultsContent/>}
          </div>
          <nav style={{position:"fixed",bottom:0,left:0,right:0,background:"white",borderTop:"1px solid #e8eaed",display:"flex",zIndex:100,height:68,paddingBottom:"env(safe-area-inset-bottom)"}}>
            {([["calc","🧮",t.calculator],["results","📊",t.results]] as const).map(([k,icon,label])=>(
              <button key={k} onClick={()=>setMobileTab(k as "calc"|"results")}
                style={{flex:1,border:"none",background:mobileTab===k?"#f5f3ff":"transparent",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3,color:mobileTab===k?"#6366f1":"#9ca3af",fontWeight:mobileTab===k?700:400,transition:"all 0.15s"}}>
                <span style={{fontSize:24}}>{icon}</span>
                <span style={{fontSize:12}}>{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </main>
    </>
  );
}

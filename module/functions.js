const { faker } = require('@faker-js/faker');
const fakerBr = require('faker-br');
const fs = require('fs');
const { values } = require('../mocks/routes/users');

/**
 * Lists of default values
 */
const {
  maritalStatusCode,
  alphabet,
  amortizationScheduled,
  calculation,
  chargeType,
  feeCharge,
  indexerSubType,
  instalmentPeriodicity,
  numbers,
  productName,
  productSubType,
  productType,
  rateType,
  referentialRateIndexerType,
  sexo,
  taxPeriodicity,
  taxType,
  occupationCodes,
  frequencies } = require('./consts');

/**
 * Generate a contract data object based on the id
 * 
 * @param {int} id - Seed to generate the contract
 * @returns JSON
 */
async function generateContrato(id) {
  /**
   * Generate each contract based on the id, if the id is the same, return the
   * same values
   */
  faker.seed(parseInt(id));
  /**
   * Generate values dinamically to obey product rules
   */
  var feeChargeTmp = faker.random.arrayElement(feeCharge);
  var feeAmountTmp = "";
  var feeRateTmp = "";

  /**
   * If the charge is minimum, generate amount, and if it's percentual, generate rate
   */
  if (feeChargeTmp == "MINIMO") {
    feeAmountTmp = faker.datatype.number({ min: 10000, max: 99999999, precision: 0.01 });
  } else if (feeChargeTmp == "PERCENTUAL") {
    feeRateTmp = faker.datatype.number({ min: 0, max: 1, precision: 0.0001 });
  }

  /**
   * Generate dates based on rules
   */
  let contractDate = faker.date.between('2018-01-01', '2022-01-01').toISOString().substring(0, 10);

  let disbursementDate = faker.date.between(contractDate, '2028-01-01').toISOString().substring(0, 10);

  let settlementDate = faker.date.between(disbursementDate, '2029-01-01').toISOString().substring(0, 10);

  let dueDate = faker.date.between(settlementDate, '2030-01-01').toISOString().substring(0, 10);

  var contractAmount = faker.datatype.number({ min: 0, max: 1, precision: 0.01 });

  /**
   * 80% of the time the contract amount will be between 1000 and 300000
   * 20% of the time the contract amount will be between 300000 and 1000000
   */
  if (contractAmount < 0.8) {
    contractAmount = faker.datatype.number({ min: 1000, max: 300000, precision: 0.0001 });
  } else {
    contractAmount = faker.datatype.number({ min: 300000, max: 1000000, precision: 0.0001 });
  }

  return [
    {
      "data": {
        "contractNumber": faker.random.alphaNumeric(13, { bannedChars: alphabet }),
        "ipocCode": faker.random.alphaNumeric(41, { bannedChars: alphabet }),
        "productName": faker.random.arrayElement(productName),
        "productType": faker.random.arrayElement(productType),
        "productSubType": faker.random.arrayElement(productSubType),
        "contractDate": contractDate,
        "disbursementDate": disbursementDate,
        "settlementDate": settlementDate,
        "contractAmount": contractAmount,
        "currency": "BRL", // always BRL
        "dueDate": dueDate,
        "instalmentPeriodicity": faker.random.arrayElement(instalmentPeriodicity),
        "instalmentPeriodicityAdditionalInfo": "Informações adicionais sobre periodicidade",
        "firstInstalmentDueDate": faker.date.between('2018-01-01', '2022-01-01').toISOString().substring(0, 10),
        "CET": faker.datatype.number({ min: 0, max: 1, precision: 0.0001 }),
        "amortizationScheduled": faker.random.arrayElement(amortizationScheduled),
        "amortizationScheduledAdditionalInfo": "NA",
        "interestRates": [
          {
            "taxType": faker.random.arrayElement(taxType),
            "interestRateType": faker.random.arrayElement(rateType),
            "taxPeriodicity": faker.random.arrayElement(taxPeriodicity),
            "calculation": faker.random.arrayElement(calculation),
            "referentialRateIndexerType": faker.random.arrayElement(referentialRateIndexerType),
            "referentialRateIndexerSubType": faker.random.arrayElement(indexerSubType),
            "referentialRateIndexerAdditionalInfo": "Informações adicionais",
            "preFixedRate": faker.datatype.number({ min: 0, max: 1, precision: 0.0001 }),
            "postFixedRate": faker.datatype.number({ min: 0, max: 1, precision: 0.0001 }),
            "additionalInfo": "Informações adicionais"
          }
        ],
        "contractedFees": [
          {
            "feeName": "Excesso em Conta",
            "feeCode": "EXCESSO_CONTA",
            "feeChargeType": faker.random.arrayElement(chargeType),
            "feeCharge": feeChargeTmp,
            "feeAmount": feeAmountTmp,
            "feeRate": feeRateTmp,
          }
        ],
        "contractedFinanceCharges": [
          {
            "chargeType": "JUROS_REMUNERATORIOS_POR_ATRASO",
            "chargeAdditionalInfo": "Informações adicionais sobre encargos.",
            "chargeRate": faker.datatype.number({ min: 0, max: 1 }) === 0 ? faker.datatype.number({ min: 0, max: 1, precision: 0.0001 }) : ""
          }
        ]
      }
    }
  ];
}

/**
 * Generate a "Pessoa física" data object based on the id
 * 
 * @param {int} id - Seed to generate the "Pessoa física"
 * @returns JSON
 */
async function generatePf(id) {
  /**
   * Generate each PF based on the id, if the id is the same, return the
   * same values
   */
  faker.seed(parseInt(id));

  /**
   * Generate values dinamically to obey product rules
   */
  var feeAmountTmp = "";
  var feeRateTmp = "";

  var goodPayeeTmp = 0;

  /**
   * If the charge is minimum, generate amount, and if it's percentual, generate rate
   */
  feeAmountTmp = faker.datatype.number({ min: 10000, max: 99999999, precision: 0.01 });
  feeRateTmp = faker.datatype.number({ min: 0, max: 1, precision: 0.0001 });

  /**
   * 95% of the time it will be a good payee
   */
  if (feeRateTmp < 0.95) {
    goodPayeeTmp = 1;
  }

  var isEmpregado = faker.datatype.number({ min: 0, max: 1, precision: 0.0001 });

  /**
   * 96% of the time it will be employed
   */
  if (isEmpregado < 0.96) {
    isEmpregado = 1;
  } else {
    isEmpregado = 0;
  }

  var numDependentes = faker.datatype.number({ min: 0, max: 1, precision: 0.0001 });

  /**
   * 80% of the time it will have between 0 and 2 dependents,
   * 20% of the time it will have between 3 and 5 dependents
   */
  if (numDependentes < 0.8) {
    numDependentes = faker.datatype.number({ min: 0, max: 2 });
  } else {
    numDependentes = faker.datatype.number({ min: 3, max: 5 });
  }

  return [
    {
      "data": {
        "birthDate": faker.date.between('1940-01-01', '2000-01-01').toISOString().substring(0, 10),
        "maritalStatusCode": faker.random.arrayElement(maritalStatusCode),
        "sex": faker.random.arrayElement(sexo),
        "creliq": goodPayeeTmp,
        "ocupacao": isEmpregado,
        "numeroDependentes": numDependentes,
        "idade": faker.datatype.number({ min: 18, max: 85 }),
        "credAberto": faker.datatype.number({ min: 0, max: 20 }),
      }
    }
  ];
}

/**
 * Generate a balance data object based on the id
 * 
 * @param {int} id - Seed to generate the balance
 * @returns JSON
 */
async function generateBalances(id) {
  /**
   * Generate each balance based on the id, if the id is the same, return the
   * same values
   */
  faker.seed(parseInt(id));

  return [
    {
      "data": {
        "availableAmount": faker.datatype.number({ min: -100000, max: 99999999, precision: 0.0001 }),
        "availableAmountCurrency": "BRL",
        "blockedAmount": faker.datatype.number({ min: 10000, max: 99999999, precision: 0.0001 }),
        "blockedAmountCurrency": "BRL",
        "automaticallyInvestedAmount": faker.datatype.number({ min: 10000, max: 99999999, precision: 0.0001 }),
        "automaticallyInvestedAmountCurrency": "BRL"
      }
    }
  ];
}

/**
 * Generate a qualification data object based on the id
 * 
 * @param {int} id - Seed to generate the qualification
 * @returns JSON
 */
async function generateQualifications(id) {
  /**
   * Generate each qualification based on the id, if the id is the same, return the
   * same values
   */
  faker.seed(parseInt(id));

  /**
   * Generate income, 90% of it will be between 0 and 5000, 
   * and 10% will be between 5000 and 100000
   */
  var income = faker.datatype.number({ min: 0, max: 1, precision: 0.0001 });

  if (income < 0.9) {
    income = faker.datatype.number({ min: 0, max: 5000, precision: 0.0001 });
  } else {
    income = faker.datatype.number({ min: 5000, max: 100000, precision: 0.0001 });
  }

  /**
   * Generate patrimony, 80% of it will be between 0 and 500000, 
   * 15% will be between 500000 and 1000000
   * and 5% will be between 1000000 and 10000000
   */
  var patrimony = faker.datatype.number({ min: 0, max: 1, precision: 0.0001 });

  if (patrimony < 0.8) {
    patrimony = faker.datatype.number({ min: 0, max: 500000, precision: 0.0001 });
  } else if(patrimony < 0.95) {
    patrimony = faker.datatype.number({ min: 500000, max: 1000000, precision: 0.0001 });
  } else {
    patrimony = faker.datatype.number({ min: 1000000, max: 10000000, precision: 0.0001 });
  }

  return [
    {
      "data": {
        "updateDateTime": faker.date.recent(),
        "companyCnpj": fakerBr.br.cnpj(),
        "occupationCode": faker.random.arrayElement(occupationCodes),
        "occupationDescription": "01",
        "informedIncome": {
          "frequency": faker.random.arrayElement(frequencies),
          "amount": income,
          "currency": "BRL",
          "date": faker.date.recent()
        },
        "informedPatrimony": {
          "amount": patrimony,
          "currency": "BRL",
          "year": faker.date.recent(2000).toISOString().substring(0, 4)
        }
      }
    }
  ];
}
  
/**
 * Generate a CSV with basic information
 * 
 * @param {int} quant - Number of lines to generate
 */
async function generateCsv(quant) {
  /**
   * Id	-> id
   * status_civil	-> pf/maritalStatusCode
   * sexo	-> pf/sex
   * data_nascimento -> pf/birthDate
   * saldo conta_corrente -> balances/availableAmount
   * valor_financiamento -> contract/contractAmount
   * patrimonio -> qualifications/informedPatrimony/amount
   * ocupação	-> 
   * tempo_emprego_atual -> 
   * salario -> qualifications/informedIncome/amount
   * tipo_de_moradia	
   * numero_dependentes	
   * Bom_mal_pagador -> pf/bomPagador
   */
  /**
   * CSV headers
   */
  var csv = "Id;status_civil;sexo;data_nascimento;saldo conta_corrente;valor_financiamento;patrimonio;ocupação;"+
  "tempo_emprego_atual;salario;tipo_de_moradia;numero_dependentes;Bom_mal_pagador\n";

  /**
   * Generate the quant amount of lines
   */
  for (var i = 0; i < quant; i++) {
    var id = i;
    var pf = await generatePf(id);
    var qualification = await generateQualifications(id);
    var balances = await generateBalances(id);
    var contract = await generateContract(id);
    
    /**
     * Convert string to json object 
     */
    var pfJson = JSON.parse(JSON.stringify(pf))[0];
    var qualificationJson = JSON.parse(JSON.stringify(qualification))[0];
    var balancesJson = JSON.parse(JSON.stringify(balances))[0];
    var contractJson = JSON.parse(JSON.stringify(contract))[0];

    /**
     * Append line to csv
     */
    csv += id + ";" + pfJson.data.maritalStatusCode + ";" + pfJson.data.sex + ";" + pfJson.data.birthDate + ";" 
    + balancesJson.data.availableAmount + ";" + contractJson.data.contractAmount + ";" + qualificationJson.data.informedPatrimony.amount
    + ";" + ";" + ";" + qualificationJson.data.informedIncome.amount + ";" + ";" + ";" + pfJson.data.bomPagador + "\n";
  }
  
  /**
   * Write to file
   */
  fs.writeFile('output.csv', csv, err => {
    if (err) {
      console.error(err)
      return
    }
    // File written successfully
  });
}

/**
 * Returns values of the JSON object
 * 
 * @param {JSON} obj  - JSON object
 * 
 * @returns 
 */
function eachRecursive(obj)
{
  var values = [];

  for (var k in obj) {
    if (typeof obj[k] === 'object') {
      values = values.concat(eachRecursive(obj[k]));
    } else {
      values.push(obj[k]);
    }
  }

  return values;
}

/**
 * Returns keys of the JSON object
 * 
 * @param {JSON} obj - JSON object
 * 
 * @returns 
 */
function eachRecursiveKeys(obj) {
  var values = [];

  for (var k in obj) {
    if (typeof obj[k] === 'object') {
      values = values.concat(eachRecursiveKeys(obj[k]));
    } else {
      values.push(k);
    }
  }

  return values;
}

/**
 * Generate a csv file with the given number of records, with all fields available
 * 
 * @param {int} quant - number of records to generate
 */
async function generateFullCsv(quant) {
  
  csv = "";

  /**
   * Generate keys
   */
  var pf = await generatePf(0);
  var qualification = await generateQualifications(0);
  var balances = await generateBalances(0);
  var contract = await generateContrato(0);
  
  /**
   * Convert string to json object
   */
  var pfJson = JSON.parse(JSON.stringify(pf))[0].data;
  var qualificationJson = JSON.parse(JSON.stringify(qualification))[0].data;
  var balancesJson = JSON.parse(JSON.stringify(balances))[0].data;
  var contractJson = JSON.parse(JSON.stringify(contract))[0].data;
  var pfJsonKeys = eachRecursiveKeys(pfJson);
  var qualificationJsonKeys = eachRecursiveKeys(qualificationJson);
  var balancesJsonKeys = eachRecursiveKeys(balancesJson);
  var contractJsonKeys = eachRecursiveKeys(contractJson);
  
  /**
   * Append to CSV
   */
  for (val in pfJsonKeys) {
    csv += pfJsonKeys[val] + ";";
  }
  for (val in qualificationJsonKeys) {
    csv += qualificationJsonKeys[val] + ";";
  }
  for (val in balancesJsonKeys) {
    csv += balancesJsonKeys[val] + ";";
  }
  for (val in contractJsonKeys) {
    csv += contractJsonKeys[val] + ";";
  }
  csv += "\n";

  /**
   * Generate values
   */
  for (var i = 0; i < quant; i++) {
    var id = i;
    var pf = await generatePf(id);
    var qualification = await generateQualifications(id);
    var balances = await generateBalances(id);
    var contract = await generateContrato(id);
    
    /**
     * Convert string to json object
     */ 
    var pfJson = JSON.parse(JSON.stringify(pf))[0].data;
    var qualificationJson = JSON.parse(JSON.stringify(qualification))[0].data;
    var balancesJson = JSON.parse(JSON.stringify(balances))[0].data;
    var contractJson = JSON.parse(JSON.stringify(contract))[0].data;

    var pfJsonValues = eachRecursive(pfJson);
    var qualificationJsonValues = eachRecursive(qualificationJson);
    var balancesJsonValues = eachRecursive(balancesJson);
    var contractJsonValues = eachRecursive(contractJson);   
    
    /**
     * Append to CSV
     */
    for (val in pfJsonValues) {
        csv += pfJsonValues[val] + ";";
    }

    for (val in qualificationJsonValues) {
        csv += qualificationJsonValues[val] + ";";
    }

    for (val in balancesJsonValues) {
        csv += balancesJsonValues[val] + ";";
    }

    for (val in contractJsonValues) {
        csv += contractJsonValues[val] + ";";
    }

    csv += "\n";
  }

  /**
   * Write to file
   */
  fs.writeFile('outputFull.csv', csv, err => {
    if (err) {
      console.error(err)
      return
    }
    // File written successfully
  });
}

/**
 * Generate a custom csv file with the given number of records, with certain fields
 * 
 * @param {int} quant - number of records to generate
 */
async function generateCustomCsv(quant) {
  /**
   * Id -> id
   * creliq -> pf/creliq
   * idade -> pf/idade
   * status_civil -> pf/maritalStatusCode
   * ocupacao -> pf/ocupacao
   * numero_dependentes -> pf/numeroDependentes
   * renda_mensal -> qualifications/informedIncome/amount
   * valor_patrim -> qualifications/informedPatrimony/amount
   * valor_financ -> contract/contractAmount
   * cred_aberto -> pf/credAberto
   */

  /**
   * CSV header
   */
  var csv = "Id;creliq;idade;status_civil;ocupacao;numero_dependentes;renda_mensal;valor_patrim;valor_financ;cred_aberto\n";
  
  /**
   * Generate quant records
   */
  for (var i = 0; i < quant; i++) {
    var id = i;
    var pf = await generatePf(id);
    var qualification = await generateQualifications(id);
    var contract = await generateContrato(id);
    var balances = await generateBalances(id);

    /**
     * Convert string to json object
     */
    var pfJson = JSON.parse(JSON.stringify(pf))[0].data;
    var qualificationJson = JSON.parse(JSON.stringify(qualification))[0].data;
    var contractJson = JSON.parse(JSON.stringify(contract))[0].data;

    /**
     * Append to CSV
     */
    csv += id + ";" + pfJson.creliq + ";" + pfJson.idade + ";" + pfJson.maritalStatusCode + ";" + pfJson.ocupacao 
    + ";" + pfJson.numeroDependentes + ";" + qualificationJson.informedIncome.amount + ";" 
    + qualificationJson.informedPatrimony.amount + ";" + contractJson.contractAmount + ";" + pfJson.credAberto + "\n";
  }
  
  /**
   * Write to file
   */
  fs.writeFile('outputCustom.csv', csv, err => {
    if (err) {
      console.error(err)
      return
    }
    // File written successfully
  });
}

/**
 * Return with custom fields
 * 
 * @param {int} id - id of the record
 */
 async function returnCustom(id) {
  /**
   * Generate record
   */
  var pf = await generatePf(id);
  var qualification = await generateQualifications(id);
  var contract = await generateContrato(id);
  var balances = await generateBalances(id);

  /**
   * Convert string to json object
   */
  var pfJson = JSON.parse(JSON.stringify(pf))[0].data;
  var qualificationJson = JSON.parse(JSON.stringify(qualification))[0].data;
  var contractJson = JSON.parse(JSON.stringify(contract))[0].data;
  var balancesJson = JSON.parse(JSON.stringify(balances))[0].data;
  
  var json = {
      "data": {
        "id": id,
        "status_civil": pfJson.maritalStatusCode,
        "sexo": pfJson.sex,
        "data_nascimento": pfJson.birthDate,
        "saldo_conta_corrente": balancesJson.availableAmount,
        "valor_financiamento": contractJson.contractAmount,
        "patrimonio": qualificationJson.informedPatrimony.amount,
        "ocupacao": pfJson.ocupacao,
        "tempo_emprego_atual": "",
        "salario": qualificationJson.informedIncome.amount,
        "tipo_de_moradia": "",
        "numero_dependentes": pfJson.numeroDependentes,
        "Bom_mal_pagador": pfJson.bomPagador,
        "creliq": pfJson.creliq,
        "cred_aberto": pfJson.credAberto,
        "idade": pfJson.idade,
      }
    }
  ;

  return json;
}
  
/**
 * Export functions
 */
module.exports = {
  generateContrato: generateContrato,
  generateBalances: generateBalances,
  generatePf: generatePf,
  generateQualifications: generateQualifications,
  generateCsv: generateCsv,
  generateFullCsv: generateFullCsv,
  generateCustomCsv: generateCustomCsv,
  returnCustom: returnCustom
};
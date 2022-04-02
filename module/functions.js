const { faker } = require('@faker-js/faker');
const fakerBr = require('faker-br');
const fs = require('fs');

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
  
    let contractDate = faker.date.between('2018-01-01', '2022-01-01').toISOString().substring(0, 10);
  
    let disbursementDate = faker.date.between(contractDate, '2028-01-01').toISOString().substring(0, 10);
  
    let settlementDate = faker.date.between(disbursementDate, '2029-01-01').toISOString().substring(0, 10);
  
    let dueDate = faker.date.between(settlementDate, '2030-01-01').toISOString().substring(0, 10);
  
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
          "contractAmount": faker.datatype.number({ min: 10000, max: 99999999, precision: 0.01 }),
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
  
  async function generatePf(id) {
    /**
     * Generate each contract based on the id, if the id is the same, return the
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
  
    if (feeRateTmp < 0.95) {
      goodPayeeTmp = 1;
    }
  
    return [
      {
        "data": {
          "birthDate": faker.date.between('1940-01-01', '2000-01-01').toISOString().substring(0, 10),
          "maritalStatusCode": faker.random.arrayElement(maritalStatusCode),
          "sex": faker.random.arrayElement(sexo),
          "bomPagador": goodPayeeTmp
        }
      }
    ];
  }
  
  async function generateBalances(id) {
    /**
     * Generate each contract based on the id, if the id is the same, return the
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
  
  async function generateQualifications(id) {
    /**
     * Generate each qualification based on the id, if the id is the same, return the
     * same values
     */
    faker.seed(parseInt(id));
  
    return [
      {
        "data": {
          "updateDateTime": faker.date.recent(),
          "companyCnpj": fakerBr.br.cnpj(),
          "occupationCode": faker.random.arrayElement(occupationCodes),
          "occupationDescription": "01",
          "informedIncome": {
            "frequency": faker.random.arrayElement(frequencies),
            "amount": faker.datatype.number({ min: 0, max: 99999999, precision: 0.0001 }),
            "currency": "BRL",
            "date": faker.date.recent()
          },
          "informedPatrimony": {
            "amount": faker.datatype.number({ min: 0, max: 99999999, precision: 0.0001 }),
            "currency": "BRL",
            "year": faker.date.recent(2000).toISOString().substring(0, 4)
          }
        }
      }
    ];
  }
  
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
    var csv = "Id;status_civil;sexo;data_nascimento;saldo conta_corrente;valor_financiamento;patrimonio;ocupação;tempo_emprego_atual;salario;tipo_de_moradia;numero_dependentes;Bom_mal_pagador\n";
    for (var i = 0; i < quant; i++) {
      var id = i;
      var pf = await generatePf(id);
      var qualification = await generateQualifications(id);
      var balances = await generateBalances(id);
      // convert string to json object
      var pfJson = JSON.parse(JSON.stringify(pf))[0];
      var qualificationJson = JSON.parse(JSON.stringify(qualification))[0];
      var balancesJson = JSON.parse(JSON.stringify(balances))[0];
      console.log(qualificationJson);
  
      csv += id + ";" + pfJson.data.maritalStatusCode + ";" + pfJson.data.sex + ";" + pfJson.data.birthDate + ";" 
      + balancesJson.data.availableAmount + ";" + ";" + qualificationJson.data.informedPatrimony.amount
      + ";" + ";" + ";" + qualificationJson.data.informedIncome.amount + ";" + ";" + ";" + pfJson.data.bomPagador + "\n";
    }
    
    fs.writeFile('output.csv', csv, err => {
      if (err) {
        console.error(err)
        return
      }
      //file written successfully
    });
}

module.exports = {
  generateContrato: generateContrato,
  generateBalances: generateBalances,
  generatePf: generatePf,
  generateQualifications: generateQualifications,
  generateCsv: generateCsv
};
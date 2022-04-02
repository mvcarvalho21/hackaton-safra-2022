// Use this file only as a guide for first steps. Delete it when you have added your own routes files.
// For a detailed explanation regarding each routes property, visit:
// https://mocks-server.org/docs/get-started-routes

// users data

const {generateContrato,generateBalances,generatePf,generateQualifications,generateCsv} = require("../../module/functions.js")

module.exports = [
  {
    id: "contracts", // id of the route
    url: "/financings/v1/contracts/:id", // url in express format
    method: "GET", // HTTP method
    variants: [
      {
        id: "success", // id of the variant
        response: async (req, res) => {
          const contractId = req.params.id;
          res.status(200);
          const response = await generateContrato(contractId)
          res.send(response);
        },
      }
    ],
  },
  {
    id: "identifPessoaFisica", // id of the route
    url: "/customers/v1/personal/identifications/:id", // url in express format
    method: "GET", // HTTP method
    variants: [
      {
        id: "success", // id of the variant
        response: async (req, res) => {
          const pessoaId = req.params.id;
          res.status(200);
          const response = await generatePf(pessoaId)
          res.send(response);
        },
      },
      {
        id: "error", // id of the variant
        response: {
          status: 400, // status to send
          body: {
            // body to send
            message: "Error",
          },
        },
      },
    ],
  },
  {
    id: "balances", // id of the route
    url: "/accounts/v1/accounts/:id/balances", // url in express format
    method: "GET", // HTTP method
    variants: [
      {
        id: "success", // id of the variant
        response: async (req, res) => {
          const accountId = req.params.id;
          res.status(200);
          const response = await generateBalances(accountId)
          res.send(response);
        },
      },
      {
        id: "error", // id of the variant
        response: {
          status: 400, // status to send
          body: {
            // body to send
            message: "Error",
          },
        },
      },
    ],
  },
  {
    id: "qualifications", // id of the route
    url: "/customers/v1/personal/qualifications/:id", // url in express format
    method: "GET", // HTTP method
    variants: [
      {
        id: "success", // id of the variant
        response: async (req, res) => {
          const accountId = req.params.id;
          res.status(200);
          const response = await generateQualifications(accountId)
          res.send(response);
        },
      },
      {
        id: "error", // id of the variant
        response: {
          status: 400, // status to send
          body: {
            // body to send
            message: "Error",
          },
        },
      },
    ],
  },
  {
    id: "generateCsv", // id of the route
    url: "/gencsv/:id", // url in express format
    method: "GET", // HTTP method
    variants: [
      {
        id: "success", // id of the variant
        response: async (req, res) => {
          const quant = req.params.id;
          res.status(200);
          const response = await generateCsv(quant)
          res.send(response);
        },
      },
      {
        id: "error", // id of the variant
        response: {
          status: 400, // status to send
          body: {
            // body to send
            message: "Error",
          },
        },
      },
    ],
  }
];

const cep = require("cep-promise")
const express = require("express")
var path = require("path")

const app = express()
const port = 3333

interface GenericErrosItems {
  genericMessage: string
  serviceErrors: ErrorProps
}

interface ErrorProps {
  errors: []
  name: string
  message: string
  service: string
}

app.get("/:mycep", (req, res) => {
  const { mycep } = req.params
  cep(mycep)
    .then((result: Promise<ErrorProps>) => {
      return res.json(result)
    })
    .catch((error: ErrorProps) => {
      const genericStatus: GenericErrosItems = {
        genericMessage: "CEP não encontrado em nenhuma das bases",
        serviceErrors: error,
      }

      const filterByServiceName = (nameService: string) =>
        genericStatus.serviceErrors.errors.find(
          async (obj: Promise<ErrorProps>) =>
            (await obj).service === nameService
        )

      const response = res.json(filterByServiceName("correios"))

      return response
    })
})

app.get("/", (req, res) => {
  return res.sendFile(path.join(__dirname + "/../src/index.html"))
})

app.listen(`${port}`, () => {
  console.log("API Started!!!")
})

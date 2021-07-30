import cepPrommice from "cep-promise"
import express from "express"

const app = express()

interface GenericErrosItems {
  genericMessage: string
  serviceErrors: Error
}

interface ErrosProps {
    name: string,
    message: string
    service: string
}

app.get("/:cep", (req, res) => {
  const { cep } = req.params
  cepPrommice(cep)
    .then((result: Promise<{}>) => {
      console.log(result)
      return res.json(result)
    })
    .catch((error: Error) => {
      const genericStatus: GenericErrosItems = {
          genericMessage: "CEP não encontrado em nenhuma das bases",
          serviceErrors: error,
      }

      const filterByServiceName = (nameService: string) => genericStatus.serviceErrors.errors.find(async (obj: Promise<ErrosProps>) => (await obj).service === nameService);

      const response = res.json(filterByServiceName("correios"))

      return response
    })
})

app.listen(3333, () => {
  console.log("API Started!!!")
})

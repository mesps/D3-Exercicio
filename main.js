// Variables and const
const urlData = 'https://raw.githubusercontent.com/nivan/testPython/main/ListaParlamentarEmExercicio.csv'

// Functions
async function readCSV () {
  const dataTable = []
  await d3.csv(urlData, (data) => {
    dataTable.push(data)
  })

  return dataTable
}

function formatData (data) {
  const formattedData = {}
  data.forEach(line => {
    const keysOfObject = Object.keys(line)[0].split(';')
    const lineData = Object.values(line)[0].split(';')
    const object = {}

    for (const column in keysOfObject) {
      const key = keysOfObject[column]
      const value = lineData[column]
      
      object[key] = value
      if (column === '0' && value) {
        formattedData[value] = object
      }
    }
  })

  return formattedData
}

function separetDataByParty (data) {
  const politicalPartyList = {}
  const linesOfTable = Object.values(data)
  const partyKey = 'ListaParlamentarEmExercicio.Parlamentares.Parlamentar.IdentificacaoParlamentar.SiglaPartidoParlamentar'

  for (const politian of linesOfTable) {
    const party = politian[partyKey]
    if (!politicalPartyList[party]) politicalPartyList[party] = [politian]
    else politicalPartyList[party].push(politian)
  }

  return politicalPartyList
}

// Main
async function main () {
  const dataTable = await readCSV()
  const formattedData = formatData(dataTable)

  const politicalPartyList = separetDataByParty(formattedData)
  console.log(politicalPartyList)
}

main()
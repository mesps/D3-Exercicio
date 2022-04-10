function readCSV () {
  d3.csv(urlData, (data) => {
    dataTable.push(data)
  })
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

  console.log(formattedData)
  console.warn(Object.keys(formattedData).length)
}

const dataTable = []
const urlData = 'https://raw.githubusercontent.com/nivan/testPython/main/ListaParlamentarEmExercicio.csv'

async function main () {
  await readCSV()

  setTimeout(async () => {
    const object = {}
    formatData(dataTable)
  }, 1000)
}

main()
// Variables and const
const urlData =
  'https://raw.githubusercontent.com/nivan/testPython/main/ListaParlamentarEmExercicio.csv';

// Functions
async function readCSV() {
  const dataTable = [];
  await d3.csv(urlData, (data) => {
    dataTable.push(data);
  });

  return dataTable;
}

function formatData(data) {
  const formattedData = {};
  data.forEach((line) => {
    const keysOfObject = Object.keys(line)[0].split(';');
    const lineData = Object.values(line)[0].split(';');
    const object = {};

    for (const column in keysOfObject) {
      const key = keysOfObject[column];
      const value = lineData[column];

      object[key] = value;
      if (column === '0' && value) {
        formattedData[value] = object;
      }
    }
  });

  return formattedData;
}

function separetDataByParty(data) {
  const politicalPartyList = {};
  const linesOfTable = Object.values(data);
  const partyKey =
    'ListaParlamentarEmExercicio.Parlamentares.Parlamentar.IdentificacaoParlamentar.SiglaPartidoParlamentar';

  for (const politian of linesOfTable) {
    const party = politian[partyKey];
    if (!politicalPartyList[party]) politicalPartyList[party] = [politian];
    else politicalPartyList[party].push(politian);
  }

  return politicalPartyList;
}

function initializeSVG(height, width) {
  const svg = d3
    .select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  return svg;
}

function drawCircles(svg, politicalPartyList) {
  svg
    .append('text')
    .attr('x', 152)
    .attr('y', 175)
    .style('font-size', '3rem')
    .style('font-weight', 'bold')
    .style('font-family', 'sans-serif')
    .text(81);

  for (key in politicalPartyList) {
    // first draw group
    svg.append('g').attr('id', key).style('fill', colors[key]);

    // then draw circles
    const politians = politicalPartyList[key];

    for (index in politians) {
      const pos = positions[key][index];
      const politian = politians[index];

      svg
        .select(`#${key}`)
        .append('circle')
        .style('stroke-width', 0)
        .style('stroke', 'black')
        .style('r', 8)
        .style('cx', pos.cx)
        .style('cy', pos.cy)
        .attr(
          'id',
          politian[
            'ListaParlamentarEmExercicio.Parlamentares.Parlamentar.IdentificacaoParlamentar.CodigoParlamentar'
          ]
        )
        .on('mouseover', function (d) {
          d3.select(this).style('stroke-width', 1);
        })
        .on('mouseout', function () {
          d3.select(this).style('stroke-width', 0);
        })
        .on('click', (d) => {
          const name =
            politian[
              'ListaParlamentarEmExercicio.Parlamentares.Parlamentar.IdentificacaoParlamentar.NomeCompletoParlamentar'
            ];
          const party =
            politian[
              'ListaParlamentarEmExercicio.Parlamentares.Parlamentar.IdentificacaoParlamentar.SiglaPartidoParlamentar'
            ];
          const imageUrl =
            politian[
              'ListaParlamentarEmExercicio.Parlamentares.Parlamentar.IdentificacaoParlamentar.UrlFotoParlamentar'
            ];

          let html = createHtml(name, party, imageUrl)

          let div = document.createElement('div');
          div.innerHTML = html;
          document.getElementById('modal').appendChild(div);

          var modal = document.getElementById(`myModal ${name}`);
          var span = document.getElementById(`close ${name}`);
          span.onclick = function () {
            modal.style.display = 'none';
          };
        });
    }
  }
}

function createHtml(name, party, imageUrl){
  return `<div
    id="myModal ${name}"
    style="
      display: block;
      position: fixed;
      zIndex: 1;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      overflow: auto;
      background-color: rgba(0,0,0,0.1);
    "
  >
    <div
      style="
        margin: 15% auto;
        border: 1px solid #888;
        width: 50%;
        display: flex;
        flex-direction: column;
      "
    >
      <div
        style="
          width: 100%;
          height: 50px;
          background-color: #4F3130;
          display: flex;
          align-items: center;
          justify-content: space-between;
        "
      >
        <span
          style="
            color: #D8D78F;
            float: right;
            font-size: 28px;
            font-weight: bold;
            padding: 10px;
          "
        >
          Corrupto selecionado
        </span>
        <span
        id="close ${name}"
        style="
          color: #aaa;
          float: right;
          font-size: 28px;
          font-weight: bold;
          cursor: pointer;
          padding: 10px;
        "
      >
        &times;
      </span>
      </div>
      <div
        style="
          width: 100%;
          height: 200px;
          background-color: #753742;
          display: flex;
          align-items: center;
        "
      >
        <img src="${imageUrl}" alt="senador ${name}" style="width: 200px; height: 200px"/>
        <div
          style="
            width: 100%;
            height: 200px;
            display: flex;
            flex-direction: column;
          "
        >
          <div
            style="
              width: 100%;
              display: flex;
              align-items: start;
            "
          >
            
            <p style="
              font-size: 24px; 
              font-weight: 600; 
              color: #D8BD8A; 
              padding: 0 10px;
            ">
              Nome: 
            </p>
            <p
              style="
              font-size: 24px; 
              color: #D8D78F; 
              padding-right: 10px;
            ">
              ${name}
            </p>
          </div>
          <div
            style="
              width: 100%;
              height: 200px;
              display: flex;
              align-items: start;
            "
          >
            
            <p style="
              font-size: 24px; 
              font-weight: 600; 
              color: #D8BD8A; 
              padding: 0 10px;
            ">
              Partido: 
            </p>
            <p
              style="
              font-size: 24px; 
              color: #D8D78F; 
              padding-right: 10px;
            ">
              ${party}
            </p>
          </div>
        </div
      </div>
    </div>
    <div
        style="
          width: 100%;
          height: 50px;
          background-color: #4F3130;
        "
      />
  </div>`;
}

// Main
async function main() {
  const svg = initializeSVG(600, 600);

  const dataTable = await readCSV();
  const formattedData = formatData(dataTable);

  const politicalPartyList = separetDataByParty(formattedData);
  console.log(politicalPartyList);

  drawCircles(svg, politicalPartyList);
}

main();

// Important draw information
const colors = {
  PSOL: '#700000',
  PCdoB: '#A30000',
  PT: '#CC0000',
  PSB: '#FFCC00',
  PDT: '#A764FF',
  REDE: '#379E8D',
  CIDADANIA: '#EC008C',
  PV: '#006600',
  Solidariedade: '#FF9C2B',
  AVANTE: '#ED5F36',
  PSDB: '#0080FF',
  MDB: '#30914D',
  PODEMOS: '#082AD5',
  Independent: '#DDDDDD',
  NOVO: '#FF4D00',
  PROS: '#FF5460',
  PSD: '#FFA500',
  DEM: '#254AA5',
  PSL: '#F06000',
  PL: '#2DA933',
  PP: '#7DC9FF',
  REPUBLICANOS: '#005DAA',
  PTB: '#7B7B7B',
  PSC: '#009118',
  Patriota: '#00A29B',
};

const positions = {
  PSOL: [],
  PCdoB: [],
  PT: [
    {
      cx: '15.19',
      cy: '172.01',
    },
    {
      cx: '35.22',
      cy: '172.01',
    },
    {
      cx: '55.26',
      cy: '172.01',
    },
    {
      cx: '75.30',
      cy: '172.02',
    },
    {
      cx: '95.38',
      cy: '172.02',
    },
    {
      cx: '18.31',
      cy: '147.11',
    },
    {
      cx: '38.61',
      cy: '147.85',
    },
  ],
  PSB: [],
  PDT: [
    {
      cx: '59.36',
      cy: '147.28',
    },
    {
      cx: '79.88',
      cy: '148.36',
    },
    {
      cx: '101.36',
      cy: '147.74',
    },
  ],
  REDE: [
    {
      cx: '25.17',
      cy: '122.97',
    },
  ],
  CIDADANIA: [
    {
      cx: '46.00',
      cy: '124.61',
    },
    {
      cx: '68.32',
      cy: '123.86',
    },
  ],
  PV: [],
  Solidariedade: [],
  AVANTE: [],
  PSDB: [
    {
      cx: '35.61',
      cy: '100.15',
    },
    {
      cx: '89.73',
      cy: '126.37',
    },
    {
      cx: '57.18',
      cy: '102.93',
    },
    {
      cx: '49.39',
      cy: '79.18',
    },
    {
      cx: '81.77',
      cy: '102.70',
    },
    {
      cx: '114.16',
      cy: '126.24',
    },
    {
      cx: '71.83',
      cy: '83.44',
    },
    {
      cx: '104.33',
      cy: '107.21',
    },
  ],
  MDB: [
    {
      cx: '66.19',
      cy: '60.53',
    },
    {
      cx: '99.17',
      cy: '84.65',
    },
    {
      cx: '89.55',
      cy: '66.67',
    },
    {
      cx: '85.62',
      cy: '44.66',
    },
    {
      cx: '132.66',
      cy: '109.40',
    },
    {
      cx: '122.91',
      cy: '91.88',
    },
    {
      cx: '109.82',
      cy: '53.11',
    },
    {
      cx: '119.82',
      cy: '70.44',
    },
    {
      cx: '107.24',
      cy: '31.91',
    },
    {
      cx: '144.50',
      cy: '81.18',
    },
    {
      cx: '132.08',
      cy: '43.15',
    },
    {
      cx: '130.54',
      cy: '22.59',
    },
    {
      cx: '142.90',
      cy: '60.63',
    },
    {
      cx: '155.26',
      cy: '98.68',
    },
    {
      cx: '155.70',
      cy: '37.05',
    },
    {
      cx: '154.98',
      cy: '16.91',
    },
  ],
  PODEMOS: [
    {
      cx: '204.30',
      cy: '37.05',
    },
    {
      cx: '205.02',
      cy: '16.91',
    },
    {
      cx: '167.95',
      cy: '75.69',
    },
    {
      cx: '167.46',
      cy: '55.63',
    },
    {
      cx: '180.00',
      cy: '15.00',
    },
    {
      cx: '180.00',
      cy: '35.00',
    },
    {
      cx: '180.00',
      cy: '95.00',
    },
    {
      cx: '192.54',
      cy: '55.63',
    },
    {
      cx: '192.05',
      cy: '75.69',
    },
  ],
  Independent: [],
  NOVO: [],
  PROS: [
    {
      cx: '258.64',
      cy: '147.74',
    },
    {
      cx: '264.62',
      cy: '172.02',
    },
    {
      cx: '245.84',
      cy: '126.24',
    },
  ],
  PSD: [
    {
      cx: '217.10',
      cy: '60.63',
    },
    {
      cx: '229.46',
      cy: '22.59',
    },
    {
      cx: '227.92',
      cy: '43.15',
    },
    {
      cx: '215.50',
      cy: '81.18',
    },
    {
      cx: '252.76',
      cy: '31.91',
    },
    {
      cx: '240.18',
      cy: '70.44',
    },
    {
      cx: '250.18',
      cy: '53.11',
    },
    {
      cx: '237.09',
      cy: '91.88',
    },
    {
      cx: '255.67',
      cy: '107.21',
    },
    {
      cx: '274.38',
      cy: '44.66',
    },
    {
      cx: '260.83',
      cy: '84.65',
    },
  ],
  DEM: [
    {
      cx: '270.45',
      cy: '66.67',
    },
    {
      cx: '293.81',
      cy: '60.53',
    },
    {
      cx: '310.61',
      cy: '79.18',
    },
    {
      cx: '288.17',
      cy: '83.44',
    },
  ],
  PSL: [
    {
      cx: '227.34',
      cy: '109.40',
    },
    {
      cx: '204.74',
      cy: '98.68',
    },
  ],
  PL: [
    {
      cx: '302.82',
      cy: '102.93',
    },
    {
      cx: '270.27',
      cy: '126.37',
    },
    {
      cx: '324.39',
      cy: '100.15',
    },
    {
      cx: '291.68',
      cy: '123.86',
    },
    {
      cx: '314.00',
      cy: '124.61',
    },
    {
      cx: '278.23',
      cy: '102.70',
    },
    {
      cx: '334.83',
      cy: '122.97',
    },
    {
      cx: '280.12',
      cy: '148.36',
    },
  ],
  PP: [
    {
      cx: '300.64',
      cy: '147.28',
    },
    {
      cx: '321.39',
      cy: '147.85',
    },
    {
      cx: '341.69',
      cy: '147.11',
    },
    {
      cx: '344.81',
      cy: '172.01',
    },
    {
      cx: '284.70',
      cy: '172.02',
    },
    {
      cx: '304.74',
      cy: '172.01',
    },
    {
      cx: '324.78',
      cy: '172.01',
    },
  ],
  REPUBLICANOS: [
    {
      cx: '280.12',
      cy: '148.36',
    },
  ],
  PTB: [],
  PSC: [],
  Patriota: [],
};

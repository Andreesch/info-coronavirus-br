import React, { useState } from "react"
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts"
import { CitySelect } from "../components/CitySelect"
import Card from "../components/InfoCard"
import Layout from "../components/Layout"
import { LoadingChart } from "../components/LoadingChart"
import SEO from "../components/Seo"
import { StateSelect } from "../components/StateSelect"
import {
  useCoronavirusData,
  useCoronavirusHistoryData
} from "../utils/customHooks"

export default function Index() {
  const [selectedState, setSelectedState] = useState("")
  const [selectKey, setSelectKey] = useState(0)
  const [selectedCity, setSelectedCity] = useState("")
  const [infectedCases, setInfectedCases] = useState(0)
  const [deceasedCases, setDeceasedCases] = useState(0)
  const [selectedOption, setSelectedOption] = useState("city")
  const {
    brazilCoronavirusCases,
    loadingCoronaVirusCases
  } = useCoronavirusData(setInfectedCases, setDeceasedCases, selectKey)
  const { casesByDay, loadingCasesByDay } = useCoronavirusHistoryData()
  const handleOptionChange = e => {
    setSelectedOption(e.target.value)
    setInfectedCases(0)
    setDeceasedCases(0)
  }
  return (
    <Layout>
      <SEO keywords={["coronavirus", "brasil", "casos"]} title="Home" />
      <form className="flex">
        <div>
          <label className="text-white text-base radio-container">
            <input
              type="radio"
              value="state"
              name="radio"
              checked={selectedOption === "state"}
              onChange={handleOptionChange}
            />
            <span className="checkmark"></span>
            Pesquisar por estado
          </label>
        </div>
        <div className="radio">
          <label className="text-white text-base radio-container ml-5">
            <input
              type="radio"
              name="radio"
              value="city"
              checked={selectedOption === "city"}
              onChange={handleOptionChange}
            />
            <span className="checkmark"></span>
            Pesquisar por cidade
          </label>
        </div>
      </form>
      {selectedOption === "state" && (
        <StateSelect
          {...{
            loadingCoronaVirusCases,
            setSelectedState,
            selectedState,
            setInfectedCases,
            setDeceasedCases,
            brazilCoronavirusCases,
            selectKey,
            setSelectKey
          }}
        />
      )}
      {selectedOption === "city" && (
        <CitySelect
          {...{
            selectedCity,
            setSelectedCity,
            loadingCoronaVirusCases,
            selectKey,
            setSelectKey,
            setInfectedCases
          }}
        />
      )}
      {(selectedState || selectedCity) && (
        <div>
          <button
            className="text-white mb-5"
            onClick={() => {
              setSelectedState("")
              setSelectedCity("")
              setSelectKey(key => key + 1)
            }}
          >
            Voltar para os dados do Brasil
          </button>
        </div>
      )}

      <div className="flex flex-wrap">
        <Card
          title="Casos confirmados"
          className={
            selectedOption === "state" || !selectedCity
              ? "max-w w-full md:w-1/2 mb-5 md:pr-5"
              : "max-w w-full  mb-5 md:pr-5"
          }
          loadingCoronaVirusCases={loadingCoronaVirusCases}
          description={infectedCases}
        />

        {(selectedOption === "state" || !selectedCity) && (
          <Card
            className="max-w w-full md:w-1/2 mb-5"
            loadingCoronaVirusCases={loadingCoronaVirusCases}
            title="Mortes"
            description={deceasedCases}
          />
        )}
      </div>
      {!selectedState && !selectedCity && (
        <LoadingChart
          loading={loadingCasesByDay}
          chartData={casesByDay}
          chartTitle="Relatório diário"
        >
          <LineChart
            data={casesByDay}
            margin={{
              left: 0,
              right: 16,
              top: 24,
              bottom: 24
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              textAnchor="middle"
              tick={{
                fontSize: 16,
                angle: -25,
                stroke: "white"
              }}
              tickMargin={20}
            />
            <YAxis dataKey="confirmed" />
            <Tooltip label="date" />
            <Line dataKey="confirmed" name="Confirmados" stroke="#e74c3c" />
            <Line dataKey="deaths" name="Mortes" stroke="black" />
            <Line dataKey="recovered" name="Recuperados" stroke="#2ecc71" />
          </LineChart>
        </LoadingChart>
      )}
      <span className="text-gray-400 text-left mt-5">
        Fontes: Ministério da saúde; Wordometer; Johns Hopkings
      </span>
    </Layout>
  )
}

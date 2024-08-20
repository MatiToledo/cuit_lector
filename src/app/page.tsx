"use client";
import { SearchIcon } from "@/ui/icons";
import getNameAndCuitBySearch from "@/utils/getNameAndCuitBySearch";
import getPersonData from "@/utils/getPersonData";
import { Button, Input } from "@nextui-org/react";
import { Spinner } from "@nextui-org/spinner";
import { useState } from "react";
import { DataSheetGrid, keyColumn, textColumn } from "react-datasheet-grid";

export default function Home() {
  const [q, setQ] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>([
    {
      name: "",
      cuit: "",
      type: "",
      address: "",
      locality: "",
      earnings: "",
      gender: "",
      isEmployer: "",
      activity: "",
      activitySecondary: "",
    },
  ]);

  async function handleOnClick() {
    try {
      setIsLoading(true);
      const { name, cuit } = await getNameAndCuitBySearch(q);
      const data = await getPersonData(cuit, name);
      setData([{ ...data }]);
      setIsLoading(false);
    } catch (error) {
      console.log("error: ", error);
    }
  }

  const columns = [
    { ...keyColumn("name", textColumn), title: "Nombre" },
    { ...keyColumn("cuit", textColumn), title: "CUIT" },
    { ...keyColumn("address", textColumn), title: "Dirección" },
    { ...keyColumn("locality", textColumn), title: "Localidad" },
    { ...keyColumn("activity", textColumn), title: "Actividad" },
    {
      ...keyColumn("activitySecondary", textColumn),
      title: "Actividad Secundaria",
    },
    { ...keyColumn("type", textColumn), title: "Tipo" },
    {
      ...keyColumn("isEmployer", textColumn),
      title: "Empleador",
    },
    { ...keyColumn("gender", textColumn), title: "Genero" },
    { ...keyColumn("earnings", textColumn), title: "Ganancias" },
  ];

  return (
    <main className="flex min-h-screen flex-col justify-start p-10">
      <div className="mb-5 flex flex-row max-w-xl gap-5 justify-center w-full">
        <Input
          type="text"
          size="sm"
          label="CUIT"
          value={q}
          onValueChange={setQ}
          startContent={
            <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
          }></Input>
        <Button onClick={handleOnClick} size="lg" color="default">
          Buscar
        </Button>
      </div>
      {isLoading ? (
        <Spinner></Spinner>
      ) : (
        <DataSheetGrid
          addRowsComponent={false}
          value={data}
          onChange={setData}
          columns={columns}
        />
      )}
    </main>
  );
}

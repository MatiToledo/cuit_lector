import axios from "axios";
import * as cheerio from "cheerio";

export default async function getPersonData(cuit: string, name: string) {
  try {
    const response = await axios.get(`/api/detail/${cuit}/${name}`);
    const html = response.data;
    const $ = cheerio.load(html);
    const metaDescription = $('meta[name="description"]').attr("content");
    const metaData = metaDescription?.split("·");

    let activityText = "";

    activityText = $('li:contains("Actividad:")').find("span").text();
    if (!activityText) {
      activityText = $('li:contains("Actividades:")').find("span").text();
    }
    console.log("activityText: ", activityText);
    let activity = "";
    if (activityText.includes("(")) {
      const start = activityText.indexOf("-") + 1;
      const end = activityText.indexOf("(");

      activity = activityText.substring(start, end).trim();
    } else {
      const start = activityText.indexOf("-") + 1;
      const end = activityText.indexOf("»");
      activity = activityText.substring(start, end).trim();
    }

    let activitySecondary = "";
    if (activityText.includes("#2")) {
      const indexTwo = activityText.indexOf("#2");
      const textFromTwo = activityText.slice(indexTwo, activityText.length);
      if (activityText.includes("(")) {
        const start = textFromTwo.indexOf("-") + 1;
        const end = textFromTwo.indexOf("(");

        activitySecondary = textFromTwo.substring(start, end).trim();
      } else {
        const start = textFromTwo.indexOf("-") + 1;
        const end = textFromTwo.indexOf("»");
        activitySecondary = textFromTwo.substring(start, end).trim();
      }
    }
    console.log("activitySecondary: ", activitySecondary);

    const gender = $('span[itemprop="gender"]').text().trim();
    const isEmployer = $('li:contains("Empleador:")')
      .find("span.p_cuit.c_black")
      .text()
      .trim();

    if (metaData) {
      return {
        name: metaData[0].trim(),
        cuit: metaData
          .filter((item) => item.includes("CUIT:"))[0]
          .split(":")[1]
          .trim(),
        type: metaData.filter((item) => item.includes("Persona"))[0].trim(),
        address: metaData[3].trim(),
        locality: metaData
          .filter((item) => item.includes("Localidad:"))[0]
          .split(":")[1]
          .trim(),
        earnings: metaData
          .filter((item) => item.includes("Ganancias:"))[0]
          .split(":")[1]
          .trim(),
        gender,
        isEmployer,
        activity,
        activitySecondary,
      };
    }
  } catch (error) {
    console.error(error);
  }
}

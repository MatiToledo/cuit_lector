import axios from "axios";
import * as cheerio from "cheerio";

export default async function getNameAndCuitBySearch(q: string): Promise<any> {
  try {
    const response = await axios.get(`/api/search?q=${q}`);
    const html = response.data;

    const $ = cheerio.load(html);

    const metaDescription = $('meta[name="description"]').attr("content");
    const match = metaDescription?.match(/CuitOnline\.\s*(.*)/);
    if (match) {
      const result = match[1];
      const name = result
        .split("-")[0]
        .trim()
        .replace(/\s*\.\s*/g, ".")
        .replace(/ /g, "-")
        .replace(/\.$/, "");
      const cuit = result.split("-")[1].trim().replace(/;/g, "");

      return { name, cuit };
    } else {
      throw new Error("No match found");
    }
    return { name: "", cuit: "" };
  } catch (error) {
    console.error(error);
  }
}

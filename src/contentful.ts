import { createClient } from "contentful";
import * as fs from "fs";
require("dotenv").config();

if (!(process.env.CONTENTFUL_SPACE && process.env.CONTENTFUL_TOKEN)) {
    throw new Error("Contentful configuration isn't full");
}

const client = createClient({
    space: process.env.CONTENTFUL_SPACE,
    accessToken: process.env.CONTENTFUL_TOKEN
});

const writeToFile = (data: unknown, fileName: string) => {
    fs.writeFileSync(`${fileName}.json`, JSON.stringify(data, null, 2));
};

const fetchEntriesAndWriteToFile = async ({
    contentType,
    fileName,
}: {
    contentType: string;
    fileName: string;
}) => {
    try {
        const entries = await client.withAllLocales.withoutUnresolvableLinks.getEntries({ content_type: contentType, include: 10 });

        writeToFile(entries.items, fileName);
        console.log(`Entries successfully written to ${fileName}.json`);
    } catch (error) {
        console.error(`Error fetching entries. Content type: ${contentType}`, error);
    }
};

fetchEntriesAndWriteToFile({ contentType: "vault", fileName: "vaults" });

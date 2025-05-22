require("dotenv").config({
	path: ".env.local",
});
const { execSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const apiUrl = process.argv[2];
const token = process.argv[3];

if (!apiUrl || !token) {
	console.error("Error: Missing required environment variables");
	process.exit(1);
}

const openApiFilePath = path.join(__dirname, "openapi.yaml");

const curlCommand = `curl -H "PRIVATE-TOKEN:${token}" -o ${openApiFilePath} ${apiUrl}`;

try {
	execSync(curlCommand, { stdio: "inherit" });
	console.log("OpenAPI file downloaded successfully.");

	const openApiTypesCommand = `npx openapi-typescript ${openApiFilePath} -o src/schemas/notifications-api.ts`;

	execSync(openApiTypesCommand, { stdio: "inherit" });
	console.log("Types generated successfully.");
} catch (error) {
	console.error("Error:", error);
	process.exit(1);
} finally {
	if (fs.existsSync(openApiFilePath)) {
		fs.unlinkSync(openApiFilePath);
		console.log("Temporary OpenAPI file deleted.");
	}
}

#!/usr/bin/env node

const esbuild = require("esbuild");
const fs = require("fs");
const path = require("path");
const archiver = require("archiver");
const rimraf = require("rimraf");

const sourceDir = "src";
const buildDir = `dist`;
const outputDir = "build";
const modname = path.basename(__dirname);

// Exclude .d.ts files.
const files = fs
	.readdirSync(sourceDir, { recursive: true })
	.map(file => path.join(".", sourceDir, file))
	.filter(file => fs.statSync(file).isFile())
	.filter(file => !file.endsWith(".d.ts"));

let postFunc;
if (fs.existsSync("./esbuild-post.js")) {
	postFunc = require("./esbuild-post.js").post;
}
const esbuildArgs = {
	entryPoints: files,
	bundle: false,
	outdir: path.join(buildDir, modname),
	platform: "node",
	tsconfig: path.join(__dirname, "tsconfig.json"),
	target: "es2018",
	plugins: [
		{
			name: "create-ccmod",
			setup(build) {
				build.onStart(() => {
					rimraf.sync(buildDir);
					rimraf.sync(outputDir);
					fs.mkdirSync(buildDir);
					fs.mkdirSync(outputDir);
				});
				build.onEnd(() => {
					const assetsSourcePath = "assets";
					const assetsDestPath = path.join(buildDir, "assets");
					fs.mkdirSync(assetsDestPath, { recursive: true });
					fs.cpSync(assetsSourcePath, assetsDestPath, { recursive: true });
					fs.cpSync(path.join(__dirname, "ccmod.json"), path.join(buildDir, "ccmod.json"));

					// Zip dist contents and copy to build directory.
					const outputZip = path.join(__dirname, outputDir, `${modname}.ccmod`);
					console.log(path.join(__dirname, outputDir, `${modname}.ccmod`));
					const zipStream = fs.createWriteStream(outputZip);
					const archive = archiver("zip", { zlib: { level: 9 } });

					archive.pipe(zipStream);
					archive.directory(buildDir, false);
					archive.finalize();

					postFunc && postFunc();
				});
			},
		},
	],
};

const arg0 = process.argv[2];
if (arg0 == "watch") {
	async function watch() {
		let ctx = await esbuild.context(esbuildArgs);
		await ctx.watch();
		console.log("Watching...");
	}
	watch();
} else {
	esbuild.build(esbuildArgs);
}

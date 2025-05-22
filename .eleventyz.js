const fs = require('fs');
const path = require('path');
const crypto = require("crypto");
const cssnano = require('cssnano');
const postcss = require('postcss');
const tailwindcss = require('@tailwindcss/postcss');
const shopUrl = process.env.SHOP_URL || 'https://htmlcssjs.org';

const { minify: terserMinify } = require('terser');
const JavaScriptObfuscator = require('javascript-obfuscator');
const htmlMinifier = require('html-minifier-terser');

module.exports = function (eleventyConfig) {

  // Minify HTML output
  eleventyConfig.addTransform('html-minify', async (content, outputPath) => {
    if (outputPath && outputPath.endsWith('.html')) {
      let minified = await htmlMinifier.minify(content, {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        minifyCSS: true,
        minifyJS: true,
      });
      return minified;
    }
    return content;
  });

  // After build: Minify + Obfuscate all JS files inside dist/assets/js
  eleventyConfig.on('afterBuild', async () => {
    const jsRootDir = path.join(__dirname, 'dist/assets/js');

    const processJSFiles = async (dirPath) => {
      const entries = fs.readdirSync(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);

        if (entry.isDirectory()) {
          await processJSFiles(fullPath); // recursive
        } else if (entry.isFile() && fullPath.endsWith('.js')) {
          console.log(`🚀 Processing: ${fullPath}`);

          const originalCode = fs.readFileSync(fullPath, 'utf8');

          // Step 1: Minify
          const minified = await terserMinify(originalCode, {
            compress: true,
            mangle: true,
            format: {
              comments: false,
            }
          });

          if (!minified.code) {
            console.error(`❌ Failed to minify: ${fullPath}`);
            continue;
          }

          // Step 2: Obfuscate
          const obfuscated = JavaScriptObfuscator.obfuscate(minified.code, {
            compact: true,
            controlFlowFlattening: true,
            controlFlowFlatteningThreshold: 0.75,
            deadCodeInjection: true,
            deadCodeInjectionThreshold: 0.4,
            stringArray: true,
            stringArrayEncoding: ['rc4'],
            stringArrayThreshold: 0.75,
            renameGlobals: false,
            rotateStringArray: true,
            simplify: true,
            splitStrings: true,
            splitStringsChunkLength: 8,
            selfDefending: true,
            unicodeEscapeSequence: true,
          });

          fs.writeFileSync(fullPath, obfuscated.getObfuscatedCode(), 'utf8');
          console.log(`✅ Done: ${fullPath}`);
        }
      }
    };

    await processJSFiles(jsRootDir);
  });


  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/public");
  eleventyConfig.addPassthroughCopy("src/robots.txt");

  eleventyConfig.on('eleventy.beforeWatch', async (changedFiles) => {
    const ignoredFiles = "./src/assets/css/style.css";
    if (changedFiles.includes(ignoredFiles)) return;
    const tailwindInputPath = path.resolve('./src/assets/css/main.css');
    const tailwindOutputPath = './src/assets/css/style.css';
    const cssContent = fs.readFileSync(tailwindInputPath, 'utf8');
    const outputDir = path.dirname(tailwindOutputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const result = await processor.process(cssContent, {
      from: tailwindInputPath,
      to: tailwindOutputPath,
    });

    fs.writeFileSync(tailwindOutputPath, result.css);
    
  });

  const processor = postcss([
    //compile tailwind
    tailwindcss(),

    //minify tailwind css
    cssnano({
      preset: 'default',
    }),
  ]);

  eleventyConfig.addFilter("dump", obj => {
    return JSON.stringify(obj, null, 2);
  });

  eleventyConfig.addFilter("canonical", function (pageUrl) {
    return shopUrl + pageUrl;
  });

  eleventyConfig.addFilter("isodate", function (date) {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString();
  });

  const buildVersion = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 12);
  eleventyConfig.addFilter("version", (assetPath) => {
    return `${assetPath}?v=${buildVersion}`;
  });

  eleventyConfig.addCollection("pages", function (collectionApi) {
    return collectionApi.getFilteredByTag("pages");
  });

  // Tạo collection grouped by collection_slug
  eleventyConfig.addCollection("tools", function (collectionApi) {
    let collections = {};
    collectionApi.getFilteredByTag("tools").forEach(item => {
      const slug = item.data.collection_slug;
      if (!slug) return;

      if (!collections[slug]) {
        collections[slug] = {
          name: item.data.collection,
          slug: slug,
          url: item.data.collection_url,
          items: [...collectionApi.getFilteredByTag("tool").filter(i => i.collection_url === item.url)]
        };
      }
    });
    
    return Object.values(collections);
  });

  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "_includes",
      layouts: "_layouts",
      data: "_data"
    },
    templateFormats: ["html", "liquid", "md", "njk"],
    dataTemplateEngine: "liquid",
    htmlTemplateEngine: "liquid",
    markdownTemplateEngine: "liquid",
    passthroughFileCopy: true
  };
};
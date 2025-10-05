const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const isWatch = process.argv.includes('--watch');

const buildOptions = {
  entryPoints: [
    'background.ts',
    'content.ts',
    'popup.ts'
  ],
  bundle: true,
  outdir: 'dist',
  platform: 'browser',
  target: 'chrome96',
  format: 'iife',
  sourcemap: isWatch,
};

async function build() {
  try {
    // Create dist directory if it doesn't exist
    if (!fs.existsSync('dist')) {
      fs.mkdirSync('dist');
    }

    if (isWatch) {
      const ctx = await esbuild.context(buildOptions);
      await ctx.watch();
      console.log('Watching for changes...');
    } else {
      await esbuild.build(buildOptions);
      console.log('Build complete!');
    }
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build();

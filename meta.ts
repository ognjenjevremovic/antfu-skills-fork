export interface VendorSkillMeta {
  official?: boolean
  source: string
  skills: Record<string, string> // sourceSkillName -> outputSkillName
  posthook?: (sourcePath: string, outputPath: string) => void
}

/**
 * Repositories to clone as submodules and generate skills from source
 */
export const submodules = {
  vue: 'https://github.com/vuejs/docs',
  nuxt: 'https://github.com/nuxt/nuxt',
  vite: 'https://github.com/vitejs/vite',
  unocss: 'https://github.com/unocss/unocss',
  pnpm: 'https://github.com/pnpm/pnpm.io',
  pinia: 'https://github.com/vuejs/pinia',
  vitest: 'https://github.com/vitest-dev/vitest',
  vitepress: 'https://github.com/vuejs/vitepress',
  nitro: 'https://github.com/nitrojs/nitro',
}

/**
 * Already generated skills, sync with their `skills/` directory
 */
export const vendors: Record<string, VendorSkillMeta> = {
  'slidev': {
    official: true,
    source: 'https://github.com/slidevjs/slidev',
    skills: {
      slidev: 'slidev',
    },
  },
  'vueuse': {
    official: true,
    source: 'https://github.com/vueuse/vueuse',
    skills: {
      'vueuse-functions': 'vueuse-functions',
    },
  },
  'tsdown': {
    official: true,
    source: 'https://github.com/rolldown/tsdown',
    skills: {
      tsdown: 'tsdown',
    },
  },
  'vuejs-ai': {
    source: 'https://github.com/vuejs-ai/skills',
    skills: {
      'vue-best-practices': 'vue-best-practices',
      'vue-router-best-practices': 'vue-router-best-practices',
      'vue-testing-best-practices': 'vue-testing-best-practices',
    },
  },
  'turborepo': {
    official: true,
    source: 'https://github.com/vercel/turborepo',
    skills: {
      turborepo: 'turborepo',
    },
  },
  'web-design-guidelines': {
    source: 'https://github.com/vercel-labs/agent-skills',
    skills: {
      'web-design-guidelines': 'web-design-guidelines',
    },
  },
}

/**
 * Hand-written skills with Anthony Fu's preferences/tastes/recommendations
 */
export const manual = [
  'antfu',
]

/**
 * Posthook to create `skills` directory and move related files there, used for repositories that don't have a `skills` directory but have skill files in the root or other directories.
 */
async function _posthook_createSkillsDirectory(
  filesToMove: string[] = [
    'AGENTS.md',
    'SKILL.md',
  ],
  directoriesToMove: string[] = [
    'skills',
    'rules',
  ],
  sourcePath: string,
  outputPath: string,
) {
  // Check if `skills` directory exists, if not, create it and move the related files there
  const fs = await import('node:fs')
  const path = await import('node:path')
  const skillsDir = path.join(outputPath, 'skills')

  if (!fs.existsSync(skillsDir)) {
    fs.mkdirSync(skillsDir)
  }

  for (const file of filesToMove) {
    const src = path.join(sourcePath, file)
    const dest = path.join(skillsDir, file)

    if (fs.existsSync(src)) {
      fs.renameSync(src, dest)
    }
  }

  for (const dir of directoriesToMove) {
    const srcDir = path.join(sourcePath, dir)
    const destDir = path.join(skillsDir, dir)

    if (fs.existsSync(srcDir)) {
      fs.renameSync(srcDir, destDir)
    }
  }
}

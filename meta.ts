export interface VendorSkillMeta {
  official?: boolean
  source: string
  skills: Record<string, string> // sourceSkillName -> outputSkillName
  vendorBeforehook?: (sourcePath: string) => Promise<void>
  vendorPosthook?: (sourcePath: string) => Promise<void>
}

/**
 * Repositories to clone as submodules and generate skills from source
 */
export const submodules = {
  'vue': 'https://github.com/vuejs/docs',
  'nuxt': 'https://github.com/nuxt/nuxt',
  'vite': 'https://github.com/vitejs/vite',
  'unocss': 'https://github.com/unocss/unocss',
  'pnpm': 'https://github.com/pnpm/pnpm.io',
  'pinia': 'https://github.com/vuejs/pinia',
  'vitest': 'https://github.com/vitest-dev/vitest',
  'vitepress': 'https://github.com/vuejs/vitepress',
  'nitro': 'https://github.com/nitrojs/nitro',
  'nestjs': 'https://github.com/nestjs/nest',
  'zod': 'https://github.com/colinhacks/zod',
  'primevue': 'https://github.com/primefaces/primevue',
  'vee-validate': 'https://github.com/logaretm/vee-validate',
  'ofetch': 'https://github.com/unjs/ofetch',
  'playwright': 'https://github.com/microsoft/playwright',
  'keyv': 'https://github.com/jaredwray/keyv',
  'opentelemetry': 'https://github.com/open-telemetry/opentelemetry-js',
  'sentry': 'https://github.com/getsentry/sentry-javascript',
  'rxjs': 'https://github.com/reactivex/rxjs',
  'pino': 'https://github.com/pinojs/pino',
  'pg-boss': 'https://github.com/timgit/pg-boss',
  'pg': 'https://github.com/brianc/node-postgres',
  'nodemailer': 'https://github.com/nodemailer/nodemailer',
  'helmet': 'https://github.com/helmetjs/helmet',
  'jsonwebtoken': 'https://github.com/auth0/node-jsonwebtoken',
  'cookie': 'https://github.com/jshttp/cookie',
  'typeorm': 'https://github.com/nestjs/typeorm',
  'cache-manager': 'https://github.com/jaredwray/cacheable',
  'class-validator': 'https://github.com/typestack/class-validator',
  'class-transformer': 'https://github.com/typestack/class-transformer',
  'supertest': 'https://github.com/forwardemail/supertest',
  'jest': 'https://github.com/jestjs/jest',
  // nestjs modules
  'nestjs-pino': 'https://github.com/iamolegga/nestjs-pino',
  'nestjs-zod': 'https://github.com/BenLorantfy/nestjs-zod',
  'nestjs-schedule': 'https://github.com/nestjs/schedule',
  'nestjs-jwt': 'https://github.com/nestjs/jwt',
  'nestjs-typeorm': 'https://github.com/nestjs/typeorm',
  'nestjs-terminus': 'https://github.com/nestjs/terminus',
  'nestjs-event-emitter': 'https://github.com/nestjs/event-emitter',
  'nestjs-cache-manager': 'https://github.com/nestjs/cache-manager',
  'nestjs-swagger': 'https://github.com/nestjs/swagger',
  'nestjs-throttler': 'https://github.com/nestjs/throttler',
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
  'nestjs-best-practices': {
    source: 'https://github.com/Kadajett/agent-nestjs-skills/',
    skills: {
      // Using 'default' as the skill name since the original repository doesn't have a `skills` directory
      // and has skill files in the root, we will move those files to `skills/default`
      // and copyt that `default` skill to our `skills` directory as a single skill.
      default: 'nestjs-best-practices',
    },
    vendorBeforehook: _beforehook_createSkillsDirectory.bind(null, ['AGENTS.md', 'SKILL.md'], ['references', 'rules']),
    vendorPosthook: _posthook_removeSkillsDirectory,
  },
  'zod-skills': {
    source: 'https://github.com/anivar/zod-skill',
    skills: {
      // Using 'default' as the skill name since the original repository doesn't have a `skills` directory
      // and has skill files in the root, we will move those files to `skills/default`
      // and copyt that `default` skill to our `skills` directory as a single skill.
      default: 'zod-skill',
    },
    vendorBeforehook: _beforehook_createSkillsDirectory.bind(null, ['AGENTS.md', 'SKILL.md'], ['references', 'rules']),
    vendorPosthook: _posthook_removeSkillsDirectory,
  },
  'mcollina-node-skills': {
    source: 'https://github.com/mcollina/skills/',
    skills: {
      'documentation': 'documentation',
      'init': 'init',
      'node': 'node',
      'nodejs-core': 'nodejs-core',
      'skill-optimizer': 'skill-optimizer',
      'typescript-magician': 'typescript-magician',
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
 * Beforehook to create `skills` directory and move related files there, used for repositories that don't have a `skills` directory but have skill files in the root or other directories.
 */
async function _beforehook_createSkillsDirectory(
  filesToMove: string[] = [
    'AGENTS.md',
    'SKILL.md',
  ],
  directoriesToMove: string[] = [
    'references',
    'rules',
  ],
  sourcePath: string,
) {
  // Check if `skills` directory exists, if not, create it and move the related files there
  const fs = await import('node:fs')
  const path = await import('node:path')
  const skillsDir = path.join(sourcePath, 'skills')
  const singleSkillDir = path.join(skillsDir, 'default')

  if (!fs.existsSync(skillsDir)) {
    fs.mkdirSync(singleSkillDir, { recursive: true })
  }

  for (const file of filesToMove) {
    const src = path.join(sourcePath, file)
    const dest = path.join(singleSkillDir, file)

    if (fs.existsSync(src)) {
      fs.renameSync(src, dest)
    }
  }

  for (const dir of directoriesToMove) {
    const srcDir = path.join(sourcePath, dir)
    const destDir = path.join(singleSkillDir, dir)

    if (fs.existsSync(srcDir)) {
      fs.renameSync(srcDir, destDir)
    }
  }
}

/**
 * Posthook to remove `skills` directory, used for repositories that have a `skills` directory but we want to remove it after generating skills.
 */
async function _posthook_removeSkillsDirectory(
  sourcePath: string,
) {
  const { execSync } = await import('node:child_process')

  execSync(
    `git reset --hard HEAD && git clean -fdx`,
    {
      cwd: sourcePath,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    },
  ).trim()
}

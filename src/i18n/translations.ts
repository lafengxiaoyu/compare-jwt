export const translations = {
  en: {
    app: {
      title: '🔐 JWT Compare Tool',
      description: 'Compare JWT files or JWT changes in Git commits'
    },
    tabs: {
      jwt: 'JWT File Compare',
      git: 'Git Commit Compare',
      multiEnv: 'Multi-Env Compare'
    },
    jwtCompare: {
      title: 'JWT/JWE Token 1',
      placeholder1: 'Paste first JWT or JWE token...',
      title2: 'JWT/JWE Token 2',
      placeholder2: 'Paste second JWT or JWE token...',
      hint: 'Supports standard JWT (3 parts) or JWE encrypted token (5 parts)',
      button: 'Compare JWT/JWE',
      emptyError: 'Please enter two JWT tokens',
      decodedHeader: 'JWT 1 (Decoded)',
      decodedHeader2: 'JWT 2 (Decoded)'
    },
    gitCompare: {
      repoPath: 'Repository Path',
      repoPlaceholder: '/path/to/git/repo',
      commit1: 'Commit 1 (Base)',
      commitPlaceholder: 'commit hash or branch',
      commit2: 'Commit 2 (Compare)',
      button: 'Compare Git Commit',
      loading: 'Comparing...',
      scanning: 'Scanned {{total}} changed files, found {{found}} JWT files',
      hint: 'Note: Only checking .json, .txt, .jwt, .token, .env, .config files that may contain JWT',
      emptyError: 'Please fill all fields'
    },
    multiEnvCompare: {
      title: 'Multi-Environment JWT Compare',
      apiUrl: 'API URL:',
      apiPlaceholder: 'http://localhost:3001',
      repoPath: 'Repository Path *:',
      repoPlaceholder: '/path/to/your/repo',
      commit1: 'Commit 1 (Start) *:',
      commit1Placeholder: 'HEAD~10 or commit hash',
      commit2: 'Commit 2 (End) *:',
      commit2Placeholder: 'HEAD or commit hash',
      envDirs: 'Environment Directories (optional, comma-separated):',
      envDirsPlaceholder: 'config/prd, config/acc, config/tst',
      envDirsHint: 'Leave empty to auto-detect environment directories (prd, acc, tst, etc.)',
      button: 'Start Compare',
      loading: 'Comparing...',
      emptyError: 'Please fill all required fields',
      summary: 'Comparison Summary',
      jwtFiles: 'JWT files',
      environment: 'Environment',
      file: 'File',
      addedLines: 'lines added',
      removedLines: 'lines removed',
      unchangedLines: 'lines unchanged',
      noChanges: 'No JWT file changes found'
    },
    diff: {
      stats: '{{additions}} additions',
      deletions: '{{deletions}} deletions'
    },
    errors: {
      invalidToken: 'Invalid JWT/JWE token',
      parseFailed: 'Parse JWT failed'
    }
  },
  zh: {
    app: {
      title: '🔐 JWT对比工具',
      description: '对比JWT文件或Git提交中的JWT变化'
    },
    tabs: {
      jwt: 'JWT文件对比',
      git: 'Git提交对比',
      multiEnv: '多环境对比'
    },
    jwtCompare: {
      title: 'JWT/JWE Token 1',
      placeholder1: '粘贴第一个JWT或JWE token...',
      title2: 'JWT/JWE Token 2',
      placeholder2: '粘贴第二个JWT或JWE token...',
      hint: '支持标准JWT（3部分）或JWE加密token（5部分）',
      button: '对比 JWT/JWE',
      emptyError: '请输入两个JWT token',
      decodedHeader: 'JWT 1 (已解码)',
      decodedHeader2: 'JWT 2 (已解码)'
    },
    gitCompare: {
      repoPath: '仓库路径',
      repoPlaceholder: '/path/to/git/repo',
      commit1: 'Commit 1 (基准)',
      commitPlaceholder: 'commit hash或分支名',
      commit2: 'Commit 2 (对比)',
      button: '对比 Git 提交',
      loading: '对比中...',
      scanning: '扫描了 {{total}} 个修改的文件，找到 {{found}} 个JWT文件',
      hint: '提示：只检查 .json, .txt, .jwt, .token, .env, .config 等可能包含JWT的文件',
      emptyError: '请填写所有字段'
    },
    multiEnvCompare: {
      title: '多环境 JWT 对比',
      apiUrl: 'API 地址:',
      apiPlaceholder: 'http://localhost:3001',
      repoPath: '仓库路径 *:',
      repoPlaceholder: '/path/to/your/repo',
      commit1: 'Commit 1 (起始) *:',
      commit1Placeholder: 'HEAD~10 或 commit hash',
      commit2: 'Commit 2 (结束) *:',
      commit2Placeholder: 'HEAD 或 commit hash',
      envDirs: '环境目录 (可选，逗号分隔):',
      envDirsPlaceholder: 'config/prd, config/acc, config/tst',
      envDirsHint: '留空则自动检测环境目录 (prd, acc, tst 等)',
      button: '开始对比',
      loading: '对比中...',
      emptyError: '请填写所有必填字段',
      summary: '对比结果汇总',
      jwtFiles: '个 JWT 文件',
      environment: '环境',
      file: '文件',
      addedLines: '行新增',
      removedLines: '行删除',
      unchangedLines: '行未变',
      noChanges: '未找到 JWT 文件变化'
    },
    diff: {
      stats: '+{{additions}} 个添加',
      deletions: '-{{deletions}} 个删除'
    },
    errors: {
      invalidToken: '无效的JWT/JWE token',
      parseFailed: '解析JWT失败'
    }
  },
  nl: {
    app: {
      title: '🔐 JWT Vergelijk Tool',
      description: 'Vergelijk JWT bestanden of JWT wijzigingen in Git commits'
    },
    tabs: {
      jwt: 'JWT Bestand Vergelijken',
      git: 'Git Commit Vergelijken',
      multiEnv: 'Multi-Env Vergelijken'
    },
    jwtCompare: {
      title: 'JWT/JWE Token 1',
      placeholder1: 'Plak de eerste JWT of JWE token...',
      title2: 'JWT/JWE Token 2',
      placeholder2: 'Plak de tweede JWT of JWE token...',
      hint: 'Ondersteunt standaard JWT (3 delen) of JWE versleutelde token (5 delen)',
      button: 'Vergelijk JWT/JWE',
      emptyError: 'Voer twee JWT tokens in',
      decodedHeader: 'JWT 1 (Gedecodeerd)',
      decodedHeader2: 'JWT 2 (Gedecodeerd)'
    },
    gitCompare: {
      repoPath: 'Repository Pad',
      repoPlaceholder: '/pad/naar/git/repo',
      commit1: 'Commit 1 (Basis)',
      commitPlaceholder: 'commit hash of branch',
      commit2: 'Commit 2 (Vergelijk)',
      button: 'Vergelijk Git Commit',
      loading: 'Vergelijken...',
      scanning: '{{total}} gewijzigde bestanden gescand, {{found}} JWT bestanden gevonden',
      hint: 'Let op: Alleen .json, .txt, .jwt, .token, .env, .config bestanden die JWT kunnen bevatten worden gecontroleerd',
      emptyError: 'Vul alle velden in'
    },
    multiEnvCompare: {
      title: 'Multi-Omgeving JWT Vergelijken',
      apiUrl: 'API URL:',
      apiPlaceholder: 'http://localhost:3001',
      repoPath: 'Repository Pad *:',
      repoPlaceholder: '/pad/naar/jouw/repo',
      commit1: 'Commit 1 (Start) *:',
      commit1Placeholder: 'HEAD~10 of commit hash',
      commit2: 'Commit 2 (Einde) *:',
      commit2Placeholder: 'HEAD of commit hash',
      envDirs: 'Omgeving Mappen (optioneel, komma-gescheiden):',
      envDirsPlaceholder: 'config/prd, config/acc, config/tst',
      envDirsHint: 'Laat leeg om omgeving mappen automatisch te detecteren (prd, acc, tst, etc.)',
      button: 'Start Vergelijken',
      loading: 'Vergelijken...',
      emptyError: 'Vul alle verplichte velden in',
      summary: 'Vergelijking Samenvatting',
      jwtFiles: 'JWT bestanden',
      environment: 'Omgeving',
      file: 'Bestand',
      addedLines: 'regels toegevoegd',
      removedLines: 'regels verwijderd',
      unchangedLines: 'regels ongewijzigd',
      noChanges: 'Geen JWT bestandswijzigingen gevonden'
    },
    diff: {
      stats: '+{{additions}} toevoegingen',
      deletions: '-{{deletions}} verwijderingen'
    },
    errors: {
      invalidToken: 'Ongeldige JWT/JWE token',
      parseFailed: 'JWT parseren mislukt'
    }
  }
};

export type Language = 'en' | 'zh' | 'nl';

export type Translations = typeof translations;

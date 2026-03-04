export const translations = {
  en: {
    app: {
      title: '🔐 JWT Compare Tool',
      description: 'Compare JWT files or JWT changes in Git commits'
    },
    tabs: {
      jwt: 'JWT File Compare',
      git: 'Git Commit Compare'
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
      git: 'Git提交对比'
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
      git: 'Git Commit Vergelijken'
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

import React, { useState } from 'react';

interface TranslationFunction {
  (key: string, params?: Record<string, string | number>): string;
}

interface MultiEnvCompareProps {
  t?: TranslationFunction;
}

interface DiffChange {
  value: string;
  added?: boolean;
  removed?: boolean;
}

interface JWTFile {
  path: string;
  fullPath: string;
  changes: DiffChange[];
}

interface EnvironmentResult {
  environment: string;
  jwtCount: number;
  jwtFiles: JWTFile[];
}

const MultiEnvCompare: React.FC<MultiEnvCompareProps> = () => {
  const [repoPath, setRepoPath] = useState('');
  const [commit1, setCommit1] = useState('');
  const [commit2, setCommit2] = useState('');
  const [envDirs, setEnvDirs] = useState('');
  const [result, setResult] = useState<EnvironmentResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [apiBaseUrl, setApiBaseUrl] = useState('http://localhost:3001');

  const handleCompare = async () => {
    setError('');
    setResult(null);
    setLoading(true);

    if (!repoPath.trim() || !commit1.trim() || !commit2.trim()) {
      setError('请填写所有必填字段');
      setLoading(false);
      return;
    }

    try {
      const envDirsArray = envDirs.trim()
        .split(',')
        .map(dir => dir.trim())
        .filter(dir => dir.length > 0);

      const response = await fetch(`${apiBaseUrl}/api/git/compare-multiple-envs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          repoPath: repoPath.trim(),
          commit1: commit1.trim(),
          commit2: commit2.trim(),
          envDirs: envDirsArray,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '请求失败');
      }

      const data = await response.json();
      setResult(data.environments);
    } catch (err) {
      setError(err instanceof Error ? err.message : '对比失败');
    } finally {
      setLoading(false);
    }
  };

  const renderDiff = (changes: DiffChange[]) => {
    return changes.map((part, idx) => {
      const lines = part.value.split('\n').filter(l => l.trim() !== '');
      return lines.map((line, lineIdx) => (
        <div
          key={`${idx}-${lineIdx}`}
          className={
            part.added
              ? 'diff-line added'
              : part.removed
              ? 'diff-line removed'
              : 'diff-line unchanged'
          }
        >
          {line}
        </div>
      ));
    });
  };

  const calculateStats = (changes: DiffChange[]) => {
    let addedLines = 0;
    let removedLines = 0;
    let changedLines = 0;

    changes.forEach((change) => {
      const lines = change.value.split('\n').filter(l => l.trim() !== '');
      if (change.added) {
        addedLines += lines.length;
      } else if (change.removed) {
        removedLines += lines.length;
      } else {
        changedLines += lines.length;
      }
    });

    return { addedLines, removedLines, changedLines };
  };

  return (
    <div>
      <div className="input-section">
        <div className="input-box">
          <h3>多环境 JWT 对比</h3>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ color: '#c9d1d9', fontSize: '14px', display: 'block', marginBottom: '4px' }}>
              API 地址:
            </label>
            <input
              type="text"
              placeholder="http://localhost:3001"
              value={apiBaseUrl}
              onChange={(e) => setApiBaseUrl(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                background: '#0d1117',
                border: '1px solid #30363d',
                borderRadius: '4px',
                color: '#c9d1d9',
                fontSize: '14px',
              }}
            />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ color: '#c9d1d9', fontSize: '14px', display: 'block', marginBottom: '4px' }}>
              仓库路径 <span style={{ color: '#f85149' }}>*</span>:
            </label>
            <input
              type="text"
              placeholder="/path/to/your/repo"
              value={repoPath}
              onChange={(e) => setRepoPath(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                background: '#0d1117',
                border: '1px solid #30363d',
                borderRadius: '4px',
                color: '#c9d1d9',
                fontSize: '14px',
              }}
            />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ color: '#c9d1d9', fontSize: '14px', display: 'block', marginBottom: '4px' }}>
              Commit 1 (起始) <span style={{ color: '#f85149' }}>*</span>:
            </label>
            <input
              type="text"
              placeholder="HEAD~10 或 commit hash"
              value={commit1}
              onChange={(e) => setCommit1(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                background: '#0d1117',
                border: '1px solid #30363d',
                borderRadius: '4px',
                color: '#c9d1d9',
                fontSize: '14px',
              }}
            />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ color: '#c9d1d9', fontSize: '14px', display: 'block', marginBottom: '4px' }}>
              Commit 2 (结束) <span style={{ color: '#f85149' }}>*</span>:
            </label>
            <input
              type="text"
              placeholder="HEAD 或 commit hash"
              value={commit2}
              onChange={(e) => setCommit2(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                background: '#0d1117',
                border: '1px solid #30363d',
                borderRadius: '4px',
                color: '#c9d1d9',
                fontSize: '14px',
              }}
            />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ color: '#c9d1d9', fontSize: '14px', display: 'block', marginBottom: '4px' }}>
              环境目录 (可选，逗号分隔):
            </label>
            <input
              type="text"
              placeholder="config/prd, config/acc, config/tst"
              value={envDirs}
              onChange={(e) => setEnvDirs(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                background: '#0d1117',
                border: '1px solid #30363d',
                borderRadius: '4px',
                color: '#c9d1d9',
                fontSize: '14px',
              }}
            />
            <div style={{ marginTop: '4px', color: '#8b949e', fontSize: '12px' }}>
              留空则自动检测环境目录 (prd, acc, tst 等)
            </div>
          </div>
          <button
            className="compare-btn"
            onClick={handleCompare}
            disabled={loading}
            style={{ width: '100%', opacity: loading ? 0.6 : 1 }}
          >
            {loading ? '对比中...' : '开始对比'}
          </button>
        </div>
      </div>

      {error && (
        <div
          className="error-message"
          style={{
            padding: '12px',
            background: '#3d1616',
            border: '1px solid #f85149',
            borderRadius: '6px',
            marginTop: '16px',
            color: '#f85149',
          }}
        >
          {error}
        </div>
      )}

      {result && result.length > 0 && (
        <div style={{ marginTop: '24px' }}>
          <div
            style={{
              padding: '16px',
              background: '#161b22',
              border: '1px solid #30363d',
              borderRadius: '8px',
              marginBottom: '16px',
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: '12px' }}>对比结果汇总</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              {result.map((env) => (
                <div
                  key={env.environment}
                  style={{
                    padding: '12px',
                    background: '#0d1117',
                    border: '1px solid #30363d',
                    borderRadius: '6px',
                  }}
                >
                  <div style={{ color: '#3fb950', fontWeight: 'bold', marginBottom: '4px' }}>
                    {env.environment}
                  </div>
                  <div style={{ color: '#8b949e', fontSize: '14px' }}>
                    {env.jwtCount} 个 JWT 文件
                  </div>
                </div>
              ))}
            </div>
          </div>

          {result.map((env) => (
            <div key={env.environment} style={{ marginBottom: '24px' }}>
              <h3 style={{ marginTop: 0, marginBottom: '12px', color: '#c9d1d9' }}>
                环境: {env.environment}
              </h3>
              {env.jwtFiles.map((jwtFile) => {
                const stats = calculateStats(jwtFile.changes);
                return (
                  <div
                    key={jwtFile.fullPath}
                    style={{
                      marginBottom: '16px',
                      padding: '16px',
                      background: '#161b22',
                      border: '1px solid #30363d',
                      borderRadius: '8px',
                    }}
                  >
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ color: '#c9d1d9', fontWeight: '500', marginBottom: '8px' }}>
                        文件: {jwtFile.path}
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          gap: '16px',
                          fontSize: '13px',
                        }}
                      >
                        <span style={{ color: '#3fb950' }}>
                          +{stats.addedLines} 行
                        </span>
                        <span style={{ color: '#f85149' }}>
                          -{stats.removedLines} 行
                        </span>
                        <span style={{ color: '#8b949e' }}>
                          {stats.changedLines} 行未变
                        </span>
                      </div>
                    </div>
                    <div
                      style={{
                        padding: '12px',
                        background: '#0d1117',
                        border: '1px solid #30363d',
                        borderRadius: '6px',
                        maxHeight: '400px',
                        overflow: 'auto',
                      }}
                    >
                      <div style={{ fontFamily: 'monospace', fontSize: '12px' }}>
                        {renderDiff(jwtFile.changes)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {result && result.length === 0 && (
        <div
          style={{
            padding: '24px',
            background: '#161b22',
            border: '1px solid #30363d',
            borderRadius: '8px',
            marginTop: '16px',
            textAlign: 'center',
            color: '#8b949e',
          }}
        >
          未找到 JWT 文件变化
        </div>
      )}
    </div>
  );
};

export default MultiEnvCompare;

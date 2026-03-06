import React, { useState } from 'react';
import { useTranslation } from '../i18n';

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

const MultiEnvCompare: React.FC = () => {
  const { t } = useTranslation();
  const [repoPath, setRepoPath] = useState('');
  const [commit1, setCommit1] = useState('');
  const [commit2, setCommit2] = useState('');
  const [envDirs, setEnvDirs] = useState('');
  const [result, setResult] = useState<EnvironmentResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [apiBaseUrl, setApiBaseUrl] = useState('http://localhost:3001');
  const [reportLoading, setReportLoading] = useState(false);

  const handleCompare = async () => {
    setError('');
    setResult(null);
    setLoading(true);

    if (!repoPath.trim() || !commit1.trim() || !commit2.trim()) {
      setError(t('multiEnvCompare.emptyError'));
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
        throw new Error(data.error || 'Request failed');
      }

      const data = await response.json();
      setResult(data.environments);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('multiEnvCompare.emptyError'));
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

  const generateAndDownloadReport = async (format: 'markdown' | 'html' | 'json') => {
    setReportLoading(true);
    setError('');

    try {
      const requestBody = {
        repoPath,
        commit1,
        commit2,
        format
      };

      const response = await fetch(`${apiBaseUrl}/api/git/generate-report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '生成报告失败');
      }

      // Download the report
      const blob = new Blob([data.report], { type: getMimeType(format) });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = data.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成报告失败');
    } finally {
      setReportLoading(false);
    }
  };

  const getMimeType = (format: string) => {
    switch (format) {
      case 'markdown': return 'text/markdown';
      case 'html': return 'text/html';
      case 'json': return 'application/json';
      default: return 'text/plain';
    }
  };

  return (
    <div>
      <div className="input-section">
        <div className="input-box">
          <h3>{t('multiEnvCompare.title')}</h3>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ color: '#c9d1d9', fontSize: '14px', display: 'block', marginBottom: '4px' }}>
              {t('multiEnvCompare.apiUrl')}
            </label>
            <input
              type="text"
              placeholder={t('multiEnvCompare.apiPlaceholder')}
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
              {t('multiEnvCompare.repoPath')}
            </label>
            <input
              type="text"
              placeholder={t('multiEnvCompare.repoPlaceholder')}
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
              {t('multiEnvCompare.commit1')}
            </label>
            <input
              type="text"
              placeholder={t('multiEnvCompare.commit1Placeholder')}
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
              {t('multiEnvCompare.commit2')}
            </label>
            <input
              type="text"
              placeholder={t('multiEnvCompare.commit2Placeholder')}
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
              {t('multiEnvCompare.envDirs')}
            </label>
            <input
              type="text"
              placeholder={t('multiEnvCompare.envDirsPlaceholder')}
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
              {t('multiEnvCompare.envDirsHint')}
            </div>
          </div>
          <button
            className="compare-btn"
            onClick={handleCompare}
            disabled={loading}
            style={{ width: '100%', opacity: loading ? 0.6 : 1 }}
          >
            {loading ? t('multiEnvCompare.loading') : t('multiEnvCompare.button')}
          </button>

          {result && result.length > 0 && (
            <div style={{ marginTop: '10px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                className="compare-btn"
                onClick={() => generateAndDownloadReport('markdown')}
                disabled={reportLoading}
                style={{ fontSize: '13px', padding: '8px 16px', opacity: reportLoading ? 0.6 : 1 }}
              >
                {reportLoading ? '生成中...' : '📄 下载 Markdown 报告'}
              </button>
              <button
                className="compare-btn"
                onClick={() => generateAndDownloadReport('html')}
                disabled={reportLoading}
                style={{ fontSize: '13px', padding: '8px 16px', opacity: reportLoading ? 0.6 : 1 }}
              >
                {reportLoading ? '生成中...' : '🌐 下载 HTML 报告'}
              </button>
              <button
                className="compare-btn"
                onClick={() => generateAndDownloadReport('json')}
                disabled={reportLoading}
                style={{ fontSize: '13px', padding: '8px 16px', opacity: reportLoading ? 0.6 : 1 }}
              >
                {reportLoading ? '生成中...' : '📦 下载 JSON 报告'}
              </button>
            </div>
          )}
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
            <h3 style={{ marginTop: 0, marginBottom: '12px' }}>{t('multiEnvCompare.summary')}</h3>
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
                    {env.jwtCount} {t('multiEnvCompare.jwtFiles')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {result.map((env) => (
            <div key={env.environment} style={{ marginBottom: '24px' }}>
              <h3 style={{ marginTop: 0, marginBottom: '12px', color: '#c9d1d9' }}>
                {t('multiEnvCompare.environment')}: {env.environment}
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
                        {t('multiEnvCompare.file')}: {jwtFile.path}
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          gap: '16px',
                          fontSize: '13px',
                        }}
                      >
                        <span style={{ color: '#3fb950' }}>
                          +{stats.addedLines} {t('multiEnvCompare.addedLines')}
                        </span>
                        <span style={{ color: '#f85149' }}>
                          -{stats.removedLines} {t('multiEnvCompare.removedLines')}
                        </span>
                        <span style={{ color: '#8b949e' }}>
                          {stats.changedLines} {t('multiEnvCompare.unchangedLines')}
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
          {t('multiEnvCompare.noChanges')}
        </div>
      )}
    </div>
  );
};

export default MultiEnvCompare;

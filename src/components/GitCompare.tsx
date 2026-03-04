import React, { useState } from 'react';
import * as diff from 'diff';

interface JwtFile {
  path: string;
  changes: diff.Change[];
}

interface CompareResult {
  files: JwtFile[];
  totalFiles: number;
  processedFiles: number;
}

interface TranslationFunction {
  (key: string, params?: Record<string, string | number>): string;
}

interface GitCompareProps {
  t: TranslationFunction;
}

const GitCompare: React.FC<GitCompareProps> = ({ t }) => {
  const [repoPath, setRepoPath] = useState('');
  const [commit1, setCommit1] = useState('');
  const [commit2, setCommit2] = useState('');
  const [jwtFiles, setJwtFiles] = useState<JwtFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ totalFiles: 0, processedFiles: 0 });

  const handleCompare = async () => {
    setError('');
    setJwtFiles([]);
    setSelectedFile(0);
    setStats({ totalFiles: 0, processedFiles: 0 });

    if (!repoPath.trim() || !commit1.trim() || !commit2.trim()) {
      setError(t('gitCompare.emptyError'));
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/git/compare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          repoPath,
          commit1,
          commit2,
        }),
      });

      const data: CompareResult = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '对比失败');
      }

      setJwtFiles(data.files);
      setStats({ 
        totalFiles: data.totalFiles, 
        processedFiles: data.processedFiles 
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.parseFailed'));
    } finally {
      setLoading(false);
    }
  };

  const renderDiff = (changes: diff.Change[]) => {
    let leftLineNum = 1;
    let rightLineNum = 1;
    const leftLines: JSX.Element[] = [];
    const rightLines: JSX.Element[] = [];

    changes.forEach((part, index) => {
      const lines = part.value.split('\n');
      if (lines[lines.length - 1] === '') {
        lines.pop();
      }

      lines.forEach((line, lineIndex) => {
        if (part.added) {
          rightLines.push(
            <div key={`right-${index}-${lineIndex}`} className="diff-line added">
              <div className="diff-line-num">{rightLineNum}</div>
              <div className="diff-line-content">+ {line}</div>
            </div>
          );
          rightLineNum++;
        } else if (part.removed) {
          leftLines.push(
            <div key={`left-${index}-${lineIndex}`} className="diff-line removed">
              <div className="diff-line-num">{leftLineNum}</div>
              <div className="diff-line-content">- {line}</div>
            </div>
          );
          leftLineNum++;
        } else {
          leftLines.push(
            <div key={`left-${index}-${lineIndex}`} className="diff-line unchanged">
              <div className="diff-line-num">{leftLineNum}</div>
              <div className="diff-line-content">  {line}</div>
            </div>
          );
          leftLineNum++;

          rightLines.push(
            <div key={`right-${index}-${lineIndex}`} className="diff-line unchanged">
              <div className="diff-line-num">{rightLineNum}</div>
              <div className="diff-line-content">  {line}</div>
            </div>
          );
          rightLineNum++;
        }
      });
    });

    const maxLines = Math.max(leftLines.length, rightLines.length);
    while (leftLines.length < maxLines) {
      leftLines.push(
        <div key={`left-empty-${leftLines.length}`} className="diff-line">
          <div className="diff-line-num"></div>
          <div className="diff-line-content"></div>
        </div>
      );
    }
    while (rightLines.length < maxLines) {
      rightLines.push(
        <div key={`right-empty-${rightLines.length}`} className="diff-line">
          <div className="diff-line-num"></div>
          <div className="diff-line-content"></div>
        </div>
      );
    }

    return (
      <div className="diff-content">
        <div className="diff-side">{leftLines}</div>
        <div className="diff-side">{rightLines}</div>
      </div>
    );
  };

  const countStats = (changes: diff.Change[]) => {
    let additions = 0;
    let deletions = 0;

    changes.forEach(part => {
      const lines = part.value.split('\n').filter(l => l !== '');
      if (part.added) {
        additions += lines.length;
      } else if (part.removed) {
        deletions += lines.length;
      }
    });

    return { additions, deletions };
  };

  return (
    <div>
      <div className="input-section" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
        <div className="input-box">
          <h3>{t('gitCompare.repoPath')}</h3>
          <input
            type="text"
            placeholder={t('gitCompare.repoPlaceholder')}
            value={repoPath}
            onChange={(e) => setRepoPath(e.target.value)}
          />
        </div>
        <div className="input-box">
          <h3>{t('gitCompare.commit1')}</h3>
          <input
            type="text"
            placeholder={t('gitCompare.commitPlaceholder')}
            value={commit1}
            onChange={(e) => setCommit1(e.target.value)}
          />
        </div>
        <div className="input-box">
          <h3>{t('gitCompare.commit2')}</h3>
          <input
            type="text"
            placeholder={t('gitCompare.commitPlaceholder')}
            value={commit2}
            onChange={(e) => setCommit2(e.target.value)}
          />
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <button className="compare-btn" onClick={handleCompare} disabled={loading}>
        {loading ? t('gitCompare.loading') : t('gitCompare.button')}
      </button>

      {stats.totalFiles > 0 && (
        <div style={{ 
          marginTop: '15px', 
          padding: '15px', 
          background: '#161b22', 
          borderRadius: '6px',
          border: '1px solid #30363d'
        }}>
          <div style={{ color: '#8b949e', fontSize: '14px', marginBottom: '8px' }}>
            {t('gitCompare.scanning', { total: stats.totalFiles, found: jwtFiles.length })}
          </div>
          {jwtFiles.length === 0 && (
            <div style={{ color: '#8b949e', fontSize: '13px', fontStyle: 'italic' }}>
              {t('gitCompare.hint')}
            </div>
          )}
        </div>
      )}

      {jwtFiles.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <div className="file-list">
            {jwtFiles.map((file, index) => {
              const stats = countStats(file.changes);
              return (
                <div
                  key={index}
                  className={`file-item ${selectedFile === index ? 'active' : ''}`}
                  onClick={() => setSelectedFile(index)}
                >
                  <span className="file-icon">📄</span>
                  <span>{file.path}</span>
                  {stats.additions > 0 && (
                    <span style={{ color: '#3fb950', marginLeft: 'auto', fontSize: '12px' }}>
                      +{stats.additions}
                    </span>
                  )}
                  {stats.deletions > 0 && (
                    <span style={{ color: '#f85149', marginLeft: '5px', fontSize: '12px' }}>
                      -{stats.deletions}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {jwtFiles[selectedFile] && (
            <div className="diff-container">
              <div className="diff-header">
                <h3>{jwtFiles[selectedFile].path}</h3>
              </div>
              <div className="stats">
                <div className="stat additions">
                  +{countStats(jwtFiles[selectedFile].changes).additions} additions
                </div>
                <div className="stat deletions">
                  -{countStats(jwtFiles[selectedFile].changes).deletions} deletions
                </div>
              </div>
              {renderDiff(jwtFiles[selectedFile].changes)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GitCompare;

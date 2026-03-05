import React, { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import * as diff from 'diff';

interface TranslationFunction {
  (key: string, params?: Record<string, string | number>): string;
}

interface JWTCompareProps {
  t: TranslationFunction;
}

// Base64 decode helper for browser
const base64Decode = (str: string): string => {
  try {
    // Handle URL-safe Base64
    const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    // Decode using atob
    const decoded = atob(base64);
    // Handle UTF-8
    const bytes = new Uint8Array(decoded.length);
    for (let i = 0; i < decoded.length; i++) {
      bytes[i] = decoded.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  } catch (err) {
    // Fallback: try simple decode
    try {
      return atob(str.replace(/-/g, '+').replace(/_/g, '/'));
    } catch {
      throw new Error('Failed to decode base64');
    }
  }
};

const JWTCompare: React.FC<JWTCompareProps> = ({ t }) => {
  const [jwt1, setJwt1] = useState('');
  const [jwt2, setJwt2] = useState('');
  const [diffResult, setDiffResult] = useState<diff.Change[]>([]);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState<'diff' | 'table'>('diff');

  const decodeJWT = (token: string) => {
    try {
      const parts = token.trim().split('.');
      
      if (parts.length === 3) {
        // Standard JWT (JWS)
        const decoded = jwtDecode(token);
        return JSON.stringify(decoded, null, 2);
      } else if (parts.length === 2) {
        // JWT without signature (header.payload only)
        const payload = JSON.parse(base64Decode(parts[1]));
        const header = JSON.parse(base64Decode(parts[0]));
        return JSON.stringify({
          header: header,
          payload: payload,
          note: 'This JWT has no signature part (2 parts only)'
        }, null, 2);
      } else if (parts.length === 5) {
        // JWE (JSON Web Encryption) - can't decrypt without private key
        // Decode only the header
        const header = JSON.parse(base64Decode(parts[0]));
        return JSON.stringify({
          type: 'JWE (Encrypted)',
          header: header,
          note: 'This is an encrypted JWE. Only the header can be decoded without the decryption key.',
          structure: {
            header: parts[0].substring(0, 50) + '...',
            encryptedKey: parts[1].substring(0, 30) + '...',
            iv: parts[2].substring(0, 30) + '...',
            ciphertext: parts[3].substring(0, 30) + '...',
            authTag: parts[4].substring(0, 30) + '...'
          }
        }, null, 2);
      } else {
        throw new Error(`Invalid token format: expected 2 parts (JWT no sig), 3 parts (JWT), or 5 parts (JWE), got ${parts.length} parts`);
      }
    } catch (err) {
      if (err instanceof Error) {
        throw err;
      }
      throw new Error('Invalid JWT/JWE token');
    }
  };

  const handleCompare = () => {
    setError('');
    setDiffResult([]);

    if (!jwt1.trim() || !jwt2.trim()) {
      setError(t('jwtCompare.emptyError'));
      return;
    }

    try {
      const json1 = decodeJWT(jwt1);
      const json2 = decodeJWT(jwt2);

      const changes = diff.diffLines(json1, json2);
      setDiffResult(changes);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.parseFailed'));
    }
  };

  const getDecodedJWTs = () => {
    if (!jwt1.trim() || !jwt2.trim()) return null;
    try {
      return {
        decoded1: JSON.parse(decodeJWT(jwt1)),
        decoded2: JSON.parse(decodeJWT(jwt2))
      };
    } catch {
      return null;
    }
  };

  const renderDiffLines = (str1: string, str2: string) => {
    const changes = diff.diffLines(str1, str2);
    return changes.map((part, idx) => {
      const lines = part.value.split('\n').filter(l => l.trim() !== '');
      return lines.map((line, lineIdx) => (
        <div key={`${idx}-${lineIdx}`} className={part.added ? 'diff-line-added' : part.removed ? 'diff-line-removed' : 'diff-line-unchanged'}>
          {line}
        </div>
      ));
    });
  };

  const renderClaimsTable = () => {
    const decoded = getDecodedJWTs();
    if (!decoded) return null;

    const { decoded1, decoded2 } = decoded;
    const allKeys = new Set([...Object.keys(decoded1), ...Object.keys(decoded2)]);
    const keys = Array.from(allKeys);

    return (
      <div className="claims-table-container">
        <h3 style={{ marginBottom: '16px' }}>Claims Comparison</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #30363d' }}>
              <th style={{ textAlign: 'left', padding: '12px', color: '#c9d1d9' }}>Claim</th>
              <th style={{ textAlign: 'left', padding: '12px', color: '#c9d1d9' }}>JWT 1</th>
              <th style={{ textAlign: 'left', padding: '12px', color: '#c9d1d9' }}>JWT 2</th>
              <th style={{ textAlign: 'left', padding: '12px', color: '#c9d1d9' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {keys.map((key) => {
              const value1 = decoded1[key];
              const value2 = decoded2[key];
              const value1Str = JSON.stringify(value1, null, 2);
              const value2Str = JSON.stringify(value2, null, 2);
              const isAdded = !(key in decoded1) && (key in decoded2);
              const isRemoved = (key in decoded1) && !(key in decoded2);
              const isChanged = (key in decoded1) && (key in decoded2) && JSON.stringify(value1) !== JSON.stringify(value2);

              return (
                <tr key={key} style={{ borderBottom: '1px solid #21262d' }}>
                  <td style={{ padding: '12px', color: '#c9d1d9', fontWeight: '500' }}>{key}</td>
                  <td style={{ padding: '12px', color: isRemoved ? '#f85149' : '#8b949e' }}>
                    <div className="diff-lines">
                      {isRemoved ? <div className="diff-line-removed">{value1Str}</div> :
                       isChanged ? renderDiffLines(value1Str, value2Str) :
                       <div className="diff-line-unchanged">{value1Str}</div>}
                    </div>
                  </td>
                  <td style={{ padding: '12px', color: isAdded ? '#3fb950' : '#8b949e' }}>
                    <div className="diff-lines">
                      {isAdded ? <div className="diff-line-added">{value2Str}</div> :
                       isChanged ? renderDiffLines(value1Str, value2Str) :
                       <div className="diff-line-unchanged">{value2Str}</div>}
                    </div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    {isAdded && <span style={{ color: '#3fb950', fontWeight: 'bold' }}>Added</span>}
                    {isRemoved && <span style={{ color: '#f85149', fontWeight: 'bold' }}>Removed</span>}
                    {isChanged && <span style={{ color: '#d29922', fontWeight: 'bold' }}>Changed</span>}
                    {!isAdded && !isRemoved && !isChanged && <span style={{ color: '#8b949e' }}>Unchanged</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const renderDiff = () => {
    if (diffResult.length === 0) return null;

    let leftLineNum = 1;
    let rightLineNum = 1;
    const leftLines: JSX.Element[] = [];
    const rightLines: JSX.Element[] = [];

    diffResult.forEach((part, index) => {
      const lines = part.value.split('\n');
      // Remove last empty line if exists
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
          // Unchanged - add to both sides
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

    // Balance the lines
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
      <div className="diff-container">
        <div className="diff-header">
          <h3>{t('jwtCompare.decodedHeader')}</h3>
          <h3>{t('jwtCompare.decodedHeader2')}</h3>
        </div>
        <div className="diff-content">
          <div className="diff-side">{leftLines}</div>
          <div className="diff-side">{rightLines}</div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="input-section">
        <div className="input-box">
          <h3>{t('jwtCompare.title')}</h3>
          <textarea
            placeholder={t('jwtCompare.placeholder1')}
            value={jwt1}
            onChange={(e) => setJwt1(e.target.value)}
          />
          <div style={{ marginTop: '8px', color: '#8b949e', fontSize: '12px' }}>
            {t('jwtCompare.hint')}
          </div>
        </div>
        <div className="input-box">
          <h3>{t('jwtCompare.title2')}</h3>
          <textarea
            placeholder={t('jwtCompare.placeholder2')}
            value={jwt2}
            onChange={(e) => setJwt2(e.target.value)}
          />
          <div style={{ marginTop: '8px', color: '#8b949e', fontSize: '12px' }}>
            {t('jwtCompare.hint')}
          </div>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <button className="compare-btn" onClick={handleCompare}>
        {t('jwtCompare.button')}
      </button>

      {diffResult.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <div style={{ marginBottom: '15px' }}>
            <button
              className={`view-toggle ${viewMode === 'diff' ? 'active' : ''}`}
              onClick={() => setViewMode('diff')}
              style={{ marginRight: '10px', padding: '8px 16px', background: viewMode === 'diff' ? '#238636' : '#21262d', color: '#c9d1d9', border: '1px solid #30363d', borderRadius: '6px', cursor: 'pointer' }}
            >
              Diff View
            </button>
            <button
              className={`view-toggle ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              style={{ padding: '8px 16px', background: viewMode === 'table' ? '#238636' : '#21262d', color: '#c9d1d9', border: '1px solid #30363d', borderRadius: '6px', cursor: 'pointer' }}
            >
              Claims Table
            </button>
          </div>
          {viewMode === 'diff' ? renderDiff() : renderClaimsTable()}
        </div>
      )}
    </div>
  );
};

export default JWTCompare;
